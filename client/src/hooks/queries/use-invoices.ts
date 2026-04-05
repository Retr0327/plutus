import { useQuery } from '@tanstack/react-query';
import { API } from '@plutus/libs/config/api';
import { request } from '@plutus/libs/request';
import type { PaginatedResponse } from '@plutus/types/api';
import type { InvoiceDetail, InvoiceListItem } from '@plutus/types/invoice';
import { queryKeys } from '@plutus/utils/query-keys';

export interface InvoiceListParams {
  page?: number;
  limit?: number;
  status?: string;
  campaignId?: string | number;
  includeArchived?: boolean;
}

function buildSearchParams(params: InvoiceListParams): string {
  const sp = new URLSearchParams();
  if (params.page) sp.set('page', String(params.page));
  if (params.limit) sp.set('limit', String(params.limit));
  if (params.status) sp.set('status', params.status);
  if (params.campaignId) sp.set('campaignId', String(params.campaignId));
  if (params.includeArchived) sp.set('includeArchived', 'true');
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export function useInvoiceList(params: InvoiceListParams = {}) {
  return useQuery({
    queryKey: queryKeys.invoices.list(params as Record<string, unknown>),
    queryFn: () =>
      request<PaginatedResponse<InvoiceListItem>>(
        `${API.invoice.root}${buildSearchParams(params)}`
      ),
  });
}

export function useInvoiceDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id),
    queryFn: () => request<InvoiceDetail>(API.invoice.detail(id)),
    enabled: !!id,
  });
}
