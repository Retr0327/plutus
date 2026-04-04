import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';
import { AuditLogEntity } from '@modules/postgres/enum';

export type EntityTypeProps = {
  value: AuditLogEntity;
};

export class EntityType extends ValueObject<EntityTypeProps> {
  constructor(value: AuditLogEntity) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  static from(type: AuditLogEntity) {
    return new EntityType(type);
  }

  static create(type: AuditLogEntity) {
    if (!Object.values(AuditLogEntity).includes(type as AuditLogEntity)) {
      return Result.Err(new Error(`Invalid audit entity type: ${type}`));
    }
    return Result.Ok(new EntityType(type as AuditLogEntity));
  }
}
