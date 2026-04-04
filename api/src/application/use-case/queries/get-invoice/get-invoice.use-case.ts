import { Inject, InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InvoiceMapper } from '@plutus/infrastructure/mappers/invoice.mapper';
import {
  InvoiceDomain,
  InvoiceDomainRepository,
} from '@plutus/infrastructure/repository/invoice.repository';
import { Result } from '@common/result';
import { GetInvoiceQuery } from './get-invoice.input';
import { GetInvoiceOutput } from './get-invoice.output';

@QueryHandler(GetInvoiceQuery)
export class GetInvoiceUseCase implements IQueryHandler<
  GetInvoiceQuery,
  GetInvoiceOutput
> {
  constructor(
    @Inject(InvoiceDomain.Repository)
    private readonly invoiceRepository: InvoiceDomainRepository,
  ) {}

  async execute(query: GetInvoiceQuery) {
    try {
      const input = query.input;
      let invoice;

      if ('id' in input) {
        invoice = await this.invoiceRepository.findById(input.id);
      } else if ('campaignId' in input) {
        const result = await this.invoiceRepository.findAll({
          campaignId: input.campaignId,
        });
        invoice = result.items[0] ?? null;
      } else {
        return Result.Ok(null);
      }

      if (invoice === null) {
        return Result.Ok(null);
      }

      const dto = InvoiceMapper.toDto(invoice);
      return Result.Ok(dto);
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
