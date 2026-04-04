import { GetAuditLogListQuery } from '@plutus/application/use-case/queries/get-audit-log-list/get-audit-log-list.input';
import { GetAuditLogListUseCase } from '@plutus/application/use-case/queries/get-audit-log-list/get-audit-log-list.use-case';
import { makeAuditLog, makeMockAuditLogRepository } from '../../factories';

describe('GetAuditLogListUseCase', () => {
  let useCase: GetAuditLogListUseCase;
  let repo: ReturnType<typeof makeMockAuditLogRepository>;

  beforeEach(() => {
    repo = makeMockAuditLogRepository();
    useCase = new GetAuditLogListUseCase(repo as any);
  });

  it('should return paginated audit logs', async () => {
    repo.findAll.mockResolvedValue({
      items: [makeAuditLog()],
      totalItems: 1,
    });

    const result = await useCase.execute(
      new GetAuditLogListQuery({ page: 1, limit: 20 }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.items).toHaveLength(1);
      expect(result.value.meta.totalItems).toBe(1);
      expect(result.value.meta.page).toBe(1);
    }
  });

  it('should pass filter options to repository', async () => {
    repo.findAll.mockResolvedValue({ items: [], totalItems: 0 });

    await useCase.execute(
      new GetAuditLogListQuery({
        entityType: 'adjustment',
        entityId: 'adj_001',
        page: 2,
        limit: 5,
      }),
    );

    expect(repo.findAll).toHaveBeenCalledWith({
      entityType: 'adjustment',
      entityId: 'adj_001',
      page: 2,
      limit: 5,
    });
  });

  it('should use default pagination values', async () => {
    repo.findAll.mockResolvedValue({ items: [], totalItems: 0 });

    const result = await useCase.execute(new GetAuditLogListQuery());

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.meta.page).toBe(1);
      expect(result.value.meta.limit).toBe(20);
    }
  });
});
