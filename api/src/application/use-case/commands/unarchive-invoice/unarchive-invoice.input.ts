import { Command } from '@nestjs/cqrs';
import { UnarchiveInvoiceOutput } from './unarchive-invoice.output';

type Input = {
  id: string;
};

export class UnarchiveInvoiceCommand extends Command<UnarchiveInvoiceOutput> {
  readonly id: string;

  constructor(input: Input) {
    super();
    this.id = input.id;
  }
}
