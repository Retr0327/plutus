import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';
import { InvoiceStatus as InvoiceStatusEnum } from '@modules/postgres/enum';

type InvoiceStatusProps = {
  value: InvoiceStatusEnum;
};

export class InvoiceStatus extends ValueObject<InvoiceStatusProps> {
  constructor(value: InvoiceStatusEnum) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }

  isDraft() {
    return this.value === InvoiceStatusEnum.Draft;
  }

  isFinalized() {
    return this.value === InvoiceStatusEnum.Finalized;
  }

  static from(status: string) {
    return new InvoiceStatus(status as InvoiceStatusEnum);
  }

  static create(status: InvoiceStatusEnum) {
    if (!Object.values(InvoiceStatusEnum).includes(status)) {
      return Result.Err(new Error(`Invalid invoice status: ${status}`));
    }
    return Result.Ok(new InvoiceStatus(status));
  }
}
