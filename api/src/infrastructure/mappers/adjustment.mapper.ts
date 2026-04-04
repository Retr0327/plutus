import { Adjustment } from '@plutus/domain/invoice/invoice-line-item/adjustment/adjustment';
import { Adjustment as AdjustmentPO } from '@modules/postgres/entities/adjustment.entity';

export class AdjustmentMapper {
  static toDomain(po: AdjustmentPO) {
    return Adjustment.from({
      id: po.id,
      invoiceLineItemId: po.invoiceLineItemId,
      amount: Number(po.amount),
      reason: po.reason,
      createdBy: po.createdBy,
      createdAt: Number(po.createdAt),
      updatedAt: Number(po.updatedAt),
    });
  }

  static toPersistence(adjustment: Adjustment) {
    const po: Partial<AdjustmentPO> = {
      id: adjustment.id.value,
      invoiceLineItemId: adjustment.invoiceLineItemId.value,
      amount: adjustment.amount.value,
      reason: adjustment.reason.value,
      createdBy: adjustment.createdBy.value,
      createdAt: adjustment.createdAt.value,
      updatedAt: adjustment.updatedAt.value,
    };
    return po;
  }

  static toDto(adjustment: Adjustment) {
    return {
      id: adjustment.id.value,
      invoiceLineItemId: adjustment.invoiceLineItemId.value,
      amount: adjustment.amount.value,
      reason: adjustment.reason.value,
      createdBy: adjustment.createdBy.value,
      createdAt: adjustment.createdAt.value,
      updatedAt: adjustment.updatedAt.value,
    };
  }
}
