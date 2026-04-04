export interface CampaignListItem {
  id: string;
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
  id: string;
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
  id: string;
  name: string;
  bookedAmount: number;
  actualAmount: number;
}

export interface CampaignInvoiceSummary {
  id: string;
  invoiceNumber: string;
  status: 'draft' | 'finalized';
  totalBillableAmount: number;
}
