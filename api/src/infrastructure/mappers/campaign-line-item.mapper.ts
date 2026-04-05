import { CampaignLineItem } from '@plutus/domain/campaign/campaign-line-item/campaign-line-item';
import { CampaignLineItem as CampaignLineItemPO } from '@modules/postgres/entities/campaign-line-item.entity';

export class CampaignLineItemMapper {
  static toDomain(po: CampaignLineItemPO) {
    return CampaignLineItem.from({
      id: po.id,
      campaignId: po.campaignId,
      name: po.name,
      bookedAmount: Number(po.bookedAmount),
      actualAmount: Number(po.actualAmount),
    });
  }

  static toPersistence(lineItem: CampaignLineItem) {
    const po: Partial<CampaignLineItemPO> = {
      campaignId: lineItem.campaignId.value,
      name: lineItem.name.value,
      bookedAmount: lineItem.bookedAmount.value,
      actualAmount: lineItem.actualAmount.value,
    };
    if (!lineItem.id.isFirstCreated()) {
      po.id = lineItem.id.value;
    }
    return po;
  }

  static toDto(lineItem: CampaignLineItem) {
    return {
      id: lineItem.id.value,
      campaignId: lineItem.campaignId.value,
      name: lineItem.name.value,
      bookedAmount: lineItem.bookedAmount.value,
      actualAmount: lineItem.actualAmount.value,
    };
  }
}
