import { Campaign } from '@modules/postgres/entities';
import { PostgresModule } from '@modules/postgres/postgres.module';
import { CampaignDomainRepository } from '@plutus/infrastructure/repository/campaign.repository';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CampaignDomainRepository (integration)', () => {
  let module: TestingModule;
  let repo: CampaignDomainRepository;
  let typeormRepo: Repository<Campaign>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [PostgresModule],
      providers: [CampaignDomainRepository],
    }).compile();

    repo = module.get(CampaignDomainRepository);
    typeormRepo = module.get(getRepositoryToken(Campaign));
  }, 30_000);

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await typeormRepo.clear();
  });

  async function seedCampaign(overrides: Partial<Campaign> = {}) {
    const campaign = typeormRepo.create({
      name: 'Test Campaign',
      advertiser: 'Nike',
      startDate: 1780300800000,
      endDate: 1788220800000,
      archivedAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...overrides,
    });
    return typeormRepo.save(campaign);
  }

  describe('findById', () => {
    it('should return a domain campaign by id', async () => {
      const saved = await seedCampaign();
      const result = await repo.findById(saved.id);
      expect(result).not.toBeNull();
      expect(result!.id.value).toBe(saved.id);
      expect(result!.name.value).toBe('Test Campaign');
    });

    it('should return null for non-existent id', async () => {
      const result = await repo.findById('nonexistent_id_00000000');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated campaigns', async () => {
      await seedCampaign({ name: 'Campaign A' });
      await seedCampaign({ name: 'Campaign B' });
      await seedCampaign({ name: 'Campaign C' });

      const result = await repo.findAll({ page: 1, limit: 2 });
      expect(result.items).toHaveLength(2);
      expect(result.totalItems).toBe(3);
    });

    it('should exclude archived campaigns by default', async () => {
      await seedCampaign({ name: 'Active' });
      await seedCampaign({ name: 'Archived', archivedAt: Date.now() });

      const result = await repo.findAll();
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name.value).toBe('Active');
    });

    it('should include archived when includeArchived is true', async () => {
      await seedCampaign({ name: 'Active' });
      await seedCampaign({ name: 'Archived', archivedAt: Date.now() });

      const result = await repo.findAll({ includeArchived: true });
      expect(result.items).toHaveLength(2);
    });

    it('should filter by advertiser', async () => {
      await seedCampaign({ advertiser: 'Nike' });
      await seedCampaign({ advertiser: 'Adidas' });

      const result = await repo.findAll({ advertiser: 'Nike' });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].advertiser.value).toBe('Nike');
    });

    it('should search by name (case-insensitive)', async () => {
      await seedCampaign({ name: 'Summer Brand' });
      await seedCampaign({ name: 'Winter Sale' });

      const result = await repo.findAll({ search: 'summer' });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name.value).toBe('Summer Brand');
    });
  });

  describe('save', () => {
    it('should persist changes to an existing campaign', async () => {
      const saved = await seedCampaign();
      const domain = await repo.findById(saved.id);
      expect(domain).not.toBeNull();

      domain!.archive();
      await repo.save(domain!);

      const updated = await repo.findById(saved.id);
      expect(updated!.isArchived).toBe(true);
    });
  });
});
