import { GetInvoiceListQuery } from '@plutus/application/use-case/queries/get-invoice-list/get-invoice-list.input';
import { GetInvoiceListUseCase } from '@plutus/application/use-case/queries/get-invoice-list/get-invoice-list.use-case';

function makeMockInvoiceTypeOrmRepo() {
  return {
    findAndCount: jest.fn(),
  };
}

function makeInvoiceEntity(overrides: Record<string, any> = {}) {
  return {
    id: 1,
    invoiceNumber: 'INV-2026-001',
    status: 'draft',
    campaignId: 1,
    campaign: { name: 'Summer Campaign' },
    archivedAt: null,
    lineItems: [
      {
        actualAmount: 10000,
        adjustments: [{ amount: -500 }, { amount: -200 }],
      },
      {
        actualAmount: 5000,
        adjustments: [{ amount: -100 }],
      },
    ],
    ...overrides,
  };
}

describe('GetInvoiceListUseCase', () => {
  let useCase: GetInvoiceListUseCase;
  let repo: ReturnType<typeof makeMockInvoiceTypeOrmRepo>;

  beforeEach(() => {
    repo = makeMockInvoiceTypeOrmRepo();
    useCase = new GetInvoiceListUseCase(repo as any);
  });

  it('should return invoice list with calculated amounts', async () => {
    repo.findAndCount.mockResolvedValue([[makeInvoiceEntity()], 1]);

    const result = await useCase.execute(
      new GetInvoiceListQuery({ page: 1, limit: 10 }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const { items, meta } = result.value;
      expect(items).toHaveLength(1);
      expect(items[0].totalActualAmount).toBe(15000);
      expect(items[0].totalAdjustments).toBe(-800);
      expect(items[0].totalBillableAmount).toBe(14200);
      expect(items[0].lineItemCount).toBe(2);
      expect(items[0].campaignName).toBe('Summer Campaign');
      expect(meta.totalItems).toBe(1);
    }
  });

  it('should return empty list when no invoices', async () => {
    repo.findAndCount.mockResolvedValue([[], 0]);

    const result = await useCase.execute(new GetInvoiceListQuery());

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.items).toHaveLength(0);
      expect(result.value.meta.totalItems).toBe(0);
    }
  });

  it('should use default pagination values', async () => {
    repo.findAndCount.mockResolvedValue([[], 0]);

    const result = await useCase.execute(new GetInvoiceListQuery());

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.meta.page).toBe(1);
      expect(result.value.meta.limit).toBe(10);
    }
  });
});
