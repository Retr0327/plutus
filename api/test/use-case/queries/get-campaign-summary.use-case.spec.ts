import { GetCampaignSummaryQuery } from '@plutus/application/use-case/queries/get-campaign-summary/get-campaign-summary.input';
import { GetCampaignSummaryUseCase } from '@plutus/application/use-case/queries/get-campaign-summary/get-campaign-summary.use-case';

function makeMockCampaignTypeOrmRepo() {
  return {
    findAndCount: jest.fn(),
  };
}

function makeCampaignEntity(overrides: Record<string, any> = {}) {
  return {
    id: 'dncnkn18pqamrqx43689pckc',
    name: 'Summer Brand Awareness',
    advertiser: 'Nike',
    startDate: 1780300800000,
    endDate: 1788220800000,
    archivedAt: null,
    lineItems: [
      { bookedAmount: 10000, actualAmount: 9500 },
      { bookedAmount: 5000, actualAmount: 4800 },
    ],
    invoices: [{ id: 'inv1' }, { id: 'inv2' }],
    ...overrides,
  };
}

describe('GetCampaignSummaryUseCase', () => {
  let useCase: GetCampaignSummaryUseCase;
  let repo: ReturnType<typeof makeMockCampaignTypeOrmRepo>;

  beforeEach(() => {
    repo = makeMockCampaignTypeOrmRepo();
    useCase = new GetCampaignSummaryUseCase(repo as any);
  });

  it('should return campaign summaries with pagination meta', async () => {
    repo.findAndCount.mockResolvedValue([[makeCampaignEntity()], 1]);

    const result = await useCase.execute(
      new GetCampaignSummaryQuery({ page: 1, limit: 10 }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      const { items, meta } = result.value;
      expect(items).toHaveLength(1);
      expect(items[0].name).toBe('Summer Brand Awareness');
      expect(items[0].totalBookedAmount).toBe(15000);
      expect(items[0].totalActualAmount).toBe(14300);
      expect(items[0].invoiceCount).toBe(2);
      expect(meta.totalItems).toBe(1);
      expect(meta.totalPages).toBe(1);
    }
  });

  it('should return empty list when no campaigns', async () => {
    repo.findAndCount.mockResolvedValue([[], 0]);

    const result = await useCase.execute(new GetCampaignSummaryQuery());

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.items).toHaveLength(0);
      expect(result.value.meta.totalItems).toBe(0);
    }
  });

  it('should calculate totalPages correctly', async () => {
    const campaigns = Array.from({ length: 2 }, (_, i) =>
      makeCampaignEntity({ id: `campaign_${i}`, name: `Campaign ${i}` }),
    );
    repo.findAndCount.mockResolvedValue([campaigns, 5]);

    const result = await useCase.execute(
      new GetCampaignSummaryQuery({ page: 1, limit: 2 }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.meta.totalPages).toBe(3);
    }
  });
});
