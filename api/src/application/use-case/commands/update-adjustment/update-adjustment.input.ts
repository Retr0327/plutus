import { Command } from '@nestjs/cqrs';
import { UpdateAdjustmentOutput } from './update-adjustment.output';

type Input = {
  invoiceId: string;
  lineItemId: string;
  adjustmentId: string;
  amount?: number;
  reason?: string;
  updatedBy: string;
};

export class UpdateAdjustmentCommand extends Command<UpdateAdjustmentOutput> {
  readonly invoiceId: string;
  readonly lineItemId: string;
  readonly adjustmentId: string;
  readonly amount?: number;
  readonly reason?: string;
  readonly updatedBy: string;

  constructor(input: Input) {
    super();
    this.invoiceId = input.invoiceId;
    this.lineItemId = input.lineItemId;
    this.adjustmentId = input.adjustmentId;
    this.amount = input.amount;
    this.reason = input.reason;
    this.updatedBy = input.updatedBy;
  }
}
