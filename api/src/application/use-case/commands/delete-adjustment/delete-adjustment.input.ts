import { Command } from '@nestjs/cqrs';
import { DeleteAdjustmentOutput } from './delete-adjustment.output';

type Input = {
  invoiceId: number;
  lineItemId: number;
  adjustmentId: number;
  deletedBy: string;
};

export class DeleteAdjustmentCommand extends Command<DeleteAdjustmentOutput> {
  readonly invoiceId: number;
  readonly lineItemId: number;
  readonly adjustmentId: number;
  readonly deletedBy: string;

  constructor(input: Input) {
    super();
    this.invoiceId = input.invoiceId;
    this.lineItemId = input.lineItemId;
    this.adjustmentId = input.adjustmentId;
    this.deletedBy = input.deletedBy;
  }
}
