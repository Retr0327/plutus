import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from '@common/result';
import { caseInsensitiveLike } from '@modules/postgres/common/column.decorator';
import { Campaign } from '@modules/postgres/entities';
import { GetCampaignSummaryQuery } from './get-campaign-summary.input';
import { GetCampaignSummaryOutput } from './get-campaign-summary.output';

@QueryHandler(GetCampaignSummaryQuery)
export class GetCampaignSummaryUseCase implements IQueryHandler<
  GetCampaignSummaryQuery,
  GetCampaignSummaryOutput
> {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async execute(query: GetCampaignSummaryQuery) {
    try {
      const { page, limit, search, advertiser, includeArchived } = query;

      const where: FindOptionsWhere<Campaign> = {};
      if (!includeArchived) {
        where.archivedAt = IsNull();
      }
      if (advertiser) {
        where.advertiser = advertiser;
      }
      if (search) {
        where.name = caseInsensitiveLike(`%${search}%`);
      }

      const [campaigns, totalItems] =
        await this.campaignRepository.findAndCount({
          where,
          relations: ['lineItems', 'invoices'],
          order: { createdAt: 'ASC' },
          skip: (page - 1) * limit,
          take: limit,
        });

      const items = campaigns.map((c) => {
        const totalBookedAmount = c.lineItems.reduce(
          (sum, li) => sum + Number(li.bookedAmount),
          0,
        );
        const totalActualAmount = c.lineItems.reduce(
          (sum, li) => sum + Number(li.actualAmount),
          0,
        );

        return {
          id: c.id,
          name: c.name,
          advertiser: c.advertiser,
          startDate: Number(c.startDate),
          endDate: Number(c.endDate),
          totalBookedAmount,
          totalActualAmount,
          invoiceCount: c.invoices?.length ?? 0,
          archivedAt: c.archivedAt !== null ? Number(c.archivedAt) : null,
        };
      });

      return Result.Ok({
        items,
        meta: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
