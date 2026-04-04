import { DataSource } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuditLog } from '@plutus/domain/audit-log/audit-log';
import { Adjustment } from '@plutus/domain/invoice/invoice-line-item/adjustment/adjustment';
import {
  AuditLogDomain,
  AuditLogDomainRepository,
} from '@plutus/infrastructure/repository/audit-log.repository';
import {
  InvoiceDomain,
  InvoiceDomainRepository,
} from '@plutus/infrastructure/repository/invoice.repository';
import { Result } from '@common/result';
import { AuditLogAction, AuditLogEntity } from '@modules/postgres/enum';
import { CreateAdjustmentCommand } from './create-adjustment.input';
import { CreateAdjustmentOutput } from './create-adjustment.output';

@CommandHandler(CreateAdjustmentCommand)
export class CreateAdjustmentUseCase implements ICommandHandler<
  CreateAdjustmentCommand,
  CreateAdjustmentOutput
> {
  constructor(
    @Inject(InvoiceDomain.Repository)
    private readonly invoiceRepository: InvoiceDomainRepository,
    @Inject(AuditLogDomain.Repository)
    private readonly auditLogRepository: AuditLogDomainRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateAdjustmentCommand) {
    try {
      const invoice = await this.invoiceRepository.findById(command.invoiceId);
      if (!invoice) {
        return Result.Err(new NotFoundException('Invoice not found'));
      }

      if (invoice.isFinalized()) {
        return Result.Err(
          new ForbiddenException(
            'Cannot modify adjustments on a finalized invoice',
          ),
        );
      }

      const lineItem = invoice.lineItems.find(
        (li) => li.id.value === command.lineItemId,
      );
      if (!lineItem) {
        return Result.Err(new NotFoundException('Invoice line item not found'));
      }

      const adjustmentResult = Adjustment.create({
        invoiceLineItemId: lineItem.id.value,
        amount: command.amount,
        reason: command.reason,
        createdBy: command.createdBy,
      });
      if (adjustmentResult.isErr()) {
        return Result.Err(
          new BadRequestException(String(adjustmentResult.error)),
        );
      }

      const adjustment = adjustmentResult.value;

      const addResult = invoice.addAdjustment(lineItem.id, adjustment);
      if (addResult.isErr()) {
        return Result.Err(new BadRequestException(addResult.error.message));
      }

      const auditLogResult = AuditLog.create({
        entityType: AuditLogEntity.Adjustment,
        entityId: adjustment.id.value,
        action: AuditLogAction.Create,
        changedBy: command.createdBy,
        oldValue: undefined,
        newValue: {
          amount: adjustment.amount.value,
          reason: adjustment.reason.value,
        },
      });
      if (auditLogResult.isErr()) {
        return Result.Err(
          new InternalServerErrorException(String(auditLogResult.error)),
        );
      }

      await this.dataSource.transaction(async (tx) => {
        await this.invoiceRepository.save(invoice, tx);
        await this.auditLogRepository.saveWithTx(auditLogResult.value, tx);
      });

      return Result.Ok({ id: adjustment.id.value });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
