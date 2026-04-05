export const queryKeys = {
  campaigns: {
    all: ['campaigns'] as const,
    list: (params: Record<string, unknown>) => ['campaigns', 'list', params] as const,
    detail: (id: string | number) => ['campaigns', 'detail', id] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    list: (params: Record<string, unknown>) => ['invoices', 'list', params] as const,
    detail: (id: string | number) => ['invoices', 'detail', id] as const,
  },
  adjustments: {
    history: (
      invoiceId: string | number,
      lineItemId: string | number,
      adjustmentId: string | number
    ) => ['adjustments', 'history', invoiceId, lineItemId, adjustmentId] as const,
  },
  currency: {
    rates: (base?: string) => ['currency', 'rates', base] as const,
    supported: ['currency', 'supported'] as const,
  },
  auditLogs: {
    list: (params: Record<string, unknown>) => ['audit-logs', 'list', params] as const,
  },
} as const;
