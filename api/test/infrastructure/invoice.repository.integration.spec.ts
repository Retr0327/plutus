import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Adjustment as AdjustmentDomain } from '@plutus/domain/invoice/invoice-line-item/adjustment/adjustment';
import { InvoiceDomainRepository } from '@plutus/infrastructure/repository/invoice.repository';
import {
  Adjustment,
  Campaign,
  CampaignLineItem,
  Invoice,
  InvoiceLineItem,
} from '@modules/postgres/entities';
import { InvoiceStatus } from '@modules/postgres/enum';
import { PostgresModule } from '@modules/postgres/postgres.module';

describe('InvoiceDomainRepository (integration)', () => {
  let module: TestingModule;
  let repo: InvoiceDomainRepository;
  let invoiceRepo: Repository<Invoice>;
  let campaignRepo: Repository<Campaign>;
  let campaignLineItemRepo: Repository<CampaignLineItem>;
  let invoiceLineItemRepo: Repository<InvoiceLineItem>;
  let adjustmentRepo: Repository<Adjustment>;

  let campaignId: number;
  let campaignLineItemId: number;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PostgresModule],
      providers: [InvoiceDomainRepository],
    }).compile();

    repo = module.get(InvoiceDomainRepository);
    invoiceRepo = module.get(getRepositoryToken(Invoice));
    campaignRepo = module.get(getRepositoryToken(Campaign));
    campaignLineItemRepo = module.get(getRepositoryToken(CampaignLineItem));
    invoiceLineItemRepo = module.get(getRepositoryToken(InvoiceLineItem));
    adjustmentRepo = module.get(getRepositoryToken(Adjustment));

    // Seed prerequisite campaign + campaign line item (FK references)
    const campaign = await campaignRepo.save(
      campaignRepo.create({
        name: 'Test Campaign',
        advertiser: 'Nike',
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
    await module.close();
  });

  beforeEach(async () => {
    await adjustmentRepo.clear();
    await invoiceLineItemRepo.clear();
    await invoiceRepo.clear();
  });

  async function seedInvoice(overrides: Partial<Invoice> = {}) {
    const invoice = invoiceRepo.create({
      invoiceNumber: `INV-${Date.now()}`,
      status: InvoiceStatus.Draft,
      campaignId,
      archivedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...overrides,
    });
    return invoiceRepo.save(invoice);
  }

  async function seedLineItem(
    invoiceId: number,
    overrides: Partial<InvoiceLineItem> = {},
  ) {
    const lineItem = invoiceLineItemRepo.create({
      name: 'Display Ads',
      actualAmount: 48750,
      invoiceId,
      campaignLineItemId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...overrides,
    });
    return invoiceLineItemRepo.save(lineItem);
  }

  async function seedAdjustment(
    invoiceLineItemId: number,
    overrides: Partial<Adjustment> = {},
  ) {
    const adj = adjustmentRepo.create({
      amount: -1218.75,
      reason: 'Under-delivery credit',
      createdBy: 'jane@agency.com',
      invoiceLineItemId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...overrides,
    });
    return adjustmentRepo.save(adj);
  }

  describe('findById', () => {
    it('should return a domain invoice with nested line items and adjustments', async () => {
      const saved = await seedInvoice();
      const lineItem = await seedLineItem(saved.id);
      await seedAdjustment(lineItem.id);

      const result = await repo.findById(saved.id);

      expect(result).not.toBeNull();
      expect(result!.id.value).toBe(saved.id);
      expect(result!.lineItems.items).toHaveLength(1);
      expect(result!.lineItems.items[0].adjustments.items).toHaveLength(1);
    });

    it('should return null for non-existent id', async () => {
      const result = await repo.findById(99999);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated invoices', async () => {
      await seedInvoice({ invoiceNumber: 'INV-001' });
      await seedInvoice({ invoiceNumber: 'INV-002' });
      await seedInvoice({ invoiceNumber: 'INV-003' });

      const result = await repo.findAll({ page: 1, limit: 2 });
      expect(result.items).toHaveLength(2);
      expect(result.totalItems).toBe(3);
    });

    it('should exclude archived invoices by default', async () => {
      await seedInvoice({ invoiceNumber: 'INV-A' });
      await seedInvoice({ invoiceNumber: 'INV-B', archivedAt: Date.now() });

      const result = await repo.findAll();
      expect(result.items).toHaveLength(1);
    });

    it('should include archived when includeArchived is true', async () => {
      await seedInvoice({ invoiceNumber: 'INV-A' });
      await seedInvoice({ invoiceNumber: 'INV-B', archivedAt: Date.now() });

      const result = await repo.findAll({ includeArchived: true });
      expect(result.items).toHaveLength(2);
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

      const result = await repo.findAll({ status: InvoiceStatus.Draft });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].isDraft()).toBe(true);
    });

    it('should filter by campaignId', async () => {
      await seedInvoice({ invoiceNumber: 'INV-C1' });

      const result = await repo.findAll({ campaignId });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('save', () => {
    it('should persist archive state change', async () => {
      const saved = await seedInvoice();
      const domain = await repo.findById(saved.id);
      expect(domain).not.toBeNull();

      domain!.archive();
      await repo.save(domain!);

      const updated = await repo.findById(saved.id);
      expect(updated!.isArchived).toBe(true);
    });

    it('should persist new adjustments via collection tracking', async () => {
      const saved = await seedInvoice();
      const lineItem = await seedLineItem(saved.id);

      const domain = await repo.findById(saved.id);
      expect(domain).not.toBeNull();

      // Create and add a new adjustment via domain
      const adjResult = AdjustmentDomain.create({
        invoiceLineItemId: lineItem.id,
        amount: -500,
        reason: 'Test adjustment',
        createdBy: 'test@test.com',
      });
      expect(adjResult.isOk()).toBe(true);

      if (adjResult.isOk()) {
        const domainLineItem = domain!.lineItems.items[0];
        domain!.addAdjustment(domainLineItem.id, adjResult.value);
        await repo.save(domain!);

        const reloaded = await repo.findById(saved.id);
        expect(reloaded!.lineItems.items[0].adjustments.items).toHaveLength(1);
      }
    });
  });
});
