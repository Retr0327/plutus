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
import { ArchiveCampaignCommand } from './archive-campaign.input';
import { ArchiveCampaignOutput } from './archive-campaign.output';

@CommandHandler(ArchiveCampaignCommand)
export class ArchiveCampaignUseCase implements ICommandHandler<
  ArchiveCampaignCommand,
  ArchiveCampaignOutput
> {
  constructor(
    @Inject(CampaignDomain.Repository)
    private readonly campaignRepository: CampaignDomainRepository,
  ) {}

  async execute(command: ArchiveCampaignCommand) {
    try {
      const campaign = await this.campaignRepository.findById(command.id);
      if (!campaign) {
        return Result.Err(new NotFoundException('Campaign not found'));
      }

      const archiveResult = campaign.archive();
      if (archiveResult.isErr()) {
        return Result.Err(new ConflictException(archiveResult.error.message));
      }

      await this.campaignRepository.save(campaign);

      return Result.Ok({ id: campaign.id.value });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
