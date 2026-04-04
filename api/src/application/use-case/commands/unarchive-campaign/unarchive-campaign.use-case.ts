import {
  ConflictException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CampaignDomain,
  CampaignDomainRepository,
} from '@plutus/infrastructure/repository/campaign.repository';
import { Result } from '@common/result';
import { UnarchiveCampaignCommand } from './unarchive-campaign.input';
import { UnarchiveCampaignOutput } from './unarchive-campaign.output';

@CommandHandler(UnarchiveCampaignCommand)
export class UnarchiveCampaignUseCase implements ICommandHandler<
  UnarchiveCampaignCommand,
  UnarchiveCampaignOutput
> {
  constructor(
    @Inject(CampaignDomain.Repository)
    private readonly campaignRepository: CampaignDomainRepository,
  ) {}

  async execute(command: UnarchiveCampaignCommand) {
    try {
      const campaign = await this.campaignRepository.findById(command.id);
      if (!campaign) {
        return Result.Err(new NotFoundException('Campaign not found'));
      }

      const unarchiveResult = campaign.unarchive();
      if (unarchiveResult.isErr()) {
        return Result.Err(new ConflictException(unarchiveResult.error.message));
      }

      await this.campaignRepository.save(campaign);
      return Result.Ok({ id: campaign.id.value });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
