import { EntityId } from '@common/domain/common/entity-id';
import { Result } from '@common/result';
import { createId } from '@paralleldrive/cuid2';

export class Cuid extends EntityId<string> {
  static from(id: string) {
    return new Cuid(id);
  }

  static create(id?: string) {
    const value = id !== undefined ? id : createId();
    return Result.Ok(new Cuid(value));
  }
}
