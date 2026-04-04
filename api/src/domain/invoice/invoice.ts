import {
  CreatedAt,
  Timestamp,
  UpdatedAt,
} from '@common/domain/common/timestamp';
import { AggregateRoot } from '@common/domain/core/aggregate-root';
import { Result } from '@common/result';
import { InvoiceStatus as InvoiceStatusEnum } from '@modules/postgres/enum';
import { CampaignId } from '@plutus/domain/common/campaign-id';
import { InvoiceId } from '@plutus/domain/common/invoice-id';
import { InvoiceLineItemId } from '@plutus/domain/common/invoice-line-item-id';
import { Money } from '@plutus/domain/common/money';
import { Adjustment } from './invoice-line-item/adjustment/adjustment';
import { InvoiceLineItem } from './invoice-line-item/invoice-line-item';
import { InvoiceLineItemCollection } from './invoice-line-item/invoice-line-item-collection';
import { InvoiceNumber } from './invoice-number';
import { InvoiceStatus } from './invoice-status';

export interface InvoiceProps {
  id: string;
  campaignId: string;
  invoiceNumber: string;
  status: string;
  archivedAt: number | null;
  createdAt: number;
  updatedAt: number;
  lineItems?: InvoiceLineItem[];
}

export interface CreateInvoiceProps {
  campaignId: string;
  invoiceNumber: string;
}

export interface InvoiceAggregateRootProps {
  campaignId: CampaignId;
  invoiceNumber: InvoiceNumber;
  status: InvoiceStatus;
  archivedAt: Timestamp | null;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  lineItems: InvoiceLineItemCollection;
}

export class Invoice extends AggregateRoot<
  InvoiceId,
  InvoiceAggregateRootProps
> {
  get campaignId() {
    return this.props.campaignId;
  }

  get invoiceNumber() {
    return this.props.invoiceNumber;
  }

  get status() {
    return this.props.status;
  }

  get lineItems() {
    return this.props.lineItems;
  }

  get archivedAt() {
    return this.props.archivedAt;
  }

  get isArchived() {
    return this.props.archivedAt !== null;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get totalAmount(): Money {
    return this.props.lineItems.items.reduce(
      (sum, item) => sum.add(item.billableAmount),
      Money.from(0),
    );
  }

  isDraft() {
    return this.props.status.isDraft();
  }

  isFinalized() {
    return this.props.status.isFinalized();
  }

  finalize() {
    if (this.isFinalized()) {
      return Result.Err(new Error('Invoice is already finalized'));
    }
    this.props.status = new InvoiceStatus(InvoiceStatusEnum.Finalized);
    return Result.Ok(null);
  }

  archive() {
    if (this.isArchived) {
      return Result.Err(new Error('Invoice is already archived'));
    }
    this.props.archivedAt = Timestamp.from(Date.now());
    return Result.Ok(null);
  }

  unarchive() {
    if (!this.isArchived) {
      return Result.Err(new Error('Invoice is not archived'));
    }
    this.props.archivedAt = null;
    return Result.Ok(null);
  }

  addLineItem(lineItem: InvoiceLineItem) {
    if (this.isFinalized()) {
      return Result.Err(
        new Error('Cannot add line items to a finalized invoice'),
      );
    }
    this.props.lineItems.add(lineItem);
    return Result.Ok(null);
  }

  removeLineItem(lineItem: InvoiceLineItem) {
    if (this.isFinalized()) {
      return Result.Err(
        new Error('Cannot remove line items from a finalized invoice'),
      );
    }
    this.props.lineItems.remove(lineItem);
    return Result.Ok(null);
  }

  addAdjustment(lineItemId: InvoiceLineItemId, adjustment: Adjustment) {
    if (this.isFinalized()) {
      return Result.Err(
        new Error('Cannot add adjustments to a finalized invoice'),
      );
    }
    const lineItem = this.props.lineItems.find((item) =>
      item.id.equals(lineItemId),
    );
    if (!lineItem) {
      return Result.Err(new Error('Invoice line item not found'));
    }
    lineItem.addAdjustment(adjustment);
    this.props.lineItems.update(lineItem);
    return Result.Ok(null);
  }

  removeAdjustment(lineItemId: InvoiceLineItemId, adjustment: Adjustment) {
    if (this.isFinalized()) {
      return Result.Err(
        new Error('Cannot remove adjustments from a finalized invoice'),
      );
    }
    const lineItem = this.props.lineItems.find((item) =>
      item.id.equals(lineItemId),
    );
    if (!lineItem) {
      return Result.Err(new Error('Invoice line item not found'));
    }
    lineItem.removeAdjustment(adjustment);
    this.props.lineItems.update(lineItem);
    return Result.Ok(null);
  }

  equals(other?: Invoice) {
    if (!other) {
      return false;
    }
    return this.id.equals(other.id);
  }

  static from(props: InvoiceProps) {
    const id = InvoiceId.from(props.id);
    const campaignId = CampaignId.from(props.campaignId);
    const invoiceNumber = InvoiceNumber.from(props.invoiceNumber);
    const status = InvoiceStatus.from(props.status);
    const archivedAt =
      props.archivedAt !== null ? Timestamp.from(props.archivedAt) : null;
    const createdAt = CreatedAt.from(props.createdAt);
    const updatedAt = UpdatedAt.from(props.updatedAt);
    const lineItems = new InvoiceLineItemCollection(props.lineItems);

    return new Invoice(id, {
      campaignId,
      invoiceNumber,
      status,
      archivedAt,
      createdAt,
      updatedAt,
      lineItems,
    });
  }

  static create(props: CreateInvoiceProps) {
    const idResult = InvoiceId.create();
    if (idResult.isErr()) {
      return idResult;
    }

    const invoiceNumberResult = InvoiceNumber.create(props.invoiceNumber);
    if (invoiceNumberResult.isErr()) {
      return invoiceNumberResult;
    }

    const campaignIdResult = CampaignId.create(props.campaignId);
    if (campaignIdResult.isErr()) {
      return campaignIdResult;
    }
    const statusResult = InvoiceStatus.create(InvoiceStatusEnum.Draft);
    if (statusResult.isErr()) {
      return statusResult;
    }

    const now = Date.now();

    return Result.Ok(
      new Invoice(idResult.value, {
        campaignId: campaignIdResult.value,
        invoiceNumber: invoiceNumberResult.value,
        status: statusResult.value,
        archivedAt: null,
        createdAt: CreatedAt.from(now),
        updatedAt: UpdatedAt.from(now),
        lineItems: new InvoiceLineItemCollection(),
      }),
    );
  }
}
