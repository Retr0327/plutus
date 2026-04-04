import { HttpException } from '@nestjs/common';
import { AuditLogMapper } from '@plutus/infrastructure/mappers/audit-log.mapper';
import { Result } from '@common/result';

export type AuditLogListPaginationMeta = {
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly totalPages: number;
};

export type GetAuditLogListOutput = Result<
  {
    items: ReturnType<(typeof AuditLogMapper)['toDto']>[];
    meta: AuditLogListPaginationMeta;
  },
  HttpException
>;
