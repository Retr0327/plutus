import { GetAdjustmentHistoryQuery } from '@plutus/application/use-case/queries/get-adjustment-history/get-adjustment-history.input';
import { GetAdjustmentHistoryUseCase } from '@plutus/application/use-case/queries/get-adjustment-history/get-adjustment-history.use-case';
import {
  makeInvoice,
  makeMockAuditLogRepository,
  makeMockInvoiceRepository,
} from '../../factories';
import { makeAdjustment } from '../../factories/adjustment.factory';
import { makeAuditLog } from '../../factories/audit-log.factory';
import { makeLineItem } from '../../factories/invoice.factory';

const INVOICE_ID = 1;
const LINE_ITEM_ID = 10;
const ADJUSTMENT_ID = 1;

function makeInvoiceWithAdjustment() {
  const adjustment = makeAdjustment();
  const lineItem = makeLineItem({ adjustments: [adjustment] });
  return makeInvoice({ lineItems: [lineItem] });
}

describe('GetAdjustmentHistoryUseCase', () => {
  let useCase: GetAdjustmentHistoryUseCase;
  let invoiceRepo: ReturnType<typeof makeMockInvoiceRepository>;
  let auditLogRepo: ReturnType<typeof makeMockAuditLogRepository>;

  beforeEach(() => {
    invoiceRepo = makeMockInvoiceRepository();
    auditLogRepo = makeMockAuditLogRepository();
    useCase = new GetAdjustmentHistoryUseCase(
      invoiceRepo as any,
      auditLogRepo as any,
    );
  });

  it('should return audit log history for an adjustment', async () => {
    const invoice = makeInvoiceWithAdjustment();
    invoiceRepo.findById.mockResolvedValue(invoice);
    auditLogRepo.findByEntity.mockResolvedValue([makeAuditLog()]);

    const result = await useCase.execute(
      new GetAdjustmentHistoryQuery({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: ADJUSTMENT_ID,
      }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.items).toHaveLength(1);
    }
  });

  it('should return 404 if invoice not found', async () => {
    invoiceRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(
      new GetAdjustmentHistoryQuery({
        invoiceId: 99999,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: ADJUSTMENT_ID,
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });

  it('should return 404 if line item not found', async () => {
    const invoice = makeInvoiceWithAdjustment();
    invoiceRepo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new GetAdjustmentHistoryQuery({
        invoiceId: INVOICE_ID,
        lineItemId: 99999,
        adjustmentId: ADJUSTMENT_ID,
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });

  it('should return 404 if adjustment not found', async () => {
    const invoice = makeInvoiceWithAdjustment();
    invoiceRepo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new GetAdjustmentHistoryQuery({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: 99999,
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });
});
