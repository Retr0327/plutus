import { AuditLog } from '@modules/postgres/entities';
import { AuditLogAction, AuditLogEntity } from '@modules/postgres/enum';
import { PostgresModule } from '@modules/postgres/postgres.module';
import { AuditLog as AuditLogAggregate } from '@plutus/domain/audit-log/audit-log';
import { AuditLogDomainRepository } from '@plutus/infrastructure/repository/audit-log.repository';
import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuditLogDomainRepository (integration)', () => {
  let module: TestingModule;
  let repo: AuditLogDomainRepository;
  let typeormRepo: Repository<AuditLog>;
  let dataSource: DataSource;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PostgresModule],
      providers: [AuditLogDomainRepository],
    }).compile();

    repo = module.get(AuditLogDomainRepository);
    typeormRepo = module.get(getRepositoryToken(AuditLog));
    dataSource = module.get(DataSource);
  }, 30_000);

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await typeormRepo.clear();
  });

  async function seedAuditLog(overrides: Partial<AuditLog> = {}) {
    const log = typeormRepo.create({
      entityType: AuditLogEntity.Adjustment,
      entityId: 'adj_001',
      action: AuditLogAction.Create,
      changedBy: 'jane@test.com',
      oldValue: null,
      newValue: { amount: -100, reason: 'test' },
      createdAt: Date.now(),
      ...overrides,
    });
    return typeormRepo.save(log);
  }

  describe('findByEntity', () => {
    it('should return audit logs for a specific entity', async () => {
      await seedAuditLog({ entityId: 'adj_001' });
      await seedAuditLog({ entityId: 'adj_002' });

      const result = await repo.findByEntity(
        AuditLogEntity.Adjustment,
        'adj_001',
      );
      expect(result).toHaveLength(1);
      expect(result[0].entityId.value).toBe('adj_001');
    });
  });

  describe('findAll', () => {
    it('should return paginated audit logs', async () => {
      await seedAuditLog({ entityId: 'adj_001' });
      await seedAuditLog({ entityId: 'adj_002' });
      await seedAuditLog({ entityId: 'adj_003' });

      const result = await repo.findAll({ page: 1, limit: 2 });
      expect(result.items).toHaveLength(2);
      expect(result.totalItems).toBe(3);
    });

    it('should filter by entityType', async () => {
      await seedAuditLog({ entityType: AuditLogEntity.Adjustment });
      await seedAuditLog({ entityType: 'invoice' });

      const result = await repo.findAll({
        entityType: AuditLogEntity.Adjustment,
      });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('save', () => {
    it('should persist audit log with JSON values', async () => {
      const logResult = AuditLogAggregate.create({
        entityType: AuditLogEntity.Adjustment,
        entityId: 'adj_999',
        action: AuditLogAction.Update,
        changedBy: 'test@test.com',
        oldValue: { amount: -100 },
        newValue: { amount: -200 },
      });

      expect(logResult.isOk()).toBe(true);
      if (logResult.isOk()) {
        await repo.save(logResult.value);

        const found = await repo.findByEntity(
          AuditLogEntity.Adjustment,
          'adj_999',
        );
        expect(found).toHaveLength(1);
        expect(found[0].action.value).toBe('update');
        expect(found[0].fieldChange.oldValue).toEqual({ amount: -100 });
        expect(found[0].fieldChange.newValue).toEqual({ amount: -200 });
      }
    });
  });

  describe('saveWithTx', () => {
    it('should persist within a transaction', async () => {
      const logResult = AuditLogAggregate.create({
        entityType: AuditLogEntity.Adjustment,
        entityId: 'adj_tx',
        action: AuditLogAction.Create,
        changedBy: 'tx@test.com',
        oldValue: undefined,
        newValue: { amount: -50 },
      });

      expect(logResult.isOk()).toBe(true);
      if (logResult.isOk()) {
        await dataSource.transaction(async (tx) => {
          await repo.saveWithTx(logResult.value, tx);
        });

        const found = await repo.findByEntity(
          AuditLogEntity.Adjustment,
          'adj_tx',
        );
        expect(found).toHaveLength(1);
      }
    });
  });
});
