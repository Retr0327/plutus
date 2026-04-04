import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

type ChangedByProps = {
  value: string;
};

export class ChangedBy extends ValueObject<ChangedByProps> {
  constructor(value: string) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  static from(value: string) {
    return new ChangedBy(value);
  }

  static create(value: string) {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return Result.Err(new Error('Changed by cannot be empty'));
    }
    return Result.Ok(new ChangedBy(trimmed));
  }
}
