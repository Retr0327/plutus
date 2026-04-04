import { HttpExceptionFilter } from '@common/errors';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  Campaign,
  CampaignLineItem,
  Invoice,
} from '@modules/postgres/entities';
import request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../../src/infrastructure/app.module';

describe('Campaign endpoints (e2e)', () => {
  let app: INestApplication<App>;
  let campaignRepo: Repository<Campaign>;
  let campaignLineItemRepo: Repository<CampaignLineItem>;
  let invoiceRepo: Repository<Invoice>;

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
  }, 30_000);

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await invoiceRepo.clear();
    await campaignLineItemRepo.clear();
    await campaignRepo.clear();
  });

  async function seedCampaign(overrides: Partial<Campaign> = {}) {
    const campaign = campaignRepo.create({
      name: 'Summer Brand Awareness',
      advertiser: 'Nike',
      startDate: 1780300800000,
      endDate: 1788220800000,
      archivedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...overrides,
    });
    return campaignRepo.save(campaign);
  }

  describe('GET /api/v1/campaigns', () => {
    it('should return paginated campaign summaries', async () => {
      await seedCampaign({ name: 'Campaign A' });
      await seedCampaign({ name: 'Campaign B' });

      const res = await request(app.getHttpServer())
        .get('/api/v1/campaigns')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(2);
      expect(res.body.data.meta).toBeDefined();
    });

    it('should exclude archived campaigns by default', async () => {
      await seedCampaign({ name: 'Active' });
      await seedCampaign({ name: 'Archived', archivedAt: Date.now() });

      const res = await request(app.getHttpServer())
        .get('/api/v1/campaigns')
        .expect(200);

      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].name).toBe('Active');
    });

    it('should include archived when query param is set', async () => {
      await seedCampaign({ name: 'Active' });
      await seedCampaign({ name: 'Archived', archivedAt: Date.now() });

      const res = await request(app.getHttpServer())
        .get('/api/v1/campaigns?includeArchived=true')
        .expect(200);

      expect(res.body.data.items).toHaveLength(2);
    });

    it('should filter by advertiser', async () => {
      await seedCampaign({ advertiser: 'Nike' });
      await seedCampaign({ advertiser: 'Adidas' });

      const res = await request(app.getHttpServer())
        .get('/api/v1/campaigns?advertiser=Nike')
        .expect(200);

      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].advertiser).toBe('Nike');
    });
  });

  describe('GET /api/v1/campaigns/:id', () => {
    it('should return a single campaign with details', async () => {
      const campaign = await seedCampaign();

      const res = await request(app.getHttpServer())
        .get(`/api/v1/campaigns/${campaign.id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(campaign.id);
      expect(res.body.data.name).toBe('Summer Brand Awareness');
    });

    it('should return 404 for non-existent campaign', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/campaigns/nonexistent_id_00000000')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/campaigns/:id/archive', () => {
    it('should archive a campaign', async () => {
      const campaign = await seedCampaign();

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/campaigns/${campaign.id}/archive`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(campaign.id);
      expect(res.body.data.archivedAt).not.toBeNull();
    });

    it('should return 404 for non-existent campaign', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/campaigns/nonexistent_id_00000000/archive')
        .expect(404);
    });

    it('should return 409 if already archived', async () => {
      const campaign = await seedCampaign({ archivedAt: Date.now() });

      await request(app.getHttpServer())
        .patch(`/api/v1/campaigns/${campaign.id}/archive`)
        .expect(409);
    });
  });

  describe('PATCH /api/v1/campaigns/:id/unarchive', () => {
    it('should unarchive a campaign', async () => {
      const campaign = await seedCampaign({ archivedAt: Date.now() });

      const res = await request(app.getHttpServer())
        .patch(`/api/v1/campaigns/${campaign.id}/unarchive`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.archivedAt).toBeNull();
    });

    it('should return 409 if not archived', async () => {
      const campaign = await seedCampaign();

      await request(app.getHttpServer())
        .patch(`/api/v1/campaigns/${campaign.id}/unarchive`)
        .expect(409);
    });
  });
});
