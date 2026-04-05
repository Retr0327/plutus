import { Command } from '@nestjs/cqrs';
import { ArchiveInvoiceOutput } from './archive-invoice.output';

type Input = {
  id: number;
};

export class ArchiveInvoiceCommand extends Command<ArchiveInvoiceOutput> {
  readonly id: number;

  constructor(input: Input) {
    super();
    this.id = input.id;
  }
}
