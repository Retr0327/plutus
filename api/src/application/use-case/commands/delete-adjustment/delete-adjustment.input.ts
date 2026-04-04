import { Command } from '@nestjs/cqrs';
import { DeleteAdjustmentOutput } from './delete-adjustment.output';

type Input = {
  invoiceId: string;
  lineItemId: string;
  adjustmentId: string;
  deletedBy: string;
};

export class DeleteAdjustmentCommand extends Command<DeleteAdjustmentOutput> {
  readonly invoiceId: string;
  readonly lineItemId: string;
  readonly adjustmentId: string;
  readonly deletedBy: string;

  constructor(input: Input) {
    super();
    this.invoiceId = input.invoiceId;
    this.lineItemId = input.lineItemId;
    this.adjustmentId = input.adjustmentId;
    this.deletedBy = input.deletedBy;
  }
}
