import { AuditLog } from '@plutus/domain/audit-log/audit-log';
import { AuditLog as AuditLogPO } from '@modules/postgres/entities/audit-log.entity';
import { AuditLogAction, AuditLogEntity } from '@modules/postgres/enum';

export class AuditLogMapper {
  static toDomain(po: AuditLogPO) {
    return AuditLog.from({
      id: po.id,
      entityType: po.entityType as AuditLogEntity,
      entityId: po.entityId,
      action: (po.action as AuditLogAction) ?? AuditLogAction.Update,
      changedBy: po.changedBy ?? 'system',
      oldValue: po.oldValue ?? undefined,
      newValue: po.newValue ?? undefined,
      createdAt: Number(po.createdAt),
    });
  }

  static toPersistence(auditLog: AuditLog) {
    const po: Partial<AuditLogPO> = {
      entityType: auditLog.entityType.value,
      entityId: auditLog.entityId.value,
      action: auditLog.action.value,
      changedBy: auditLog.changedBy.value,
      oldValue: auditLog.fieldChange.oldValue ?? null,
      newValue: auditLog.fieldChange.newValue ?? null,
      createdAt: Date.now(),
    };
    if (!auditLog.id.isFirstCreated()) {
      po.id = auditLog.id.value;
    }
    return po;
  }

  static toDto(auditLog: AuditLog) {
    return {
      id: auditLog.id.value,
      entityType: auditLog.entityType.value,
      entityId: auditLog.entityId.value,
      action: auditLog.action.value,
      changedBy: auditLog.changedBy.value,
      oldValue: auditLog.fieldChange.oldValue ?? null,
      newValue: auditLog.fieldChange.newValue ?? null,
      createdAt: auditLog.createdAt.value,
    };
  }
}
