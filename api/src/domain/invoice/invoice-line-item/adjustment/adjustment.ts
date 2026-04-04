import { CreatedAt, UpdatedAt } from '@common/domain/common/timestamp';
import { Entity } from '@common/domain/core/entity';
import { Result } from '@common/result';
import { InvoiceLineItemId } from '@plutus/domain/common/invoice-line-item-id';
import { Money } from '@plutus/domain/common/money';
import { AdjustmentId } from './adjustment-id';
import { AdjustmentReason } from './adjustment-reason';
import { CreatedBy } from './created-by';

export interface AdjustmentProps {
  id: string;
  invoiceLineItemId: string;
  amount: number;
  reason: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateAdjustmentProps {
  invoiceLineItemId: string;
  amount: number;
  reason: string;
  createdBy: string;
}

export interface AdjustmentEntityProps {
  invoiceLineItemId: InvoiceLineItemId;
  amount: Money;
  reason: AdjustmentReason;
  createdBy: CreatedBy;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}

export class Adjustment extends Entity<AdjustmentId, AdjustmentEntityProps> {
  get invoiceLineItemId() {
    return this.props.invoiceLineItemId;
  }

  get amount() {
    return this.props.amount;
  }

  get reason() {
    return this.props.reason;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  updateAmount(amount: number) {
    const amountResult = Money.create(amount);
    if (amountResult.isErr()) {
      return amountResult;
    }
    this.props.amount = amountResult.value;
    this.props.updatedAt = UpdatedAt.from(Date.now());
    return Result.Ok(null);
  }

  updateReason(reason: string) {
    const reasonResult = AdjustmentReason.create(reason);
    if (reasonResult.isErr()) {
      return reasonResult;
    }
    this.props.reason = reasonResult.value;
    this.props.updatedAt = UpdatedAt.from(Date.now());
    return Result.Ok(null);
  }

  equals(other?: Adjustment) {
    if (!other) {
      return false;
    }
    return this.id.equals(other.id);
  }

  static from(props: AdjustmentProps) {
    const id = AdjustmentId.from(props.id);
    const invoiceLineItemId = InvoiceLineItemId.from(props.invoiceLineItemId);
    const amount = Money.from(props.amount);
    const reason = AdjustmentReason.from(props.reason);
    const createdBy = CreatedBy.from(props.createdBy);
    const createdAt = CreatedAt.from(props.createdAt);
    const updatedAt = UpdatedAt.from(props.updatedAt);

    return new Adjustment(id, {
      invoiceLineItemId,
      amount,
      reason,
      createdBy,
      createdAt,
      updatedAt,
    });
  }

  static create(props: CreateAdjustmentProps) {
    const idResult = AdjustmentId.create();
    if (idResult.isErr()) {
      return idResult;
    }

    const invoiceLineItemIdResult = InvoiceLineItemId.create(
      props.invoiceLineItemId,
    );
    if (invoiceLineItemIdResult.isErr()) {
      return invoiceLineItemIdResult;
    }

    const amountResult = Money.create(props.amount);
    if (amountResult.isErr()) {
      return amountResult;
    }

    const reasonResult = AdjustmentReason.create(props.reason);
    if (reasonResult.isErr()) {
      return reasonResult;
    }

    const createdByResult = CreatedBy.create(props.createdBy);
    if (createdByResult.isErr()) {
      return createdByResult;
    }

    const now = Date.now();

    return Result.Ok(
      new Adjustment(idResult.value, {
        invoiceLineItemId: invoiceLineItemIdResult.value,
        amount: amountResult.value,
        reason: reasonResult.value,
        createdBy: createdByResult.value,
        createdAt: CreatedAt.from(now),
        updatedAt: UpdatedAt.from(now),
      }),
    );
  }
}
