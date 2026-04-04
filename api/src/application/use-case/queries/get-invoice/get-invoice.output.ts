import { HttpException } from '@nestjs/common';
import { InvoiceMapper } from '@plutus/infrastructure/mappers/invoice.mapper';
import { Result } from '@common/result';

export type GetInvoiceOutput = Result<
  ReturnType<(typeof InvoiceMapper)['toDto']> | null,
  HttpException
>;
