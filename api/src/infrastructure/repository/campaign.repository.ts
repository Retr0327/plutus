import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AbstractCampaignDomainRepository,
  CampaignListResult,
  CampaignQueryOptions,
} from '@plutus/domain/campaign/campaign.repository';
import { CampaignMapper } from '@plutus/infrastructure/mappers/campaign.mapper';
import { caseInsensitiveLike } from '@modules/postgres/common/column.decorator';
import { Campaign } from '@modules/postgres/entities';

export const enum CampaignDomain {
  Repository = 'CampaignDomainRepository',
}

@Injectable()
export class CampaignDomainRepository implements AbstractCampaignDomainRepository {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async findById(id: string) {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['lineItems'],
    });
    if (campaign === null) {
      return null;
    }
    return CampaignMapper.toDomain(campaign);
  }

  async findAll(options?: CampaignQueryOptions): Promise<CampaignListResult> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;

    const where: FindOptionsWhere<Campaign> = {};

    if (!options?.includeArchived) {
      where.archivedAt = IsNull();
    }
    if (options?.advertiser) {
      where.advertiser = options.advertiser;
    }
    if (options?.search) {
      where.name = caseInsensitiveLike(`%${options.search}%`);
    }

    const [items, totalItems] = await this.campaignRepository.findAndCount({
      where,
      relations: ['lineItems', 'invoices'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map((c) => CampaignMapper.toDomain(c)),
      totalItems,
    };
  }

  async save(campaign: ReturnType<typeof CampaignMapper.toDomain>) {
    const po = CampaignMapper.toPersistence(campaign);
    await this.campaignRepository.save(po);
  }
}
