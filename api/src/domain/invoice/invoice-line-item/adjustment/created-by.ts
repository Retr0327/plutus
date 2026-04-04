import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

type CreatedByProps = {
  value: string;
};

export class CreatedBy extends ValueObject<CreatedByProps> {
  constructor(value: string) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  static from(value: string) {
    return new CreatedBy(value);
  }

  static create(value: string) {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return Result.Err(new Error('Created by cannot be empty'));
    }
    return Result.Ok(new CreatedBy(trimmed));
  }
}
