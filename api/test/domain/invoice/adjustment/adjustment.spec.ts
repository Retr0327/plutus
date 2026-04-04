import { Adjustment } from '@plutus/domain/invoice/invoice-line-item/adjustment/adjustment';
import { makeAdjustment } from '../../../factories';

describe('Adjustment entity', () => {
  describe('from()', () => {
    it('should reconstruct an adjustment from props', () => {
      const adj = makeAdjustment();
      expect(adj.id.value).toBe('wdwxw0d22nqhp8elur10gzoc');
      expect(adj.amount.value).toBe(-1218.75);
      expect(adj.reason.value).toBe('Under-delivery credit');
      expect(adj.createdBy.value).toBe('jane.doe@agency.com');
    });
  });

  describe('create()', () => {
    it('should create a new adjustment', () => {
      const result = Adjustment.create({
        invoiceLineItemId: 'nzjs4zd7e7edepopyzhla2ut',
        amount: -500,
        reason: 'Test reason',
        createdBy: 'test@test.com',
      });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const adjustment = result.value as Adjustment;
        expect(adjustment.amount.value).toBe(-500);
        expect(adjustment.reason.value).toBe('Test reason');
      }
    });
  });

  describe('updateAmount()', () => {
    it('should update the amount', () => {
      const adj = makeAdjustment();
      const result = adj.updateAmount(-2000);
      expect(result.isOk()).toBe(true);
      expect(adj.amount.value).toBe(-2000);
    });

    it('should update updatedAt timestamp', () => {
      const adj = makeAdjustment();
      const before = adj.updatedAt.value;
      adj.updateAmount(-2000);
      expect(adj.updatedAt.value).toBeGreaterThanOrEqual(before);
    });
  });

  describe('updateReason()', () => {
    it('should update the reason', () => {
      const adj = makeAdjustment();
      const result = adj.updateReason('New reason');
      expect(result.isOk()).toBe(true);
      expect(adj.reason.value).toBe('New reason');
    });

    it('should update updatedAt timestamp', () => {
      const adj = makeAdjustment();
      const before = adj.updatedAt.value;
      adj.updateReason('New reason');
      expect(adj.updatedAt.value).toBeGreaterThanOrEqual(before);
    });
  });

  describe('equals()', () => {
    it('should return true for same id', () => {
      const a = makeAdjustment();
      const b = makeAdjustment();
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for different id', () => {
      const a = makeAdjustment();
      const b = makeAdjustment({ id: 'abc12345678901234567890a' });
      expect(a.equals(b)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(makeAdjustment().equals(undefined)).toBe(false);
    });
  });
});
