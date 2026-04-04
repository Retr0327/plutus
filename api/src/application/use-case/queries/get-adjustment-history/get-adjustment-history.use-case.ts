import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuditLogMapper } from '@plutus/infrastructure/mappers/audit-log.mapper';
import {
  AuditLogDomain,
  AuditLogDomainRepository,
} from '@plutus/infrastructure/repository/audit-log.repository';
import {
  InvoiceDomain,
  InvoiceDomainRepository,
} from '@plutus/infrastructure/repository/invoice.repository';
import { Result } from '@common/result';
import { AuditLogEntity } from '@modules/postgres/enum';
import { GetAdjustmentHistoryQuery } from './get-adjustment-history.input';
import { GetAdjustmentHistoryOutput } from './get-adjustment-history.output';

@QueryHandler(GetAdjustmentHistoryQuery)
export class GetAdjustmentHistoryUseCase implements IQueryHandler<
  GetAdjustmentHistoryQuery,
  GetAdjustmentHistoryOutput
> {
  constructor(
    @Inject(InvoiceDomain.Repository)
    private readonly invoiceRepository: InvoiceDomainRepository,
    @Inject(AuditLogDomain.Repository)
    private readonly auditLogRepository: AuditLogDomainRepository,
  ) {}

  async execute(query: GetAdjustmentHistoryQuery) {
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
        return Result.Err(new NotFoundException('Adjustment not found'));
      }

      const auditLogs = await this.auditLogRepository.findByEntity(
        AuditLogEntity.Adjustment,
        query.adjustmentId,
      );

      return Result.Ok({
        items: auditLogs.map((al) => AuditLogMapper.toDto(al)),
      });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
