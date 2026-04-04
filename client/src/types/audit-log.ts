export interface AuditLogEntry {
  id: number;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  changedBy: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: number;
}
