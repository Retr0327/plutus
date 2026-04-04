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

    const result = await useCase.execute(
      new GetInvoiceQuery({ id: 'ywtkrlcr3xfx7lengdncbg4z' }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).not.toBeNull();
      expect(result.value!.id).toBe('ywtkrlcr3xfx7lengdncbg4z');
    }
  });

  it('should return first invoice by campaignId', async () => {
    const invoice = makeInvoice();
    repo.findAll.mockResolvedValue({ items: [invoice], totalItems: 1 });

    const result = await useCase.execute(
      new GetInvoiceQuery({ campaignId: 'dncnkn18pqamrqx43689pckc' }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).not.toBeNull();
    }
    expect(repo.findAll).toHaveBeenCalledWith({
      campaignId: 'dncnkn18pqamrqx43689pckc',
    });
  });

  it('should return null when invoice not found by id', async () => {
    repo.findById.mockResolvedValue(null);

    const result = await useCase.execute(
      new GetInvoiceQuery({ id: 'nonexistent' }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBeNull();
    }
  });

  it('should return null when no invoices for campaignId', async () => {
    repo.findAll.mockResolvedValue({ items: [], totalItems: 0 });

    const result = await useCase.execute(
      new GetInvoiceQuery({ campaignId: 'nonexistent' }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBeNull();
    }
  });
});
