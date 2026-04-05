import { Query } from '@nestjs/cqrs';
import { GetAdjustmentOutput } from './get-adjustment.output';

type Input = {
  invoiceId: number;
  lineItemId: number;
  adjustmentId: number;
};

export class GetAdjustmentQuery extends Query<GetAdjustmentOutput> {
  readonly invoiceId: number;
  readonly lineItemId: number;
  readonly adjustmentId: number;

  constructor(input: Input) {
    super();
    this.invoiceId = input.invoiceId;
    this.lineItemId = input.lineItemId;
    this.adjustmentId = input.adjustmentId;
  }
}
