import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAuditLogListQuery } from '@plutus/application/use-case/queries/get-audit-log-list/get-audit-log-list.input';
import { AuditLogListQueryDto } from './audit-log.dto';
import { GetAuditLogsPresenter } from './audit-log.presenter';

@Controller('audit-logs')
export class AuditLogController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly getAuditLogsPresenter: GetAuditLogsPresenter,
  ) {}

  @Get()
  async findAll(@Query() query: AuditLogListQueryDto) {
    const result = await this.queryBus.execute(
      new GetAuditLogListQuery({
        entityType: query.entityType,
        entityId: query.entityId,
        page: query.page,
        limit: query.limit,
      }),
    );
    if (result.isErr()) {
      throw result.error;
    }
    return this.getAuditLogsPresenter.present(result.value);
  }
}
