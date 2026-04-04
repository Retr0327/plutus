import { UpdateAdjustmentCommand } from '@plutus/application/use-case/commands/update-adjustment/update-adjustment.input';
import { UpdateAdjustmentUseCase } from '@plutus/application/use-case/commands/update-adjustment/update-adjustment.use-case';
import { makeAdjustment } from '../../factories/adjustment.factory';
import { makeLineItem } from '../../factories/invoice.factory';
import {
  makeInvoice,
  makeMockAuditLogRepository,
  makeMockDataSource,
  makeMockInvoiceRepository,
} from '../../factories';

const INVOICE_ID = 'ywtkrlcr3xfx7lengdncbg4z';
const LINE_ITEM_ID = 'nzjs4zd7e7edepopyzhla2ut';
const ADJUSTMENT_ID = 'wdwxw0d22nqhp8elur10gzoc';

function makeInvoiceWithAdjustment(status = 'draft') {
  const adjustment = makeAdjustment();
  const lineItem = makeLineItem({ adjustments: [adjustment] });
  return makeInvoice({ status, lineItems: [lineItem] });
}

describe('UpdateAdjustmentUseCase', () => {
  let useCase: UpdateAdjustmentUseCase;
  let invoiceRepo: ReturnType<typeof makeMockInvoiceRepository>;
  let auditLogRepo: ReturnType<typeof makeMockAuditLogRepository>;
  let dataSource: ReturnType<typeof makeMockDataSource>;

  beforeEach(() => {
    invoiceRepo = makeMockInvoiceRepository();
    auditLogRepo = makeMockAuditLogRepository();
    dataSource = makeMockDataSource();
    useCase = new UpdateAdjustmentUseCase(
      invoiceRepo as any,
      auditLogRepo as any,
      dataSource as any,
    );
  });

  it('should update adjustment amount on a draft invoice', async () => {
    const invoice = makeInvoiceWithAdjustment();
    invoiceRepo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new UpdateAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: ADJUSTMENT_ID,
        amount: -2000,
        updatedBy: 'editor@agency.com',
      }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBe(ADJUSTMENT_ID);
    }
    expect(dataSource.transaction).toHaveBeenCalled();
  });

  it('should update adjustment reason', async () => {
    const invoice = makeInvoiceWithAdjustment();
    invoiceRepo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new UpdateAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: ADJUSTMENT_ID,
        reason: 'Updated reason',
        updatedBy: 'editor@agency.com',
      }),
    );

    expect(result.isOk()).toBe(true);
  });

  it('should return 404 if invoice not found', async () => {
    invoiceRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(
      new UpdateAdjustmentCommand({
        invoiceId: 'nonexistent',
        lineItemId: LINE_ITEM_ID,
        adjustmentId: ADJUSTMENT_ID,
        amount: -100,
        updatedBy: 'test@test.com',
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
      new UpdateAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: ADJUSTMENT_ID,
        amount: -100,
        updatedBy: 'test@test.com',
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
      new UpdateAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: 'nonexistent_line_item_id_x',
        adjustmentId: ADJUSTMENT_ID,
        amount: -100,
        updatedBy: 'test@test.com',
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
      new UpdateAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: 'nonexistent_adjustment_id',
        amount: -100,
        updatedBy: 'test@test.com',
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });
});
