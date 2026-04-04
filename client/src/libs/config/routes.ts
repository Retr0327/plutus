export const Route = {
  Home: '/',
  Campaigns: '/campaigns',
  CampaignDetail: (id: string) => `/campaigns/${id}`,
  Invoices: '/invoices',
  InvoiceDetail: (id: string) => `/invoices/${id}`,
} as const;
