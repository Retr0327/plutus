import {
  ConflictException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  InvoiceDomain,
  InvoiceDomainRepository,
} from '@plutus/infrastructure/repository/invoice.repository';
import { Result } from '@common/result';
import { UnarchiveInvoiceCommand } from './unarchive-invoice.input';
import { UnarchiveInvoiceOutput } from './unarchive-invoice.output';

@CommandHandler(UnarchiveInvoiceCommand)
export class UnarchiveInvoiceUseCase implements ICommandHandler<
  UnarchiveInvoiceCommand,
  UnarchiveInvoiceOutput
> {
  constructor(
    @Inject(InvoiceDomain.Repository)
    private readonly invoiceRepository: InvoiceDomainRepository,
  ) {}

  async execute(command: UnarchiveInvoiceCommand) {
    try {
      const invoice = await this.invoiceRepository.findById(command.id);
      if (!invoice) {
        return Result.Err(new NotFoundException('Invoice not found'));
      }

      const unarchiveResult = invoice.unarchive();
      if (unarchiveResult.isErr()) {
        return Result.Err(new ConflictException(unarchiveResult.error.message));
      }

      await this.invoiceRepository.save(invoice);

      return Result.Ok({ id: invoice.id.value });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
