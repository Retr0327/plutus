export const Route = {
  Home: '/',
  Campaigns: '/campaigns',
  CampaignDetail: (id: string | number) => `/campaigns/${id}`,
  Invoices: '/invoices',
  InvoiceDetail: (id: string | number) => `/invoices/${id}`,
} as const;
