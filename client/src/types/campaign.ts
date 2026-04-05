export interface CampaignListItem {
  id: number;
  name: string;
  advertiser: string;
  startDate: number;
  endDate: number;
  totalBookedAmount: number;
  totalActualAmount: number;
  invoiceCount: number;
  archivedAt: number | null;
}

export interface CampaignDetail {
  id: number;
  name: string;
  advertiser: string;
  startDate: number;
  endDate: number;
  archivedAt: number | null;
  lineItems: CampaignLineItem[];
  invoices: CampaignInvoiceSummary[];
  totalBookedAmount: number;
  totalActualAmount: number;
}

export interface CampaignLineItem {
  id: number;
  name: string;
  bookedAmount: number;
  actualAmount: number;
}

export interface CampaignInvoiceSummary {
  id: number;
  invoiceNumber: string;
  status: 'draft' | 'finalized';
  totalBillableAmount: number;
}
