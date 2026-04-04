import { GetCampaignQuery } from '@plutus/application/use-case/queries/get-campaign/get-campaign.input';
import { GetCampaignUseCase } from '@plutus/application/use-case/queries/get-campaign/get-campaign.use-case';
import { makeCampaign, makeMockCampaignRepository } from '../../factories';

describe('GetCampaignUseCase', () => {
  let useCase: GetCampaignUseCase;
  let repo: ReturnType<typeof makeMockCampaignRepository>;

  beforeEach(() => {
    repo = makeMockCampaignRepository();
    useCase = new GetCampaignUseCase(repo as any);
  });

  it('should return a campaign DTO when found', async () => {
    const campaign = makeCampaign();
    repo.findById.mockResolvedValue(campaign);

    const result = await useCase.execute(
      new GetCampaignQuery({ id: 'dncnkn18pqamrqx43689pckc' }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).not.toBeNull();
      expect(result.value!.id).toBe('dncnkn18pqamrqx43689pckc');
      expect(result.value!.name).toBe('Summer Brand Awareness');
    }
  });

  it('should return null when campaign not found', async () => {
    repo.findById.mockResolvedValue(null);

    const result = await useCase.execute(
      new GetCampaignQuery({ id: 'nonexistent' }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBeNull();
    }
  });
});
