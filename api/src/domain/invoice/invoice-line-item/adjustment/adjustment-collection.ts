import Collection from '@common/domain/collection';
import { Adjustment } from './adjustment';

export class AdjustmentCollection extends Collection<Adjustment> {
  isSameItem(a: Adjustment, b: Adjustment) {
    return a.equals(b);
  }
}
