import { InvoiceLineItem } from '@plutus/domain/invoice/invoice-line-item/invoice-line-item';
import { InvoiceLineItem as InvoiceLineItemPO } from '@modules/postgres/entities/invoice-line-item.entity';
import { AdjustmentMapper } from './adjustment.mapper';

export class InvoiceLineItemMapper {
  static toDomain(po: InvoiceLineItemPO) {
    const adjustments = (po.adjustments ?? []).map((adjustment) =>
      AdjustmentMapper.toDomain(adjustment),
    );

    return InvoiceLineItem.from({
      id: po.id,
      invoiceId: po.invoiceId,
      campaignLineItemId: po.campaignLineItemId,
      actualAmount: Number(po.actualAmount),
      adjustments,
    });
  }

  static toPersistence(item: InvoiceLineItem) {
    const po: Partial<InvoiceLineItemPO> = {
      id: item.id.value,
      invoiceId: item.invoiceId.value,
      campaignLineItemId: item.campaignLineItemId.value,
      actualAmount: item.actualAmount.value,
    };
    return po;
  }

  static toDto(item: InvoiceLineItem) {
    const adjustments = item.adjustments.items.map((adjustment) =>
      AdjustmentMapper.toDto(adjustment),
    );
    return {
      id: item.id.value,
      invoiceId: item.invoiceId.value,
      campaignLineItemId: item.campaignLineItemId.value,
      actualAmount: item.actualAmount.value,
      adjustmentsTotal: item.adjustmentsTotal.value,
      billableAmount: item.billableAmount.value,
      adjustments,
    };
  }
}
