import { ValueObject } from '@common/domain/core/value-object';

type EntityIdProps<T> = {
  value: T;
};

export abstract class EntityId<T> extends ValueObject<EntityIdProps<T>> {
  constructor(value: T) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }
}
