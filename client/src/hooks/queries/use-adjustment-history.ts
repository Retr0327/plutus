import { useQuery } from '@tanstack/react-query';
import { API } from '@plutus/libs/config/api';
import { request } from '@plutus/libs/request';
import type { AuditLogEntry } from '@plutus/types/audit-log';
import { queryKeys } from '@plutus/utils/query-keys';

interface AuditLogListResponse {
  readonly items: AuditLogEntry[];
  readonly meta: { readonly total: number; readonly page: number; readonly limit: number };
}

export function useAdjustmentHistory(
  invoiceId: string | number,
  lineItemId: string | number,
  adjustmentId: string | number
) {
  return useQuery({
    queryKey: queryKeys.adjustments.history(invoiceId, lineItemId, adjustmentId),
    queryFn: async () => {
      const response = await request<AuditLogListResponse>(
        API.invoice.adjustments.history(invoiceId, lineItemId, adjustmentId)
      );
      return response.items;
    },
    enabled: !!invoiceId && !!lineItemId && !!adjustmentId,
  });
}
