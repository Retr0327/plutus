import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog as AuditLogAggregateRoot } from '@plutus/domain/audit-log/audit-log';
import {
  AbstractAuditLogDomainRepository,
  AuditLogListResult,
  AuditLogQueryOptions,
} from '@plutus/domain/audit-log/audit-log.repository';
import { AuditLogMapper } from '@plutus/infrastructure/mappers/audit-log.mapper';
import { AuditLog } from '@modules/postgres/entities';

export const enum AuditLogDomain {
  Repository = 'AuditLogDomainRepository',
}

@Injectable()
export class AuditLogDomainRepository implements AbstractAuditLogDomainRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<AuditLogAggregateRoot[]> {
    const auditLogs = await this.auditLogRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'ASC' },
    });
    return auditLogs.map((al) => AuditLogMapper.toDomain(al));
  }

  async findAll(options?: AuditLogQueryOptions): Promise<AuditLogListResult> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const where: FindOptionsWhere<AuditLog> = {};
    if (options?.entityType) {
      where.entityType = options.entityType;
    }
    if (options?.entityId) {
      where.entityId = options.entityId;
    }

    const [items, totalItems] = await this.auditLogRepository.findAndCount({
      where,
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map((al) => AuditLogMapper.toDomain(al)),
      totalItems,
    };
  }

  async save(auditLog: AuditLogAggregateRoot) {
    const po = AuditLogMapper.toPersistence(auditLog);
    await this.auditLogRepository.save(po);
  }

  async saveWithTx(auditLog: AuditLogAggregateRoot, tx: EntityManager) {
    const po = AuditLogMapper.toPersistence(auditLog);
    await tx.save(AuditLog, po);
  }
}
