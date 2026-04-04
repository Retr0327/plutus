import { Query } from '@nestjs/cqrs';
import { GetInvoiceListOutput } from './get-invoice-list.output';

type Input = {
  page?: number;
  limit?: number;
  status?: string;
  campaignId?: string;
  includeArchived?: boolean;
};

export class GetInvoiceListQuery extends Query<GetInvoiceListOutput> {
  readonly page: number;
  readonly limit: number;
  readonly status?: string;
  readonly campaignId?: string;
  readonly includeArchived: boolean;

  constructor(input?: Input) {
    super();
    this.page = input?.page ?? 1;
    this.limit = input?.limit ?? 10;
    this.status = input?.status;
    this.campaignId = input?.campaignId;
    this.includeArchived = input?.includeArchived ?? false;
  }
}
