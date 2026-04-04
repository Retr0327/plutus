import { HttpException } from '@nestjs/common';
import { Result } from '@common/result';

export type CampaignSummaryDto = {
  readonly id: string;
  readonly name: string;
  readonly advertiser: string;
  readonly startDate: number;
  readonly endDate: number;
  readonly totalBookedAmount: number;
  readonly totalActualAmount: number;
  readonly invoiceCount: number;
  readonly archivedAt: number | null;
};

export type PaginationMeta = {
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly totalPages: number;
};

export type GetCampaignSummaryOutput = Result<
  {
    items: CampaignSummaryDto[];
    meta: PaginationMeta;
  },
  HttpException
>;
