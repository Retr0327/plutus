import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';
import { AuditLogAction } from '@modules/postgres/enum';

type ActionProps = {
  value: AuditLogAction;
};

export class Action extends ValueObject<ActionProps> {
  constructor(value: AuditLogAction) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  static from(action: AuditLogAction) {
    return new Action(action);
  }

  static create(action: AuditLogAction) {
    if (!Object.values(AuditLogAction).includes(action)) {
      return Result.Err(new Error(`Invalid audit log action: ${action}`));
    }
    return Result.Ok(new Action(action));
  }
}
