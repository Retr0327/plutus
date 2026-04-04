import type { CampaignProps } from '@plutus/domain/campaign/campaign';
import { Campaign } from '@plutus/domain/campaign/campaign';

const CAMPAIGN_DEFAULTS: CampaignProps = {
  id: 'dncnkn18pqamrqx43689pckc',
  name: 'Summer Brand Awareness',
  advertiser: 'Nike',
  startDate: 1780300800000,
  endDate: 1788220800000,
  archivedAt: null,
  createdAt: 1711720000000,
  updatedAt: 1711720000000,
};

export function makeCampaign(overrides: Partial<CampaignProps> = {}) {
  return Campaign.from({ ...CAMPAIGN_DEFAULTS, ...overrides });
}
