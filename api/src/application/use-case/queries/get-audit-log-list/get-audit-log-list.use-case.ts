import { Inject, InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AuditLogMapper } from '@plutus/infrastructure/mappers/audit-log.mapper';
import {
  AuditLogDomain,
  AuditLogDomainRepository,
} from '@plutus/infrastructure/repository/audit-log.repository';
import { Result } from '@common/result';
import { GetAuditLogListQuery } from './get-audit-log-list.input';
import { GetAuditLogListOutput } from './get-audit-log-list.output';

@QueryHandler(GetAuditLogListQuery)
export class GetAuditLogListUseCase implements IQueryHandler<
  GetAuditLogListQuery,
  GetAuditLogListOutput
> {
  constructor(
    @Inject(AuditLogDomain.Repository)
    private readonly auditLogRepository: AuditLogDomainRepository,
  ) {}

  async execute(query: GetAuditLogListQuery) {
    try {
      const { items, totalItems } = await this.auditLogRepository.findAll({
        entityType: query.entityType,
        entityId: query.entityId,
        page: query.page,
        limit: query.limit,
      });

      return Result.Ok({
        items: items.map((al) => AuditLogMapper.toDto(al)),
        meta: {
          page: query.page,
          limit: query.limit,
          totalItems,
          totalPages: Math.ceil(totalItems / query.limit),
        },
      });
    } catch (error) {
      return Result.Err(new InternalServerErrorException(error));
    }
  }
}
