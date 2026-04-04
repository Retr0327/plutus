import { EntityId as _EntityId } from '@common/domain/common/entity-id';
import { Result } from '@common/result';

export class EntityId extends _EntityId<string> {
  static from(id: string) {
    return new EntityId(id);
  }

  static create(id: string | number) {
    return Result.Ok(new EntityId(id.toString()));
  }
}
