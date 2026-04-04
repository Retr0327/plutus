import type { AdjustmentProps } from '@plutus/domain/invoice/invoice-line-item/adjustment/adjustment';
import { Adjustment } from '@plutus/domain/invoice/invoice-line-item/adjustment/adjustment';

const ADJUSTMENT_DEFAULTS: AdjustmentProps = {
  id: 'wdwxw0d22nqhp8elur10gzoc',
  invoiceLineItemId: 'nzjs4zd7e7edepopyzhla2ut',
  amount: -1218.75,
  reason: 'Under-delivery credit',
  createdBy: 'jane.doe@agency.com',
  createdAt: 1711720000000,
  updatedAt: 1711720000000,
};

export function makeAdjustment(overrides: Partial<AdjustmentProps> = {}) {
  return Adjustment.from({ ...ADJUSTMENT_DEFAULTS, ...overrides });
}
