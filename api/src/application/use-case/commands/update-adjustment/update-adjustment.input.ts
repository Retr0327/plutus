import { Command } from '@nestjs/cqrs';
import { UpdateAdjustmentOutput } from './update-adjustment.output';

type Input = {
  invoiceId: number;
  lineItemId: number;
  adjustmentId: number;
  amount?: number;
  reason?: string;
  updatedBy: string;
};

export class UpdateAdjustmentCommand extends Command<UpdateAdjustmentOutput> {
  readonly invoiceId: number;
  readonly lineItemId: number;
  readonly adjustmentId: number;
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
