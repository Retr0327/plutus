import { HttpException } from '@nestjs/common';
import { CampaignMapper } from '@plutus/infrastructure/mappers/campaign.mapper';
import { Result } from '@common/result';

export type GetCampaignOutput = Result<
  ReturnType<(typeof CampaignMapper)['toDto']> | null,
  HttpException
>;
