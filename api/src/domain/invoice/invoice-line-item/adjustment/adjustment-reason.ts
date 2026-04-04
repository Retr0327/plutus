import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

type AdjustmentReasonProps = {
  value: string;
};

export class AdjustmentReason extends ValueObject<AdjustmentReasonProps> {
  constructor(value: string) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  static from(reason: string) {
    return new AdjustmentReason(reason);
  }

  static create(reason: string) {
    const trimmed = reason.trim();
    if (trimmed.length === 0) {
      return Result.Err(new Error('Adjustment reason cannot be empty'));
    }
    return Result.Ok(new AdjustmentReason(trimmed));
  }
}
