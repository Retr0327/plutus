import { Query } from '@nestjs/cqrs';
import { GetInvoiceOutput } from './get-invoice.output';

type Input = { id: number } | { campaignId: number };

export class GetInvoiceQuery extends Query<GetInvoiceOutput> {
  readonly input: Input;

  constructor(input: Input) {
    super();
    this.input = input;
  }
}
