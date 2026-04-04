import Collection from '@common/domain/collection';
import { CampaignLineItem } from './campaign-line-item';

export class CampaignLineItemCollection extends Collection<CampaignLineItem> {
  isSameItem(a: CampaignLineItem, b: CampaignLineItem) {
    return a.equals(b);
  }
}
