import { UnarchiveInvoiceCommand } from '@plutus/application/use-case/commands/unarchive-invoice/unarchive-invoice.input';
import { UnarchiveInvoiceUseCase } from '@plutus/application/use-case/commands/unarchive-invoice/unarchive-invoice.use-case';
import { makeInvoice, makeMockInvoiceRepository } from '../../factories';

describe('UnarchiveInvoiceUseCase', () => {
  let useCase: UnarchiveInvoiceUseCase;
  let repo: ReturnType<typeof makeMockInvoiceRepository>;

  beforeEach(() => {
    repo = makeMockInvoiceRepository();
    useCase = new UnarchiveInvoiceUseCase(repo as any);
  });

  it('should unarchive an archived invoice', async () => {
    const invoice = makeInvoice({ archivedAt: 1711720000000 });
    repo.findById.mockResolvedValue(invoice);
    repo.save.mockResolvedValue(undefined);

    const result = await useCase.execute(
      new UnarchiveInvoiceCommand({ id: 'ywtkrlcr3xfx7lengdncbg4z' }),
    );

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBe('ywtkrlcr3xfx7lengdncbg4z');
    }
    expect(repo.save).toHaveBeenCalledWith(invoice);
  });

  it('should return 404 if invoice not found', async () => {
    repo.findById.mockResolvedValue(null);

    const result = await useCase.execute(
      new UnarchiveInvoiceCommand({ id: 'nonexistent' }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });

  it('should return 409 if not archived', async () => {
    const invoice = makeInvoice();
    repo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(
      new UnarchiveInvoiceCommand({ id: 'ywtkrlcr3xfx7lengdncbg4z' }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(409);
    }
  });
});
