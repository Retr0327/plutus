import urlJoin from 'url-join';

type PathSegment = string | number;

function getApiPrefix(): string {
  return process.env.NEXT_PUBLIC_API_PREFIX ?? '/api';
}

function getServerUrl(): string {
  return process.env.SERVER_URL ?? 'http://localhost:3000';
}

export const serverSideUrl = (...args: string[]): string => urlJoin(getServerUrl(), ...args);

export const clientSideUrl = (...args: string[]): string => urlJoin(getApiPrefix(), ...args);

export const invoiceAPI = (...args: PathSegment[]) =>
  clientSideUrl('v1', 'invoices', ...args.map(String));

export const campaignAPI = (...args: PathSegment[]) =>
  clientSideUrl('v1', 'campaigns', ...args.map(String));

export const currencyAPI = (...args: string[]) => clientSideUrl('v1', 'currency', ...args);

export const auditLogAPI = (...args: string[]) => clientSideUrl('v1', 'audit-logs', ...args);

export const API = {
  campaign: {
    get root() {
      return campaignAPI();
    },
    detail: (id: PathSegment) => campaignAPI(id),
    archive: (id: PathSegment) => campaignAPI(id, 'archive'),
    unarchive: (id: PathSegment) => campaignAPI(id, 'unarchive'),
  },
  invoice: {
    get root() {
      return invoiceAPI();
    },
    detail: (id: PathSegment) => invoiceAPI(id),
    archive: (id: PathSegment) => invoiceAPI(id, 'archive'),
    unarchive: (id: PathSegment) => invoiceAPI(id, 'unarchive'),
    adjustments: {
      create: (invoiceId: PathSegment, lineItemId: PathSegment) =>
        invoiceAPI(invoiceId, 'line-items', lineItemId, 'adjustments'),
      detail: (invoiceId: PathSegment, lineItemId: PathSegment, adjustmentId: PathSegment) =>
        invoiceAPI(invoiceId, 'line-items', lineItemId, 'adjustments', adjustmentId),
      history: (invoiceId: PathSegment, lineItemId: PathSegment, adjustmentId: PathSegment) =>
        invoiceAPI(invoiceId, 'line-items', lineItemId, 'adjustments', adjustmentId, 'history'),
    },
  },
  currency: {
    get rates() {
      return currencyAPI('rates');
    },
    get supported() {
      return currencyAPI('supported');
    },
  },
  auditLog: {
    get root() {
      return auditLogAPI();
    },
  },
} as const;
