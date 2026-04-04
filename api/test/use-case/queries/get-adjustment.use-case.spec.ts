import { GetAdjustmentQuery } from '@plutus/application/use-case/queries/get-adjustment/get-adjustment.input';
import { GetAdjustmentUseCase } from '@plutus/application/use-case/queries/get-adjustment/get-adjustment.use-case';
import { makeAdjustment } from '../../factories/adjustment.factory';
import { makeLineItem } from '../../factories/invoice.factory';
import { makeInvoice, makeMockInvoiceRepository } from '../../factories';

const INVOICE_ID = 'ywtkrlcr3xfx7lengdncbg4z';
const LINE_ITEM_ID = 'nzjs4zd7e7edepopyzhla2ut';
const ADJUSTMENT_ID = 'wdwxw0d22nqhp8elur10gzoc';

function makeInvoiceWithAdjustment() {
  const adjustment = makeAdjustment();
  const lineItem = makeLineItem({ adjustments: [adjustment] });
  return makeInvoice({ lineItems: [lineItem] });
}

describe('GetAdjustmentUseCase', () => {
  let useCase: GetAdjustmentUseCase;
  let repo: ReturnType<typeof makeMockInvoiceRepository>;

  beforeEach(() => {
    repo = makeMockInvoiceRepository();
    useCase = new GetAdjustmentUseCase(repo as any);
  });

  it('should return an adjustment DTO when found', async () => {
    const invoice = makeInvoiceWithAdjustment();
    repo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new GetAdjustmentQuery({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: ADJUSTMENT_ID,
      }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).not.toBeNull();
      expect(result.value!.id).toBe(ADJUSTMENT_ID);
    }
  });

  it('should return 404 if invoice not found', async () => {
    repo.findById.mockResolvedValue(null);

    const result = await useCase.execute(
      new GetAdjustmentQuery({
        invoiceId: 'nonexistent',
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
    repo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new GetAdjustmentQuery({
        invoiceId: INVOICE_ID,
        lineItemId: 'nonexistent_line_item_id_x',
        adjustmentId: ADJUSTMENT_ID,
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });

  it('should return null if adjustment not found', async () => {
    const invoice = makeInvoiceWithAdjustment();
    repo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new GetAdjustmentQuery({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        adjustmentId: 'nonexistent_adjustment_id',
      }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBeNull();
    }
  });
});
