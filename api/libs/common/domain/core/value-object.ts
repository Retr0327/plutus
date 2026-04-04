import { isDeepEqual } from '@common/domain/util/deep-equal';

export abstract class ValueObject<T extends Record<string, unknown>> {
  public readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  equals(vo: ValueObject<any>) {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (!(vo instanceof this.constructor)) {
      return false;
    }
    return isDeepEqual(vo.props, this.props);
  }
}
