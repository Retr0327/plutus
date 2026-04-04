import { HttpException } from '@nestjs/common';
import { Result } from '@common/result';

export type UnarchiveInvoiceOutput = Result<{ id: string }, HttpException>;
