import { CampaignId } from '@plutus/domain/common/campaign-id';
import { Money } from '@plutus/domain/common/money';
import { Entity } from '@common/domain/core/entity';
import { Result } from '@common/result';
import { CampaignLineItemId } from './campaign-line-item-id';
import { CampaignLineItemName } from './campaign-line-item-name';

interface CampaignLineItemProps {
  id: number;
  campaignId: number;
  name: string;
  bookedAmount: number;
  actualAmount: number;
}

export interface CreateCampaignLineItemProps {
  name: string;
  campaignId: number;
  bookedAmount: number;
  actualAmount: number;
}

export interface CampaignLineItemEntityProps {
  name: CampaignLineItemName;
  campaignId: CampaignId;
  bookedAmount: Money;
  actualAmount: Money;
}

export class CampaignLineItem extends Entity<
  CampaignLineItemId,
  CampaignLineItemEntityProps
> {
  get name() {
    return this.props.name;
  }

  get campaignId() {
    return this.props.campaignId;
  }

  get bookedAmount() {
    return this.props.bookedAmount;
  }

  get actualAmount() {
    return this.props.actualAmount;
  }

  updateActualAmount(amount: number) {
    const actualAmountResult = Money.create(amount);
    if (actualAmountResult.isErr()) {
      return actualAmountResult;
    }
    this.props.actualAmount = actualAmountResult.value;
    return Result.Ok(null);
  }

  equals(other?: CampaignLineItem) {
    if (!other) {
      return false;
    }
    return this.id.equals(other.id);
  }

  static from(props: CampaignLineItemProps) {
    const id = CampaignLineItemId.from(props.id);
    const campaignId = CampaignId.from(props.campaignId);
    const name = CampaignLineItemName.from(props.name);
    const bookedAmount = Money.from(props.bookedAmount);
    const actualAmount = Money.from(props.actualAmount);

    return new CampaignLineItem(id, {
      campaignId,
      name,
      bookedAmount,
      actualAmount,
    });
  }

  static create(props: CreateCampaignLineItemProps) {
    const idResult = CampaignLineItemId.create();
    if (idResult.isErr()) {
      return idResult;
    }

    const campaignIdResult = CampaignId.create(props.campaignId);
    if (campaignIdResult.isErr()) {
      return campaignIdResult;
    }

    const nameResult = CampaignLineItemName.create(props.name);
    if (nameResult.isErr()) {
      return nameResult;
    }

    const bookedAmountResult = Money.create(props.bookedAmount);
    if (bookedAmountResult.isErr()) {
      return bookedAmountResult;
    }

    const actualAmountResult = Money.create(props.actualAmount);
    if (actualAmountResult.isErr()) {
      return actualAmountResult;
    }

    return Result.Ok(
      new CampaignLineItem(idResult.value, {
        campaignId: campaignIdResult.value,
        name: nameResult.value,
        bookedAmount: bookedAmountResult.value,
        actualAmount: actualAmountResult.value,
      }),
    );
  }
}
