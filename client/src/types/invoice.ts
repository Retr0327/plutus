export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  status: 'draft' | 'finalized';
  campaignId: string;
  campaignName: string;
  totalActualAmount: number;
  totalAdjustments: number;
  totalBillableAmount: number;
  lineItemCount: number;
  archivedAt: number | null;
}

export interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  status: 'draft' | 'finalized';
  archivedAt: number | null;
  campaign: {
    id: string;
    name: string;
  };
  lineItems: InvoiceLineItem[];
  totalActualAmount: number;
  totalAdjustments: number;
  totalBillableAmount: number;
  createdAt: number;
  updatedAt: number;
}

export interface InvoiceLineItem {
  id: string;
  name: string;
  lineItemId: string;
  actualAmount: number;
  adjustments: Adjustment[];
  adjustmentsTotal: number;
  billableAmount: number;
}

export interface Adjustment {
  id: string;
  amount: number;
  reason: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}
