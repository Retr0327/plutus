import { Command } from '@nestjs/cqrs';
import { ArchiveInvoiceOutput } from './archive-invoice.output';

type Input = {
  id: string;
};

export class ArchiveInvoiceCommand extends Command<ArchiveInvoiceOutput> {
  readonly id: string;

  constructor(input: Input) {
    super();
    this.id = input.id;
  }
}
