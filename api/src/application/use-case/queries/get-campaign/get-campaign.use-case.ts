import { Inject, InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CampaignMapper } from '@plutus/infrastructure/mappers/campaign.mapper';
import {
  CampaignDomain,
  CampaignDomainRepository,
} from '@plutus/infrastructure/repository/campaign.repository';
import { Result } from '@common/result';
import { GetCampaignQuery } from './get-campaign.input';
import { GetCampaignOutput } from './get-campaign.output';

@QueryHandler(GetCampaignQuery)
export class GetCampaignUseCase implements IQueryHandler<
  GetCampaignQuery,
  GetCampaignOutput
> {
  constructor(
    @Inject(CampaignDomain.Repository)
    private readonly campaignRepository: CampaignDomainRepository,
  ) {}

  async execute(query: GetCampaignQuery) {
    try {
      const campaign = await this.campaignRepository.findById(query.id);
      if (campaign === null) {
        return Result.Ok(null);
      }

      const dto = CampaignMapper.toDto(campaign);
      return Result.Ok(dto);
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
