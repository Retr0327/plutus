import { Command } from '@nestjs/cqrs';
import { CreateAdjustmentOutput } from './create-adjustment.output';

type Input = {
  invoiceId: string;
  lineItemId: string;
  amount: number;
  reason: string;
  createdBy: string;
};

export class CreateAdjustmentCommand extends Command<CreateAdjustmentOutput> {
  readonly invoiceId: string;
  readonly lineItemId: string;
  readonly amount: number;
  readonly reason: string;
  readonly createdBy: string;

  constructor(input: Input) {
    super();
    this.invoiceId = input.invoiceId;
    this.lineItemId = input.lineItemId;
    this.amount = input.amount;
    this.reason = input.reason;
    this.createdBy = input.createdBy;
  }
}
