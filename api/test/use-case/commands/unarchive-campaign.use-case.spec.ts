import { UnarchiveCampaignCommand } from '@plutus/application/use-case/commands/unarchive-campaign/unarchive-campaign.input';
import { UnarchiveCampaignUseCase } from '@plutus/application/use-case/commands/unarchive-campaign/unarchive-campaign.use-case';
import { makeCampaign, makeMockCampaignRepository } from '../../factories';

describe('UnarchiveCampaignUseCase', () => {
  let useCase: UnarchiveCampaignUseCase;
  let repo: ReturnType<typeof makeMockCampaignRepository>;

  beforeEach(() => {
    repo = makeMockCampaignRepository();
    useCase = new UnarchiveCampaignUseCase(repo as any);
  });

  it('should unarchive an archived campaign', async () => {
    const campaign = makeCampaign({ archivedAt: 1711720000000 });
    repo.findById.mockResolvedValue(campaign);
    repo.save.mockResolvedValue(undefined);

    const result = await useCase.execute(
      new UnarchiveCampaignCommand({ id: 'dncnkn18pqamrqx43689pckc' }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBe('dncnkn18pqamrqx43689pckc');
    }
    expect(repo.save).toHaveBeenCalledWith(campaign);
  });

  it('should return 404 if campaign not found', async () => {
    repo.findById.mockResolvedValue(null);

    const result = await useCase.execute(
      new UnarchiveCampaignCommand({ id: 'nonexistent' }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });

  it('should return 409 if not archived', async () => {
    const campaign = makeCampaign();
    repo.findById.mockResolvedValue(campaign);

    const result = await useCase.execute(
      new UnarchiveCampaignCommand({ id: 'dncnkn18pqamrqx43689pckc' }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(409);
    }
  });
});
