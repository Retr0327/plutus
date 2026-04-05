import { Invoice } from './invoice';

export interface InvoiceQueryOptions {
  status?: string;
  campaignId?: number;
  includeArchived?: boolean;
  page?: number;
  limit?: number;
}

export interface InvoiceListResult {
  items: Invoice[];
  totalItems: number;
}

export interface AbstractInvoiceDomainRepository {
  findById(id: number): Promise<Invoice | null>;
  findAll(options?: InvoiceQueryOptions): Promise<InvoiceListResult>;
  save(invoice: Invoice): Promise<void>;
}
