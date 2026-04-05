import { ArchiveInvoiceCommand } from '@plutus/application/use-case/commands/archive-invoice/archive-invoice.input';
import { ArchiveInvoiceUseCase } from '@plutus/application/use-case/commands/archive-invoice/archive-invoice.use-case';
import { makeInvoice, makeMockInvoiceRepository } from '../../factories';

describe('ArchiveInvoiceUseCase', () => {
  let useCase: ArchiveInvoiceUseCase;
  let repo: ReturnType<typeof makeMockInvoiceRepository>;

  beforeEach(() => {
    repo = makeMockInvoiceRepository();
    useCase = new ArchiveInvoiceUseCase(repo as any);
  });

  it('should archive a non-archived invoice', async () => {
    const invoice = makeInvoice();
    repo.findById.mockResolvedValue(invoice);
    repo.save.mockResolvedValue(undefined);

    const result = await useCase.execute(new ArchiveInvoiceCommand({ id: 1 }));

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.id).toBe(1);
    }
    expect(repo.save).toHaveBeenCalledWith(invoice);
  });

  it('should return 404 if invoice not found', async () => {
    repo.findById.mockResolvedValue(null);

    const result = await useCase.execute(
      new ArchiveInvoiceCommand({ id: 99999 }),
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(404);
    }
  });

  it('should return 409 if already archived', async () => {
    const invoice = makeInvoice({ archivedAt: 1711720000000 });
    repo.findById.mockResolvedValue(invoice);

    const result = await useCase.execute(new ArchiveInvoiceCommand({ id: 1 }));

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.getStatus()).toBe(409);
    }
  });
});
