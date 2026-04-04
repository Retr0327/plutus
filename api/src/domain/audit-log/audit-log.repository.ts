import { AuditLog } from './audit-log';

export interface AuditLogQueryOptions {
  entityType?: string;
  entityId?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogListResult {
  items: AuditLog[];
  totalItems: number;
}

export interface AbstractAuditLogDomainRepository {
  findByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
  findAll(options?: AuditLogQueryOptions): Promise<AuditLogListResult>;
  save(auditLog: AuditLog): Promise<void>;
}
