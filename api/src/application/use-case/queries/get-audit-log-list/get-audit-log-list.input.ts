import { Query } from '@nestjs/cqrs';
import { GetAuditLogListOutput } from './get-audit-log-list.output';

type Input = {
  entityType?: string;
  entityId?: string;
  page?: number;
  limit?: number;
};

export class GetAuditLogListQuery extends Query<GetAuditLogListOutput> {
  readonly entityType?: string;
  readonly entityId?: string;
  readonly page: number;
  readonly limit: number;

  constructor(input?: Input) {
    super();
    this.entityType = input?.entityType;
    this.entityId = input?.entityId;
    this.page = input?.page ?? 1;
    this.limit = input?.limit ?? 20;
  }
}
