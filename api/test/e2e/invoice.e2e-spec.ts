import request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpExceptionFilter } from '@common/errors';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  Adjustment,
  Campaign,
  CampaignLineItem,
  Invoice,
  InvoiceLineItem,
} from '@modules/postgres/entities';
import { InvoiceStatus } from '@modules/postgres/enum';
import { AppModule } from '../../src/infrastructure/app.module';

describe('Invoice & Adjustment endpoints (e2e)', () => {
  let app: INestApplication<App>;
  let campaignRepo: Repository<Campaign>;
  let campaignLineItemRepo: Repository<CampaignLineItem>;
  let invoiceRepo: Repository<Invoice>;
  let invoiceLineItemRepo: Repository<InvoiceLineItem>;
  let adjustmentRepo: Repository<Adjustment>;

  let campaignId: number;
  let campaignLineItemId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.setGlobalPrefix('api/v1');
    await app.init();

    campaignRepo = app.get(getRepositoryToken(Campaign));
    campaignLineItemRepo = app.get(getRepositoryToken(CampaignLineItem));
    invoiceRepo = app.get(getRepositoryToken(Invoice));
    invoiceLineItemRepo = app.get(getRepositoryToken(InvoiceLineItem));
    adjustmentRepo = app.get(getRepositoryToken(Adjustment));

    // Seed prerequisite campaign + line item
    const campaign = await campaignRepo.save(
      campaignRepo.create({
        name: 'E2E Campaign',
        advertiser: 'TestCorp',
        startDate: 1780300800000,
        endDate: 1788220800000,
        archivedAt: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    );
    campaignId = campaign.id;

    const cli = await campaignLineItemRepo.save(
      campaignLineItemRepo.create({
        name: 'Display Ads',
        bookedAmount: 50000,
        actualAmount: 48750,
        campaignId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    );
    campaignLineItemId = cli.id;
  }, 30_000);

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await adjustmentRepo.clear();
    await invoiceLineItemRepo.clear();
    await invoiceRepo.clear();
  });

  async function seedInvoice(overrides: Partial<Invoice> = {}) {
    return invoiceRepo.save(
      invoiceRepo.create({
        invoiceNumber: `INV-${Date.now()}`,
        status: InvoiceStatus.Draft,
        campaignId,
        archivedAt: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...overrides,
      }),
    );
  }

  async function seedLineItem(invoiceId: number) {
    return invoiceLineItemRepo.save(
      invoiceLineItemRepo.create({
        name: 'Display Ads',
        actualAmount: 48750,
        invoiceId,
        campaignLineItemId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    );
  }

  async function seedAdjustment(invoiceLineItemId: number) {
    return adjustmentRepo.save(
      adjustmentRepo.create({
        amount: -1218.75,
        reason: 'Under-delivery credit',
        createdBy: 'jane@agency.com',
        invoiceLineItemId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    );
  }

  // ── Invoice List ──

  describe('GET /api/v1/invoices', () => {
    it('should return paginated invoices', async () => {
      await seedInvoice({ invoiceNumber: 'INV-001' });
      await seedInvoice({ invoiceNumber: 'INV-002' });

      const res = await request(app.getHttpServer())
        .get('/api/v1/invoices')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(2);
      expect(res.body.data.meta).toBeDefined();
    });

    it('should filter by status', async () => {
      await seedInvoice({
        invoiceNumber: 'INV-D',
        status: InvoiceStatus.Draft,
      });
      await seedInvoice({
        invoiceNumber: 'INV-F',
        status: InvoiceStatus.Finalized,
      });

      const res = await request(app.getHttpServer())
        .get('/api/v1/invoices?status=draft')
        .expect(200);

      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].status).toBe('draft');
    });
  });

  // ── Invoice Detail ──

  describe('GET /api/v1/invoices/:id', () => {
    it('should return invoice with line items and adjustments', async () => {
      const invoice = await seedInvoice({ invoiceNumber: 'INV-DETAIL' });
      const lineItem = await seedLineItem(invoice.id);
      await seedAdjustment(lineItem.id);

      const res = await request(app.getHttpServer())
        .get(`/api/v1/invoices/${invoice.id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(invoice.id);
      expect(res.body.data.lineItems).toHaveLength(1);
      expect(res.body.data.lineItems[0].adjustments).toHaveLength(1);
    });

    it('should return 404 for non-existent invoice', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/invoices/99999')
        .expect(404);
    });
  });

  // ── Archive / Unarchive ──

  describe('PATCH /api/v1/invoices/:id/archive', () => {
    it('should archive an invoice', async () => {
      const invoice = await seedInvoice({ invoiceNumber: 'INV-ARC' });

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/invoices/${invoice.id}/archive`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.archivedAt).not.toBeNull();
    });

    it('should return 409 if already archived', async () => {
      const invoice = await seedInvoice({
        invoiceNumber: 'INV-ARC2',
        archivedAt: Date.now(),
      });

      await request(app.getHttpServer())
        .patch(`/api/v1/invoices/${invoice.id}/archive`)
        .expect(409);
    });
  });

  describe('PATCH /api/v1/invoices/:id/unarchive', () => {
    it('should unarchive an invoice', async () => {
      const invoice = await seedInvoice({
        invoiceNumber: 'INV-UARC',
        archivedAt: Date.now(),
      });

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/invoices/${invoice.id}/unarchive`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.archivedAt).toBeNull();
    });
  });

  // ── Adjustment CRUD ──

  describe('POST /api/v1/invoices/:id/line-items/:lineItemId/adjustments', () => {
    it('should create an adjustment', async () => {
      const invoice = await seedInvoice({ invoiceNumber: 'INV-ADJ' });
      const lineItem = await seedLineItem(invoice.id);

      const res = await request(app.getHttpServer())
        .post(
          `/api/v1/invoices/${invoice.id}/line-items/${lineItem.id}/adjustments`,
        )
        .send({
          amount: -500,
          reason: 'E2E test adjustment',
          createdBy: 'e2e@test.com',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
    });

    it('should return 403 if invoice is finalized', async () => {
      const invoice = await seedInvoice({
        invoiceNumber: 'INV-FIN',
        status: InvoiceStatus.Finalized,
      });
      const lineItem = await seedLineItem(invoice.id);

      await request(app.getHttpServer())
        .post(
          `/api/v1/invoices/${invoice.id}/line-items/${lineItem.id}/adjustments`,
        )
        .send({
          amount: -100,
          reason: 'Should fail',
          createdBy: 'test@test.com',
        })
        .expect(403);
    });
  });

  describe('PATCH /api/v1/invoices/:id/line-items/:lineItemId/adjustments/:adjustmentId', () => {
    it('should update an adjustment', async () => {
      const invoice = await seedInvoice({ invoiceNumber: 'INV-UPD' });
      const lineItem = await seedLineItem(invoice.id);
      const adjustment = await seedAdjustment(lineItem.id);

      const res = await request(app.getHttpServer())
        .patch(
          `/api/v1/invoices/${invoice.id}/line-items/${lineItem.id}/adjustments/${adjustment.id}`,
        )
        .send({
          amount: -2000,
          updatedBy: 'editor@agency.com',
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(-2000);
    });
  });

  describe('DELETE /api/v1/invoices/:id/line-items/:lineItemId/adjustments/:adjustmentId', () => {
    it('should delete an adjustment', async () => {
      const invoice = await seedInvoice({ invoiceNumber: 'INV-DEL' });
      const lineItem = await seedLineItem(invoice.id);
      const adjustment = await seedAdjustment(lineItem.id);

      const res = await request(app.getHttpServer())
        .delete(
          `/api/v1/invoices/${invoice.id}/line-items/${lineItem.id}/adjustments/${adjustment.id}?deletedBy=admin@agency.com`,
        )
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.deleted).toBe(true);
    });
  });

  // ── Adjustment History ──

  describe('GET .../adjustments/:adjustmentId/history', () => {
    it('should return audit history after adjustment operations', async () => {
      const invoice = await seedInvoice({ invoiceNumber: 'INV-HIST' });
      const lineItem = await seedLineItem(invoice.id);

      // Create an adjustment via API (this also creates an audit log)
      const createRes = await request(app.getHttpServer())
        .post(
          `/api/v1/invoices/${invoice.id}/line-items/${lineItem.id}/adjustments`,
        )
        .send({
          amount: -300,
          reason: 'History test',
          createdBy: 'historian@test.com',
        })
        .expect(201);

      const adjustmentId = createRes.body.data.id;

      const histRes = await request(app.getHttpServer())
        .get(
          `/api/v1/invoices/${invoice.id}/line-items/${lineItem.id}/adjustments/${adjustmentId}/history`,
        )
        .expect(200);

      expect(histRes.body.success).toBe(true);
      expect(histRes.body.data.items).toHaveLength(1);
    });
  });
});
