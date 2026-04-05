import { HttpException } from '@nestjs/common';
import { Result } from '@common/result';

export type ArchiveInvoiceOutput = Result<{ id: number }, HttpException>;
