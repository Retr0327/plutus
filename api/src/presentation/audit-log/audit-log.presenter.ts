import { Injectable } from '@nestjs/common';
import { AuditLogListPaginationMeta } from '@plutus/application/use-case/queries/get-audit-log-list/get-audit-log-list.output';
import { AuditLogMapper } from '@plutus/infrastructure/mappers/audit-log.mapper';
import { Presenter } from '@common/domain/interfaces/presenter';

export type GetAuditLogsPresenterInput = {
  readonly items: ReturnType<(typeof AuditLogMapper)['toDto']>[];
  readonly meta: AuditLogListPaginationMeta;
};

export type GetAuditLogsPresenterOutput = GetAuditLogsPresenterInput;

@Injectable()
export class GetAuditLogsPresenter implements Presenter<
  GetAuditLogsPresenterInput,
  GetAuditLogsPresenterOutput
> {
  present(input: GetAuditLogsPresenterInput) {
    return { items: input.items, meta: input.meta };
  }
}
