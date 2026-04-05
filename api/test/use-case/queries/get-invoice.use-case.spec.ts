import { GetInvoiceQuery } from '@plutus/application/use-case/queries/get-invoice/get-invoice.input';
import { GetInvoiceUseCase } from '@plutus/application/use-case/queries/get-invoice/get-invoice.use-case';
import { makeInvoice, makeMockInvoiceRepository } from '../../factories';

describe('GetInvoiceUseCase', () => {
  let useCase: GetInvoiceUseCase;
  let repo: ReturnType<typeof makeMockInvoiceRepository>;

  beforeEach(() => {
    repo = makeMockInvoiceRepository();
    useCase = new GetInvoiceUseCase(repo as any);
  });

  it('should return an invoice DTO by id', async () => {
    const invoice = makeInvoice();
    repo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(new GetInvoiceQuery({ id: 1 }));

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).not.toBeNull();
      expect(result.value!.id).toBe(1);
    }
  });

  it('should return first invoice by campaignId', async () => {
    const invoice = makeInvoice();
    repo.findAll.mockResolvedValue({ items: [invoice], totalItems: 1 });

    const result = await useCase.execute(
      new GetInvoiceQuery({ campaignId: 1 }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).not.toBeNull();
    }
    expect(repo.findAll).toHaveBeenCalledWith({
      campaignId: 1,
    });
  });

  it('should return null when invoice not found by id', async () => {
    repo.findById.mockResolvedValue(null);

    const result = await useCase.execute(new GetInvoiceQuery({ id: 99999 }));

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBeNull();
    }
  });

  it('should return null when no invoices for campaignId', async () => {
    repo.findAll.mockResolvedValue({ items: [], totalItems: 0 });

    const result = await useCase.execute(
      new GetInvoiceQuery({ campaignId: 99999 }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBeNull();
    }
  });
});
