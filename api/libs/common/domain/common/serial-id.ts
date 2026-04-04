import { EntityId } from '@common/domain/common/entity-id';
import { Result } from '@common/result';

export class SerialId extends EntityId<number> {
  isFirstCreated() {
    return this.props.value === -1;
  }

  static from(id: number) {
    return new SerialId(id);
  }

  static create(id?: number) {
    return Result.Ok(new SerialId(id || -1));
  }
}
