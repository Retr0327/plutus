import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

type CampaignLineItemNameProps = {
  value: string;
};

export class CampaignLineItemName extends ValueObject<CampaignLineItemNameProps> {
  constructor(value: string) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  static from(name: string) {
    return new CampaignLineItemName(name);
  }

  static create(name: string) {
    const trimmed = name.trim();
    if (trimmed.trim().length === 0) {
      return Result.Err(new Error('Line item name cannot be empty'));
    }
    return Result.Ok(new CampaignLineItemName(trimmed));
  }
}
