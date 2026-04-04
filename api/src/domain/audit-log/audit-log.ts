import { CreatedAt } from '@common/domain/common/timestamp';
import { AggregateRoot } from '@common/domain/core/aggregate-root';
import { Result } from '@common/result';
import { AuditLogAction, AuditLogEntity } from '@modules/postgres/enum';
import { Action } from './action';
import { AuditLogId } from './audit-log-id';
import { ChangedBy } from './changed-by';
import { EntityId } from './entity-id';
import { EntityType } from './entity-type';
import { FieldChange } from './field-change';

export interface AuditLogProps {
  id: number;
  entityType: AuditLogEntity;
  entityId: string;
  action: AuditLogAction;
  changedBy: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  createdAt: number;
}

export interface CreateAuditLogProps {
  entityType: AuditLogEntity;
  entityId: string | number;
  action: AuditLogAction;
  changedBy: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
}

export interface AuditLogAggregateRootProps {
  entityType: EntityType;
  entityId: EntityId;
  action: Action;
  changedBy: ChangedBy;
  fieldChange: FieldChange;
  createdAt: CreatedAt;
}

export class AuditLog extends AggregateRoot<
  AuditLogId,
  AuditLogAggregateRootProps
> {
  get entityType() {
    return this.props.entityType;
  }

  get entityId() {
    return this.props.entityId;
  }

  get action() {
    return this.props.action;
  }

  get changedBy() {
    return this.props.changedBy;
  }

  get fieldChange() {
    return this.props.fieldChange;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  equals(other?: AuditLog) {
    if (!other) {
      return false;
    }
    return this.id.equals(other.id);
  }

  static from(props: AuditLogProps) {
    const id = AuditLogId.from(props.id);
    const entityType = EntityType.from(props.entityType);
    const entityId = EntityId.from(props.entityId);
    const action = Action.from(props.action);
    const changedBy = ChangedBy.from(props.changedBy);
    const fieldChange = FieldChange.from({
      oldValue: props.oldValue,
      newValue: props.newValue,
    });
    const createdAt = CreatedAt.from(props.createdAt);

    return new AuditLog(id, {
      entityType,
      entityId,
      action,
      changedBy,
      fieldChange,
      createdAt,
    });
  }

  static create(props: CreateAuditLogProps) {
    const idResult = AuditLogId.create();
    if (idResult.isErr()) {
      return idResult;
    }

    const entityTypeResult = EntityType.create(props.entityType);
    if (entityTypeResult.isErr()) {
      return entityTypeResult;
    }

    const entityIdResult = EntityId.create(props.entityId);
    if (entityIdResult.isErr()) {
      return entityIdResult;
    }

    const actionResult = Action.create(props.action);
    if (actionResult.isErr()) {
      return actionResult;
    }

    const changedByResult = ChangedBy.create(props.changedBy);
    if (changedByResult.isErr()) {
      return changedByResult;
    }

    const fieldChangeResult = FieldChange.create({
      oldValue: props.oldValue,
      newValue: props.newValue,
    });
    if (fieldChangeResult.isErr()) {
      return fieldChangeResult;
    }

    const createdAt = CreatedAt.create();

    return Result.Ok(
      new AuditLog(idResult.value, {
        entityType: entityTypeResult.value,
        entityId: entityIdResult.value,
        action: actionResult.value,
        changedBy: changedByResult.value,
        fieldChange: fieldChangeResult.value,
        createdAt: createdAt.value,
      }),
    );
  }
}
