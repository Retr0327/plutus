import { HttpExceptionFilter } from '@common/errors';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { AuditLog } from '@modules/postgres/entities';
import { AuditLogAction, AuditLogEntity } from '@modules/postgres/enum';
import request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../../src/infrastructure/app.module';

describe('AuditLog endpoints (e2e)', () => {
  let app: INestApplication<App>;
  let auditLogRepo: Repository<AuditLog>;

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

    auditLogRepo = app.get(getRepositoryToken(AuditLog));
  }, 30_000);

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await auditLogRepo.clear();
  });

  async function seedAuditLog(overrides: Partial<AuditLog> = {}) {
    return auditLogRepo.save(
      auditLogRepo.create({
        entityType: AuditLogEntity.Adjustment,
        entityId: 'adj_001',
        action: AuditLogAction.Create,
        changedBy: 'jane@test.com',
        oldValue: null,
        newValue: { amount: -100 },
        createdAt: Date.now(),
        ...overrides,
      }),
    );
  }

  describe('GET /api/v1/audit-logs', () => {
    it('should return paginated audit logs', async () => {
      await seedAuditLog({ entityId: 'adj_001' });
      await seedAuditLog({ entityId: 'adj_002' });

      const res = await request(app.getHttpServer())
        .get('/api/v1/audit-logs')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(2);
      expect(res.body.data.meta).toBeDefined();
    });

    it('should filter by entityType', async () => {
      await seedAuditLog({ entityType: AuditLogEntity.Adjustment });
      await seedAuditLog({ entityType: 'invoice' });

      const res = await request(app.getHttpServer())
        .get(`/api/v1/audit-logs?entityType=${AuditLogEntity.Adjustment}`)
        .expect(200);

      expect(res.body.data.items).toHaveLength(1);
    });

    it('should filter by entityId', async () => {
      await seedAuditLog({ entityId: 'adj_001' });
      await seedAuditLog({ entityId: 'adj_002' });

      const res = await request(app.getHttpServer())
        .get('/api/v1/audit-logs?entityId=adj_001')
        .expect(200);

      expect(res.body.data.items).toHaveLength(1);
    });

    it('should respect pagination params', async () => {
      await seedAuditLog({ entityId: 'a1' });
      await seedAuditLog({ entityId: 'a2' });
      await seedAuditLog({ entityId: 'a3' });

      const res = await request(app.getHttpServer())
        .get('/api/v1/audit-logs?page=1&limit=2')
        .expect(200);

      expect(res.body.data.items).toHaveLength(2);
      expect(res.body.data.meta.totalItems).toBe(3);
    });
  });
});
