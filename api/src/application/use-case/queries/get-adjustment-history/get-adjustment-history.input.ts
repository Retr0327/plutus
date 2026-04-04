import { Query } from '@nestjs/cqrs';
import { GetAdjustmentHistoryOutput } from './get-adjustment-history.output';

type Input = {
  invoiceId: string;
  lineItemId: string;
  adjustmentId: string;
};

export class GetAdjustmentHistoryQuery extends Query<GetAdjustmentHistoryOutput> {
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
