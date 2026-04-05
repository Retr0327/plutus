import { Invoice } from '@plutus/domain/invoice/invoice';
import { makeInvoice } from '../../factories';

describe('Invoice aggregate', () => {
  describe('from()', () => {
    it('should reconstruct an invoice from props', () => {
      const invoice = makeInvoice();
      expect(invoice.id.value).toBe(1);
      expect(invoice.invoiceNumber.value).toBe('INV-2026-001');
      expect(invoice.isDraft()).toBe(true);
      expect(invoice.isArchived).toBe(false);
    });
  });

  describe('create()', () => {
    it('should create a new draft invoice', () => {
      const result = Invoice.create({
        campaignId: 1,
        invoiceNumber: 'INV-2026-003',
      });
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const invoice = result.value as Invoice;
        expect(invoice.isDraft()).toBe(true);
        expect(invoice.isArchived).toBe(false);
      }
    });
  });

  describe('archive()', () => {
    it('should archive a non-archived invoice', () => {
      const invoice = makeInvoice();
      const result = invoice.archive();
      expect(result.isOk()).toBe(true);
      expect(invoice.isArchived).toBe(true);
      expect(invoice.archivedAt).not.toBeNull();
    });

    it('should fail if already archived', () => {
      const invoice = makeInvoice({ archivedAt: 1711720000000 });
      const result = invoice.archive();
      expect(result.isErr()).toBe(true);
    });
  });

  describe('unarchive()', () => {
    it('should unarchive an archived invoice', () => {
      const invoice = makeInvoice({ archivedAt: 1711720000000 });
      const result = invoice.unarchive();
      expect(result.isOk()).toBe(true);
      expect(invoice.isArchived).toBe(false);
      expect(invoice.archivedAt).toBeNull();
    });

    it('should fail if not archived', () => {
      const invoice = makeInvoice();
      const result = invoice.unarchive();
      expect(result.isErr()).toBe(true);
    });
  });

  describe('finalize()', () => {
    it('should finalize a draft invoice', () => {
      const invoice = makeInvoice();
      const result = invoice.finalize();
      expect(result.isOk()).toBe(true);
      expect(invoice.isFinalized()).toBe(true);
    });

    it('should fail if already finalized', () => {
      const invoice = makeInvoice({ status: 'finalized' });
      const result = invoice.finalize();
      expect(result.isErr()).toBe(true);
    });
  });

  describe('equals()', () => {
    it('should return true for same id', () => {
      const a = makeInvoice();
      const b = makeInvoice();
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for undefined', () => {
      expect(makeInvoice().equals(undefined)).toBe(false);
    });
  });
});
