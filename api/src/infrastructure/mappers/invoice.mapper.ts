import { Invoice } from '@plutus/domain/invoice/invoice';
import { Invoice as InvoicePO } from '@modules/postgres/entities/invoice.entity';
import { InvoiceLineItemMapper } from './invoice-line-item.mapper';

export class InvoiceMapper {
  static toDomain(po: InvoicePO) {
    const lineItems = (po.lineItems ?? []).map((item) =>
      InvoiceLineItemMapper.toDomain(item),
    );
    return Invoice.from({
      id: po.id,
      campaignId: po.campaignId,
      invoiceNumber: po.invoiceNumber,
      status: po.status,
      archivedAt: po.archivedAt !== null ? Number(po.archivedAt) : null,
      createdAt: Number(po.createdAt),
      updatedAt: Number(po.updatedAt),
      lineItems,
    });
  }

  static toPersistence(invoice: Invoice) {
    const po: Partial<InvoicePO> = {
      id: invoice.id.value,
      campaignId: invoice.campaignId.value,
      invoiceNumber: invoice.invoiceNumber.value,
      status: invoice.status.value,
      archivedAt: invoice.archivedAt?.value ?? null,
    };
    return po;
  }

  static toDto(invoice: Invoice) {
    const lineItems = invoice.lineItems.items.map((item) =>
      InvoiceLineItemMapper.toDto(item),
    );
    return {
      id: invoice.id.value,
      campaignId: invoice.campaignId.value,
      invoiceNumber: invoice.invoiceNumber.value,
      totalAmount: invoice.totalAmount.value,
      status: invoice.status.value,
      archivedAt: invoice.archivedAt?.value ?? null,
      createdAt: invoice.createdAt.value,
      updatedAt: invoice.updatedAt.value,
      lineItems,
    };
  }
}
