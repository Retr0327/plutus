import { Query } from '@nestjs/cqrs';
import { GetAdjustmentOutput } from './get-adjustment.output';

type Input = {
  invoiceId: string;
  lineItemId: string;
  adjustmentId: string;
};

export class GetAdjustmentQuery extends Query<GetAdjustmentOutput> {
  readonly invoiceId: string;
  readonly lineItemId: string;
  readonly adjustmentId: string;

  constructor(input: Input) {
    super();
    this.invoiceId = input.invoiceId;
    this.lineItemId = input.lineItemId;
    this.adjustmentId = input.adjustmentId;
  }
}
