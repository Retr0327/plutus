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
import { ArchiveInvoiceCommand } from './archive-invoice.input';
import { ArchiveInvoiceOutput } from './archive-invoice.output';

@CommandHandler(ArchiveInvoiceCommand)
export class ArchiveInvoiceUseCase implements ICommandHandler<
  ArchiveInvoiceCommand,
  ArchiveInvoiceOutput
> {
  constructor(
    @Inject(InvoiceDomain.Repository)
    private readonly invoiceRepository: InvoiceDomainRepository,
  ) {}

  async execute(command: ArchiveInvoiceCommand) {
    try {
      const invoice = await this.invoiceRepository.findById(command.id);
      if (!invoice) {
        return Result.Err(new NotFoundException('Invoice not found'));
      }

      const archiveResult = invoice.archive();
      if (archiveResult.isErr()) {
        return Result.Err(new ConflictException(archiveResult.error.message));
      }

      await this.invoiceRepository.save(invoice);

      return Result.Ok({ id: invoice.id.value });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
