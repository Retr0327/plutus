import { DeleteAdjustmentCommand } from '@plutus/application/use-case/commands/delete-adjustment/delete-adjustment.input';
import { DeleteAdjustmentUseCase } from '@plutus/application/use-case/commands/delete-adjustment/delete-adjustment.use-case';
import {
  makeInvoice,
  makeMockAuditLogRepository,
  makeMockDataSource,
  makeMockInvoiceRepository,
} from '../../factories';
import { makeAdjustment } from '../../factories/adjustment.factory';
import { makeLineItem } from '../../factories/invoice.factory';

const INVOICE_ID = 1;
const LINE_ITEM_ID = 10;
const ADJUSTMENT_ID = 1;

function makeInvoiceWithAdjustment(status = 'draft') {
  const adjustment = makeAdjustment();
  const lineItem = makeLineItem({ adjustments: [adjustment] });
  return makeInvoice({ status, lineItems: [lineItem] });
}

describe('DeleteAdjustmentUseCase', () => {
  let useCase: DeleteAdjustmentUseCase;
  let invoiceRepo: ReturnType<typeof makeMockInvoiceRepository>;
  let auditLogRepo: ReturnType<typeof makeMockAuditLogRepository>;
  let dataSource: ReturnType<typeof makeMockDataSource>;

  beforeEach(() => {
    invoiceRepo = makeMockInvoiceRepository();
    auditLogRepo = makeMockAuditLogRepository();
    dataSource = makeMockDataSource();
    useCase = new DeleteAdjustmentUseCase(
      invoiceRepo as any,
      auditLogRepo as any,
      dataSource as any,
    );
  });

  it('should delete an adjustment from a draft invoice', async () => {
    const invoice = makeInvoiceWithAdjustment();
    invoiceRepo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new DeleteAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: ADJUSTMENT_ID,
        deletedBy: 'admin@agency.com',
      }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBe(ADJUSTMENT_ID);
    }
    expect(dataSource.transaction).toHaveBeenCalled();
  });

  it('should return 404 if invoice not found', async () => {
    invoiceRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(
      new DeleteAdjustmentCommand({
        invoiceId: 99999,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: ADJUSTMENT_ID,
        deletedBy: 'admin@agency.com',
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });

  it('should return 403 if invoice is finalized', async () => {
    const invoice = makeInvoiceWithAdjustment('finalized');
    invoiceRepo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new DeleteAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: ADJUSTMENT_ID,
        deletedBy: 'admin@agency.com',
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(403);
    }
  });

  it('should return 404 if line item not found', async () => {
    const invoice = makeInvoiceWithAdjustment();
    invoiceRepo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new DeleteAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: 99999,
        adjustmentId: ADJUSTMENT_ID,
        deletedBy: 'admin@agency.com',
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
      new DeleteAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: 99999,
        deletedBy: 'admin@agency.com',
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });
});
