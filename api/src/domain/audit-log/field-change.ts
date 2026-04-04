import { ValueObject } from '@common/domain/core/value-object';
import { Result } from '@common/result';

export type FieldChangeVOProps = {
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
};

export type FieldChangeProps = FieldChangeVOProps;

export class FieldChange extends ValueObject<FieldChangeVOProps> {
  get oldValue() {
    return this.props.oldValue;
  }

  get newValue() {
    return this.props.newValue;
  }

  static from(props: FieldChangeProps) {
    const { oldValue, newValue } = props;
    return new FieldChange({ oldValue, newValue });
  }

  static create(props: FieldChangeProps) {
    const { oldValue, newValue } = props;
    return Result.Ok(new FieldChange({ oldValue, newValue }));
  }
}
