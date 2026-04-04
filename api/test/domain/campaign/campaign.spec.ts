import { Campaign } from '@plutus/domain/campaign/campaign';
import { makeCampaign } from '../../factories';

describe('Campaign aggregate', () => {
  describe('from()', () => {
    it('should reconstruct a campaign from props', () => {
      const campaign = makeCampaign();
      expect(campaign.id.value).toBe('dncnkn18pqamrqx43689pckc');
      expect(campaign.name.value).toBe('Summer Brand Awareness');
      expect(campaign.advertiser.value).toBe('Nike');
      expect(campaign.isArchived).toBe(false);
    });
  });

  describe('create()', () => {
    it('should create a new campaign', () => {
      const result = Campaign.create({
        name: 'New Campaign',
        advertiser: 'Adidas',
        startDate: 1000000,
        endDate: 2000000,
      });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const campaign = result.value as Campaign;
        expect(campaign.name.value).toBe('New Campaign');
        expect(campaign.isArchived).toBe(false);
      }
    });

    it('should fail if startDate >= endDate', () => {
      const result = Campaign.create({
        name: 'Bad Campaign',
        advertiser: 'Test',
        startDate: 2000000,
        endDate: 1000000,
      });
      expect(result.isErr()).toBe(true);
    });
  });

  describe('archive()', () => {
    it('should archive a non-archived campaign', () => {
      const campaign = makeCampaign();
      const result = campaign.archive();
      expect(result.isOk()).toBe(true);
      expect(campaign.isArchived).toBe(true);
      expect(campaign.archivedAt).not.toBeNull();
    });

    it('should fail if already archived', () => {
      const campaign = makeCampaign({ archivedAt: 1711720000000 });
      const result = campaign.archive();
      expect(result.isErr()).toBe(true);
    });
  });

  describe('unarchive()', () => {
    it('should unarchive an archived campaign', () => {
      const campaign = makeCampaign({ archivedAt: 1711720000000 });
      const result = campaign.unarchive();
      expect(result.isOk()).toBe(true);
      expect(campaign.isArchived).toBe(false);
      expect(campaign.archivedAt).toBeNull();
    });

    it('should fail if not archived', () => {
      const campaign = makeCampaign();
      const result = campaign.unarchive();
      expect(result.isErr()).toBe(true);
    });
  });

  describe('updateStartDate()', () => {
    it('should update start date if before end date', () => {
      const campaign = makeCampaign();
      const result = campaign.updateStartDate(1780300700000);
      expect(result.isOk()).toBe(true);
    });

    it('should fail if start date >= end date', () => {
      const campaign = makeCampaign();
      const result = campaign.updateStartDate(1788220800001);
      expect(result.isErr()).toBe(true);
    });
  });

  describe('updateEndDate()', () => {
    it('should update end date if after start date', () => {
      const campaign = makeCampaign();
      const result = campaign.updateEndDate(1800000000000);
      expect(result.isOk()).toBe(true);
    });

    it('should fail if end date <= start date', () => {
      const campaign = makeCampaign();
      const result = campaign.updateEndDate(1780300700000);
      expect(result.isErr()).toBe(true);
    });
  });

  describe('equals()', () => {
    it('should return true for same id', () => {
      const a = makeCampaign();
      const b = makeCampaign();
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for different id', () => {
      const a = makeCampaign();
      const b = makeCampaign({ id: 'abc12345678901234567890a' });
      expect(a.equals(b)).toBe(false);
    });

    it('should return false for undefined', () => {
      const a = makeCampaign();
      expect(a.equals(undefined)).toBe(false);
    });
  });
});
