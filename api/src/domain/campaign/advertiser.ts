import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

type AdvertiserProps = {
  value: string;
};

export class Advertiser extends ValueObject<AdvertiserProps> {
  constructor(value: string) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  static from(name: string) {
    return new Advertiser(name);
  }

  static create(name: string) {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      return Result.Err(new Error('Advertiser name cannot be empty'));
    }
    return Result.Ok(new Advertiser(trimmed));
  }
}
