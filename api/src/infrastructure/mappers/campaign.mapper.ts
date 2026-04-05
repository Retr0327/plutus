import { Campaign } from '@plutus/domain/campaign/campaign';
import { Campaign as CampaignPO } from '@modules/postgres/entities/campaign.entity';
import { CampaignLineItemMapper } from './campaign-line-item.mapper';

export class CampaignMapper {
  static toDomain(po: CampaignPO) {
    const lineItems = (po.lineItems ?? []).map((item) =>
      CampaignLineItemMapper.toDomain(item),
    );

    return Campaign.from({
      id: po.id,
      name: po.name,
      advertiser: po.advertiser,
      startDate: Number(po.startDate),
      endDate: Number(po.endDate),
      lineItems,
      archivedAt: po.archivedAt !== null ? Number(po.archivedAt) : null,
      updatedAt: po.updatedAt,
      createdAt: po.createdAt,
    });
  }

  static toPersistence(campaign: Campaign) {
    const po: Partial<CampaignPO> = {
      name: campaign.name.value,
      advertiser: campaign.advertiser.value,
      startDate: String(campaign.startDate.value),
      endDate: String(campaign.endDate.value),
      archivedAt: campaign.archivedAt?.value ?? null,
    };
    if (!campaign.id.isFirstCreated()) {
      po.id = campaign.id.value;
    }
    return po;
  }

  static toDto(campaign: Campaign) {
    const lineItems = campaign.lineItems.items.map((item) =>
      CampaignLineItemMapper.toDto(item),
    );
    return {
      id: campaign.id.value,
      name: campaign.name.value,
      bookedTotal: campaign.bookedTotal.value,
      advertiser: campaign.advertiser.value,
      startDate: campaign.startDate.value,
      endDate: campaign.endDate.value,
      archivedAt: campaign.archivedAt?.value ?? null,
      lineItems,
      updatedAt: campaign.updatedAt.value,
      createdAt: campaign.createdAt.value,
    };
  }
}
