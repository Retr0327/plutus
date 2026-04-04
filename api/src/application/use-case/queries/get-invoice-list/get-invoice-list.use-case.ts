import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from '@common/result';
import { Invoice } from '@modules/postgres/entities';
import { GetInvoiceListQuery } from './get-invoice-list.input';
import { GetInvoiceListOutput } from './get-invoice-list.output';

@QueryHandler(GetInvoiceListQuery)
export class GetInvoiceListUseCase implements IQueryHandler<
  GetInvoiceListQuery,
  GetInvoiceListOutput
> {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async execute(query: GetInvoiceListQuery) {
    try {
      const { page, limit, status, campaignId, includeArchived } = query;

      const where: FindOptionsWhere<Invoice> = {};
      if (!includeArchived) {
        where.archivedAt = IsNull();
      }
      if (status) {
        where.status = status as any;
      }
      if (campaignId) {
        where.campaignId = campaignId;
      }

      const [invoices, totalItems] = await this.invoiceRepository.findAndCount({
        where,
        relations: ['campaign', 'lineItems', 'lineItems.adjustments'],
        order: { createdAt: 'ASC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const items = invoices.map((inv) => {
        const totalActualAmount = (inv.lineItems ?? []).reduce(
          (sum, ili) => sum + Number(ili.actualAmount),
          0,
        );
        const totalAdjustments = (inv.lineItems ?? []).reduce(
          (sum, ili) =>
            sum +
            (ili.adjustments ?? []).reduce(
              (s, adj) => s + Number(adj.amount),
              0,
            ),
          0,
        );

        return {
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          status: inv.status,
          campaignId: inv.campaignId,
          campaignName: inv.campaign?.name ?? '',
          totalActualAmount,
          totalAdjustments,
          totalBillableAmount: totalActualAmount + totalAdjustments,
          lineItemCount: inv.lineItems?.length ?? 0,
          archivedAt: inv.archivedAt !== null ? Number(inv.archivedAt) : null,
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
