import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

type MoneyProps = {
  value: number;
};

export class Money extends ValueObject<MoneyProps> {
  constructor(value: number) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  add(other: Money) {
    return Money.from(this.value + other.value);
  }

  subtract(other: Money) {
    return Money.from(this.value - other.value);
  }

  isNegative() {
    return this.value < 0;
  }

  isZero() {
    return this.value === 0;
  }

  static from(amount: number) {
    return new Money(amount);
  }

  static create(amount: number) {
    if (!Number.isFinite(amount)) {
      return Result.Err(new Error('Amount must be a finite number'));
    }
    return Result.Ok(new Money(amount));
  }
}
