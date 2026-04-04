import { HttpException } from '@nestjs/common';
import { AuditLogMapper } from '@plutus/infrastructure/mappers/audit-log.mapper';
import { Result } from '@common/result';

export type GetAdjustmentHistoryOutput = Result<
  { items: ReturnType<(typeof AuditLogMapper)['toDto']>[] },
  HttpException
>;
