import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AdjustmentMapper } from '@plutus/infrastructure/mappers/adjustment.mapper';
import {
  InvoiceDomain,
  InvoiceDomainRepository,
} from '@plutus/infrastructure/repository/invoice.repository';
import { Result } from '@common/result';
import { GetAdjustmentQuery } from './get-adjustment.input';
import { GetAdjustmentOutput } from './get-adjustment.output';

@QueryHandler(GetAdjustmentQuery)
export class GetAdjustmentUseCase implements IQueryHandler<
  GetAdjustmentQuery,
  GetAdjustmentOutput
> {
  constructor(
    @Inject(InvoiceDomain.Repository)
    private readonly invoiceRepository: InvoiceDomainRepository,
  ) {}

  async execute(query: GetAdjustmentQuery) {
    try {
      const invoice = await this.invoiceRepository.findById(query.invoiceId);
      if (!invoice) {
        return Result.Err(new NotFoundException('Invoice not found'));
      }

      const lineItem = invoice.lineItems.find(
        (li) => li.id.value === query.lineItemId,
      );
      if (!lineItem) {
        return Result.Err(new NotFoundException('Invoice line item not found'));
      }

      const adjustment = lineItem.adjustments.find(
        (adj) => adj.id.value === query.adjustmentId,
      );
      if (!adjustment) {
        return Result.Ok(null);
      }

      return Result.Ok(AdjustmentMapper.toDto(adjustment));
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
