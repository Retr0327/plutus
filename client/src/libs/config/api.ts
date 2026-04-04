import urlJoin from 'url-join';

function getApiPrefix(): string {
  return process.env.NEXT_PUBLIC_API_PREFIX ?? '/api';
}

function getServerUrl(): string {
  return process.env.SERVER_URL ?? 'http://localhost:3000';
}

export const serverSideUrl = (...args: string[]): string =>
  urlJoin(getServerUrl(), ...args);

export const clientSideUrl = (...args: string[]): string =>
  urlJoin(getApiPrefix(), ...args);

export const invoiceAPI = (...args: string[]) => clientSideUrl('v1', 'invoices', ...args);

export const campaignAPI = (...args: string[]) => clientSideUrl('v1', 'campaigns', ...args);

export const currencyAPI = (...args: string[]) => clientSideUrl('v1', 'currency', ...args);

export const auditLogAPI = (...args: string[]) => clientSideUrl('v1', 'audit-logs', ...args);

export const API = {
  campaign: {
    get root() { return campaignAPI(); },
    detail: (id: string) => campaignAPI(id),
    archive: (id: string) => campaignAPI(id, 'archive'),
    unarchive: (id: string) => campaignAPI(id, 'unarchive'),
  },
  invoice: {
    get root() { return invoiceAPI(); },
    detail: (id: string) => invoiceAPI(id),
    archive: (id: string) => invoiceAPI(id, 'archive'),
    unarchive: (id: string) => invoiceAPI(id, 'unarchive'),
    adjustments: {
      create: (invoiceId: string, lineItemId: string) =>
        invoiceAPI(invoiceId, 'line-items', lineItemId, 'adjustments'),
      detail: (invoiceId: string, lineItemId: string, adjustmentId: string) =>
        invoiceAPI(invoiceId, 'line-items', lineItemId, 'adjustments', adjustmentId),
      history: (invoiceId: string, lineItemId: string, adjustmentId: string) =>
        invoiceAPI(invoiceId, 'line-items', lineItemId, 'adjustments', adjustmentId, 'history'),
    },
  },
  currency: {
    get rates() { return currencyAPI('rates'); },
    get supported() { return currencyAPI('supported'); },
  },
  auditLog: {
    get root() { return auditLogAPI(); },
  },
} as const;
