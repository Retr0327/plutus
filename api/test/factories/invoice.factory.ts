import type { InvoiceProps } from '@plutus/domain/invoice/invoice';
import { Invoice } from '@plutus/domain/invoice/invoice';
import type { InvoiceLineItemProps } from '@plutus/domain/invoice/invoice-line-item/invoice-line-item';
import { InvoiceLineItem } from '@plutus/domain/invoice/invoice-line-item/invoice-line-item';

const INVOICE_ID = 1;
const CAMPAIGN_ID = 1;

const INVOICE_DEFAULTS: InvoiceProps = {
  id: INVOICE_ID,
  campaignId: CAMPAIGN_ID,
  invoiceNumber: 'INV-2026-001',
  status: 'draft',
  archivedAt: null,
  createdAt: 1711720000000,
  updatedAt: 1711720000000,
  lineItems: [],
};

const LINE_ITEM_DEFAULTS: InvoiceLineItemProps = {
  id: 10,
  invoiceId: INVOICE_ID,
  campaignLineItemId: 100,
  actualAmount: 48750,
  adjustments: [],
};

export function makeInvoice(overrides: Partial<InvoiceProps> = {}) {
  return Invoice.from({ ...INVOICE_DEFAULTS, ...overrides });
}

export function makeLineItem(overrides: Partial<InvoiceLineItemProps> = {}) {
  return InvoiceLineItem.from({ ...LINE_ITEM_DEFAULTS, ...overrides });
}

export function makeInvoiceWithLineItem(
  invoiceOverrides: Partial<InvoiceProps> = {},
  lineItemOverrides: Partial<InvoiceLineItemProps> = {},
) {
  const lineItem = makeLineItem(lineItemOverrides);
  return makeInvoice({ lineItems: [lineItem], ...invoiceOverrides });
}
