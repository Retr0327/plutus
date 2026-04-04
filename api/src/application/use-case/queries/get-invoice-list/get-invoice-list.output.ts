import { HttpException } from '@nestjs/common';
import { Result } from '@common/result';

export type InvoiceListItemDto = {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly status: string;
  readonly campaignId: string;
  readonly campaignName: string;
  readonly totalActualAmount: number;
  readonly totalAdjustments: number;
  readonly totalBillableAmount: number;
  readonly lineItemCount: number;
  readonly archivedAt: number | null;
};

export type PaginationMeta = {
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly totalPages: number;
};

export type GetInvoiceListOutput = Result<
  {
    items: InvoiceListItemDto[];
    meta: PaginationMeta;
  },
  HttpException
>;
