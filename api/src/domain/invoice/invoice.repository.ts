import { Invoice } from './invoice';

export interface InvoiceQueryOptions {
  status?: string;
  campaignId?: string;
  includeArchived?: boolean;
  page?: number;
  limit?: number;
}

export interface InvoiceListResult {
  items: Invoice[];
  totalItems: number;
}

export interface AbstractInvoiceDomainRepository {
  findById(id: string): Promise<Invoice | null>;
  findAll(options?: InvoiceQueryOptions): Promise<InvoiceListResult>;
  save(invoice: Invoice): Promise<void>;
}
