import { Query } from '@nestjs/cqrs';
import { GetCampaignSummaryOutput } from './get-campaign-summary.output';

type Input = {
  page?: number;
  limit?: number;
  search?: string;
  advertiser?: string;
  includeArchived?: boolean;
};

export class GetCampaignSummaryQuery extends Query<GetCampaignSummaryOutput> {
  readonly page: number;
  readonly limit: number;
  readonly search?: string;
  readonly advertiser?: string;
  readonly includeArchived: boolean;

  constructor(input?: Input) {
    super();
    this.page = input?.page ?? 1;
    this.limit = input?.limit ?? 10;
    this.search = input?.search;
    this.advertiser = input?.advertiser;
    this.includeArchived = input?.includeArchived ?? false;
  }
}
