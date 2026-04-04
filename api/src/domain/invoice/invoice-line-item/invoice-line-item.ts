import { Entity } from '@common/domain/core/entity';
import { Result } from '@common/result';
import { CampaignLineItemId } from '@plutus/domain/campaign/campaign-line-item/campaign-line-item-id';
import { InvoiceId } from '@plutus/domain/common/invoice-id';
import { InvoiceLineItemId } from '@plutus/domain/common/invoice-line-item-id';
import { Money } from '@plutus/domain/common/money';
import { Adjustment } from './adjustment/adjustment';
import { AdjustmentCollection } from './adjustment/adjustment-collection';
import { InvoiceLineItemName } from './invoice-line-item-name';

export interface InvoiceLineItemProps {
  id: string;
  invoiceId: string;
  campaignLineItemId: string;
  name: string;
  actualAmount: number;
  adjustments?: Adjustment[];
}

export interface CreateInvoiceLineItemProps {
  invoiceId: string;
  campaignLineItemId: string;
  name: string;
  actualAmount: number;
}

export interface InvoiceLineItemEntityProps {
  invoiceId: InvoiceId;
  campaignLineItemId: CampaignLineItemId;
  name: InvoiceLineItemName;
  actualAmount: Money;
  adjustments: AdjustmentCollection;
}

export class InvoiceLineItem extends Entity<
  InvoiceLineItemId,
  InvoiceLineItemEntityProps
> {
  get invoiceId() {
    return this.props.invoiceId;
  }

  get campaignLineItemId() {
    return this.props.campaignLineItemId;
  }

  get name() {
    return this.props.name;
  }

  get actualAmount() {
    return this.props.actualAmount;
  }

  get adjustments() {
    return this.props.adjustments;
  }

  get adjustmentsTotal(): Money {
    return this.props.adjustments.items.reduce(
      (sum, adj) => sum.add(adj.amount),
      Money.from(0),
    );
  }

  get billableAmount(): Money {
    return this.actualAmount.add(this.adjustmentsTotal);
  }

  updateActualAmount(amount: number) {
    const actualAmountResult = Money.create(amount);
    if (actualAmountResult.isErr()) {
      return actualAmountResult;
    }
    this.props.actualAmount = actualAmountResult.value;
    return Result.Ok(null);
  }

  addAdjustment(adjustment: Adjustment) {
    this.props.adjustments.add(adjustment);
  }

  removeAdjustment(adjustment: Adjustment) {
    this.props.adjustments.remove(adjustment);
  }

  equals(other?: InvoiceLineItem) {
    if (!other) {
      return false;
    }
    return this.id.equals(other.id);
  }

  static from(props: InvoiceLineItemProps) {
    const id = InvoiceLineItemId.from(props.id);
    const invoiceId = InvoiceId.from(props.invoiceId);
    const campaignLineItemId = CampaignLineItemId.from(
      props.campaignLineItemId,
    );
    const name = InvoiceLineItemName.from(props.name);
    const actualAmount = Money.from(props.actualAmount);
    const adjustments = new AdjustmentCollection(props.adjustments);

    return new InvoiceLineItem(id, {
      invoiceId,
      campaignLineItemId,
      name,
      actualAmount,
      adjustments,
    });
  }

  static create(props: CreateInvoiceLineItemProps) {
    const idResult = InvoiceLineItemId.create();
    if (idResult.isErr()) {
      return idResult;
    }

    const invoiceIdResult = InvoiceId.create(props.invoiceId);
    if (invoiceIdResult.isErr()) {
      return invoiceIdResult;
    }

    const nameResult = InvoiceLineItemName.create(props.name);
    if (nameResult.isErr()) {
      return nameResult;
    }

    const actualAmountResult = Money.create(props.actualAmount);
    if (actualAmountResult.isErr()) {
      return actualAmountResult;
    }

    const campaignLineItemId = CampaignLineItemId.from(
      props.campaignLineItemId,
    );

    return Result.Ok(
      new InvoiceLineItem(idResult.value, {
        invoiceId: invoiceIdResult.value,
        campaignLineItemId,
        name: nameResult.value,
        actualAmount: actualAmountResult.value,
        adjustments: new AdjustmentCollection(),
      }),
    );
  }
}
