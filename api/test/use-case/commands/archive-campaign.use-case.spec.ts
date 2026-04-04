import { ArchiveCampaignCommand } from '@plutus/application/use-case/commands/archive-campaign/archive-campaign.input';
import { ArchiveCampaignUseCase } from '@plutus/application/use-case/commands/archive-campaign/archive-campaign.use-case';
import { makeCampaign, makeMockCampaignRepository } from '../../factories';

describe('ArchiveCampaignUseCase', () => {
  let useCase: ArchiveCampaignUseCase;
  let repo: ReturnType<typeof makeMockCampaignRepository>;

  beforeEach(() => {
    repo = makeMockCampaignRepository();
    useCase = new ArchiveCampaignUseCase(repo as any);
  });

  it('should archive a non-archived campaign', async () => {
    const campaign = makeCampaign();
    repo.findById.mockResolvedValue(campaign);
    repo.save.mockResolvedValue(undefined);

    const result = await useCase.execute(
      new ArchiveCampaignCommand({ id: 'dncnkn18pqamrqx43689pckc' }),
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
      new ArchiveCampaignCommand({ id: 'nonexistent' }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });

  it('should return 409 if already archived', async () => {
    const campaign = makeCampaign({ archivedAt: 1711720000000 });
    repo.findById.mockResolvedValue(campaign);

    const result = await useCase.execute(
      new ArchiveCampaignCommand({ id: 'dncnkn18pqamrqx43689pckc' }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(409);
    }
  });
});
