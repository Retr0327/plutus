import { Command } from '@nestjs/cqrs';
import { UnarchiveInvoiceOutput } from './unarchive-invoice.output';

type Input = {
  id: number;
};

export class UnarchiveInvoiceCommand extends Command<UnarchiveInvoiceOutput> {
  readonly id: number;

  constructor(input: Input) {
    super();
    this.id = input.id;
  }
}
