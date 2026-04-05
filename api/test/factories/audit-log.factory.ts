import type { AuditLogProps } from '@plutus/domain/audit-log/audit-log';
import { AuditLog } from '@plutus/domain/audit-log/audit-log';
import { AuditLogAction, AuditLogEntity } from '@modules/postgres/enum';

const AUDIT_LOG_DEFAULTS: AuditLogProps = {
  id: 1,
  entityType: AuditLogEntity.Adjustment,
  entityId: '1',
  action: AuditLogAction.Create,
  changedBy: 'jane.doe@agency.com',
  oldValue: undefined,
  newValue: { amount: -1218.75, reason: 'Under-delivery credit' },
  createdAt: 1711720000000,
};

export function makeAuditLog(overrides: Partial<AuditLogProps> = {}) {
  return AuditLog.from({ ...AUDIT_LOG_DEFAULTS, ...overrides });
}
