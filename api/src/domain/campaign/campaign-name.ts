import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

type CampaignNameProps = {
  value: string;
};

export class CampaignName extends ValueObject<CampaignNameProps> {
  constructor(value: string) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  static from(name: string) {
    return new CampaignName(name);
  }

  static create(name: string) {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      return Result.Err(new Error('Campaign name cannot be empty'));
    }
    return Result.Ok(new CampaignName(name.trim()));
  }
}
