import { CreateAdjustmentCommand } from '@plutus/application/use-case/commands/create-adjustment/create-adjustment.input';
import { CreateAdjustmentUseCase } from '@plutus/application/use-case/commands/create-adjustment/create-adjustment.use-case';
import {
  makeInvoiceWithLineItem,
  makeMockAuditLogRepository,
  makeMockDataSource,
  makeMockInvoiceRepository,
} from '../../factories';

const LINE_ITEM_ID = 10;
const INVOICE_ID = 1;

describe('CreateAdjustmentUseCase', () => {
  let useCase: CreateAdjustmentUseCase;
  let invoiceRepo: ReturnType<typeof makeMockInvoiceRepository>;
  let auditLogRepo: ReturnType<typeof makeMockAuditLogRepository>;
  let dataSource: ReturnType<typeof makeMockDataSource>;

  beforeEach(() => {
    invoiceRepo = makeMockInvoiceRepository();
    auditLogRepo = makeMockAuditLogRepository();
    dataSource = makeMockDataSource();
    useCase = new CreateAdjustmentUseCase(
      invoiceRepo as any,
      auditLogRepo as any,
      dataSource as any,
    );
  });

  it('should create an adjustment on a draft invoice', async () => {
    const invoice = makeInvoiceWithLineItem();
    invoiceRepo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new CreateAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        amount: -1218.75,
        reason: 'Under-delivery credit',
        createdBy: 'jane.doe@agency.com',
      }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBeDefined();
      expect(typeof result.value.id).toBe('number');
    }
    expect(dataSource.transaction).toHaveBeenCalled();
  });

  it('should return 404 if invoice not found', async () => {
    invoiceRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(
      new CreateAdjustmentCommand({
        invoiceId: 99999,
        lineItemId: LINE_ITEM_ID,
        amount: -100,
        reason: 'test',
        createdBy: 'test@test.com',
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });

  it('should return 403 if invoice is finalized', async () => {
    const invoice = makeInvoiceWithLineItem({ status: 'finalized' });
    invoiceRepo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new CreateAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: LINE_ITEM_ID,
        amount: -100,
        reason: 'test',
        createdBy: 'test@test.com',
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(403);
    }
  });

  it('should return 404 if line item not found', async () => {
    const invoice = makeInvoiceWithLineItem();
    invoiceRepo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new CreateAdjustmentCommand({
        invoiceId: INVOICE_ID,
        lineItemId: 99999,
        amount: -100,
        reason: 'test',
        createdBy: 'test@test.com',
      }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });
});
