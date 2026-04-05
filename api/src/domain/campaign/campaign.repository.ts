import { Campaign } from './campaign';

export interface CampaignQueryOptions {
  includeArchived?: boolean;
  search?: string;
  advertiser?: string;
  page?: number;
  limit?: number;
}

export interface CampaignListResult {
  items: Campaign[];
  totalItems: number;
}

export interface AbstractCampaignDomainRepository {
  findById(id: number): Promise<Campaign | null>;
  findAll(options?: CampaignQueryOptions): Promise<CampaignListResult>;
  save(campaign: Campaign): Promise<void>;
}
