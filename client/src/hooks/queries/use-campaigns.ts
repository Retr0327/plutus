import { useQuery } from '@tanstack/react-query';
import { API } from '@plutus/libs/config/api';
import { request } from '@plutus/libs/request';
import type { PaginatedResponse } from '@plutus/types/api';
import type { CampaignDetail, CampaignListItem } from '@plutus/types/campaign';
import { queryKeys } from '@plutus/utils/query-keys';

export interface CampaignListParams {
  page?: number;
  limit?: number;
  search?: string;
  advertiser?: string;
  includeArchived?: boolean;
}

function buildSearchParams(params: CampaignListParams): string {
  const sp = new URLSearchParams();
  if (params.page) sp.set('page', String(params.page));
  if (params.limit) sp.set('limit', String(params.limit));
  if (params.search) sp.set('search', params.search);
  if (params.advertiser) sp.set('advertiser', params.advertiser);
  if (params.includeArchived) sp.set('includeArchived', 'true');
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export function useCampaignList(params: CampaignListParams = {}) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(params as Record<string, unknown>),
    queryFn: () =>
      request<PaginatedResponse<CampaignListItem>>(
        `${API.campaign.root}${buildSearchParams(params)}`
      ),
  });
}

export function useCampaignDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => request<CampaignDetail>(API.campaign.detail(id)),
    enabled: !!id,
  });
}
