export interface InvoiceListItem {
  id: number;
  invoiceNumber: string;
  status: 'draft' | 'finalized';
  campaignId: number;
  campaignName: string;
  totalActualAmount: number;
  totalAdjustments: number;
  totalBillableAmount: number;
  lineItemCount: number;
  archivedAt: number | null;
}

export interface InvoiceDetail {
  id: number;
  invoiceNumber: string;
  status: 'draft' | 'finalized';
  archivedAt: number | null;
  campaign: {
    id: number;
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
  id: number;
  name: string;
  lineItemId: number;
  actualAmount: number;
  adjustments: Adjustment[];
  adjustmentsTotal: number;
  billableAmount: number;
}

export interface Adjustment {
  id: number;
  amount: number;
  reason: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}
