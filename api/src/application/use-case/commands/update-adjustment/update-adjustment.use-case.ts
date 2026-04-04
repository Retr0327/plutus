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
import { UpdateAdjustmentCommand } from './update-adjustment.input';
import { UpdateAdjustmentOutput } from './update-adjustment.output';

@CommandHandler(UpdateAdjustmentCommand)
export class UpdateAdjustmentUseCase implements ICommandHandler<
  UpdateAdjustmentCommand,
  UpdateAdjustmentOutput
> {
  constructor(
    @Inject(InvoiceDomain.Repository)
    private readonly invoiceRepository: InvoiceDomainRepository,
    @Inject(AuditLogDomain.Repository)
    private readonly auditLogRepository: AuditLogDomainRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: UpdateAdjustmentCommand) {
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

      const adjustment = lineItem.adjustments.find(
        (adj) => adj.id.value === command.adjustmentId,
      );
      if (!adjustment) {
        return Result.Err(new NotFoundException('Adjustment not found'));
      }

      const oldSnapshot = {
        amount: adjustment.amount.value,
        reason: adjustment.reason.value,
      };

      if (command.amount !== undefined) {
        const updateResult = adjustment.updateAmount(command.amount);
        if (updateResult.isErr()) {
          return Result.Err(
            new BadRequestException(updateResult.error.message),
          );
        }
      }

      if (command.reason !== undefined) {
        const updateResult = adjustment.updateReason(command.reason);
        if (updateResult.isErr()) {
          return Result.Err(
            new BadRequestException(updateResult.error.message),
          );
        }
      }

      // Mark the line item as modified so the collection tracks the change
      lineItem.adjustments.update(adjustment);
      invoice.lineItems.update(lineItem);

      const newSnapshot = {
        amount: adjustment.amount.value,
        reason: adjustment.reason.value,
      };

      const auditLogResult = AuditLog.create({
        entityType: AuditLogEntity.Adjustment,
        entityId: adjustment.id.value,
        action: AuditLogAction.Update,
        changedBy: command.updatedBy,
        oldValue: oldSnapshot,
        newValue: newSnapshot,
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
