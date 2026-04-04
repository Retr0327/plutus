import { CampaignId } from '@plutus/domain/common/campaign-id';
import { Money } from '@plutus/domain/common/money';
import {
  CreatedAt,
  Timestamp,
  UpdatedAt,
} from '@common/domain/common/timestamp';
import { AggregateRoot } from '@common/domain/core/aggregate-root';
import { Result } from '@common/result';
import { Advertiser } from './advertiser';
import { CampaignLineItem } from './campaign-line-item/campaign-line-item';
import { CampaignLineItemCollection } from './campaign-line-item/campaign-line-item-collection';
import { CampaignName } from './campaign-name';

export interface CampaignProps {
  id: string;
  name: string;
  advertiser: string;
  startDate: number;
  endDate: number;
  lineItems?: CampaignLineItem[];
  archivedAt: number | null;
  updatedAt: number;
  createdAt: number;
}

export interface CreateCampaignProps {
  name: string;
  advertiser: string;
  startDate: number;
  endDate: number;
}

export interface CampaignAggregateRootProps {
  name: CampaignName;
  advertiser: Advertiser;
  startDate: Timestamp;
  endDate: Timestamp;
  lineItems: CampaignLineItemCollection;
  archivedAt: Timestamp | null;
  updatedAt: UpdatedAt;
  createdAt: CreatedAt;
}

export class Campaign extends AggregateRoot<
  CampaignId,
  CampaignAggregateRootProps
> {
  get name() {
    return this.props.name;
  }

  get advertiser() {
    return this.props.advertiser;
  }

  get startDate() {
    return this.props.startDate;
  }

  get endDate() {
    return this.props.endDate;
  }

  get lineItems() {
    return this.props.lineItems;
  }

  get bookedTotal(): Money {
    return this.props.lineItems.items.reduce(
      (sum, item) => sum.add(item.bookedAmount),
      Money.from(0),
    );
  }

  get archivedAt() {
    return this.props.archivedAt;
  }

  get isArchived() {
    return this.props.archivedAt !== null;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  updateName(name: CampaignName) {
    this.props.name = name;
  }

  updateAdvertiser(advertiser: Advertiser) {
    this.props.advertiser = advertiser;
  }

  updateStartDate(timestamp: number) {
    if (timestamp >= this.endDate.value) {
      return Result.Err(new Error('Start date must be before end date'));
    }
    const startDateResult = Timestamp.create(timestamp);
    if (startDateResult.isErr()) {
      return startDateResult;
    }
    this.props.startDate = startDateResult.value;
    return Result.Ok(null);
  }

  updateEndDate(timestamp: number) {
    if (this.startDate.value >= timestamp) {
      return Result.Err(new Error('Start date must be before end date'));
    }
    const endDateResult = Timestamp.create(timestamp);
    if (endDateResult.isErr()) {
      return endDateResult;
    }
    this.props.endDate = endDateResult.value;
    return Result.Ok(null);
  }

  archive() {
    if (this.isArchived) {
      return Result.Err(new Error('Campaign is already archived'));
    }
    this.props.archivedAt = Timestamp.from(Date.now());
    return Result.Ok(null);
  }

  unarchive() {
    if (!this.isArchived) {
      return Result.Err(new Error('Campaign is not archived'));
    }
    this.props.archivedAt = null;
    return Result.Ok(null);
  }

  addLineItem(lineItem: CampaignLineItem) {
    this.props.lineItems.add(lineItem);
  }

  removeLineItem(lineItem: CampaignLineItem) {
    this.props.lineItems.remove(lineItem);
  }

  updateLineItem(lineItem: CampaignLineItem) {
    return this.props.lineItems.update(lineItem);
  }

  equals(other?: Campaign) {
    if (!other) {
      return false;
    }
    return this.id.equals(other.id);
  }

  static from(props: CampaignProps) {
    const id = CampaignId.from(props.id);
    const name = CampaignName.from(props.name);
    const advertiser = Advertiser.from(props.advertiser);
    const startDate = Timestamp.from(props.startDate);
    const endDate = Timestamp.from(props.endDate);
    const lineItems = new CampaignLineItemCollection(props.lineItems);
    const archivedAt =
      props.archivedAt !== null ? Timestamp.from(props.archivedAt) : null;
    const updatedAt = UpdatedAt.from(props.updatedAt);
    const createdAt = CreatedAt.from(props.createdAt);

    return new Campaign(id, {
      name,
      advertiser,
      startDate,
      endDate,
      lineItems,
      archivedAt,
      updatedAt,
      createdAt,
    });
  }

  static create(props: CreateCampaignProps) {
    const idResult = CampaignId.create();
    if (idResult.isErr()) {
      return idResult;
    }

    const nameResult = CampaignName.create(props.name);
    if (nameResult.isErr()) {
      return nameResult;
    }

    const advertiserResult = Advertiser.create(props.advertiser);
    if (advertiserResult.isErr()) {
      return advertiserResult;
    }

    if (props.startDate >= props.endDate) {
      return Result.Err(new Error('Start date must be before end date'));
    }

    const startDate = Timestamp.create(props.startDate);
    const endDate = Timestamp.create(props.endDate);
    const updatedAt = UpdatedAt.create(Date.now());
    const createdAt = CreatedAt.create();

    return Result.Ok(
      new Campaign(idResult.value, {
        name: nameResult.value,
        advertiser: advertiserResult.value,
        startDate: startDate.value,
        endDate: endDate.value,
        lineItems: new CampaignLineItemCollection(),
        archivedAt: null,
        updatedAt: updatedAt.value,
        createdAt: createdAt.value,
      }),
    );
  }
}
