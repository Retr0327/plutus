import { Query } from '@nestjs/cqrs';
import { GetAdjustmentHistoryOutput } from './get-adjustment-history.output';

type Input = {
  invoiceId: number;
  lineItemId: number;
  adjustmentId: number;
};

export class GetAdjustmentHistoryQuery extends Query<GetAdjustmentHistoryOutput> {
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
