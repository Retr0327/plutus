import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

function toUnixTimestamp(data: string | number) {
  if (typeof data === 'number') {
    return data;
  }
  const parsedNumber = Number(data);
  if (!isNaN(parsedNumber)) {
    return parsedNumber;
  }
  return Math.floor(Date.parse(data) / 1000);
}

export type TimestampProps = {
  value: number;
};

export class Timestamp extends ValueObject<TimestampProps> {
  constructor(value: number) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  isFirstCreated() {
    return this.props.value === 0;
  }

  equals(vo: ValueObject<any>) {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (!(vo instanceof Timestamp)) {
      return false;
    }
    return vo.value === this.value;
  }

  static from(value: number | string) {
    const timestamp = toUnixTimestamp(value);
    return new Timestamp(timestamp);
  }

  static create(value?: number | string | null) {
    const timestamp = value ? toUnixTimestamp(value) : undefined;
    return Result.Ok(new Timestamp(timestamp || 0));
  }
}

export class UpdatedAt extends Timestamp {}

export class CreatedAt extends Timestamp {}

export class DeletedAt extends Timestamp {}
//
