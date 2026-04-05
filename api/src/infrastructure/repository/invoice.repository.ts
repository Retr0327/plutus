import { EntityManager, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Invoice as InvoiceAggregateRoot } from '@plutus/domain/invoice/invoice';
import {
  AbstractInvoiceDomainRepository,
  InvoiceListResult,
  InvoiceQueryOptions,
} from '@plutus/domain/invoice/invoice.repository';
import { AdjustmentMapper } from '@plutus/infrastructure/mappers/adjustment.mapper';
import { InvoiceLineItemMapper } from '@plutus/infrastructure/mappers/invoice-line-item.mapper';
import { InvoiceMapper } from '@plutus/infrastructure/mappers/invoice.mapper';
import {
  Adjustment,
  Invoice,
  InvoiceLineItem,
} from '@modules/postgres/entities';

export const enum InvoiceDomain {
  Repository = 'InvoiceDomainRepository',
}

@Injectable()
export class InvoiceDomainRepository implements AbstractInvoiceDomainRepository {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async findById(id: number) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['lineItems', 'lineItems.adjustments'],
    });
    if (invoice === null) {
      return null;
    }
    return InvoiceMapper.toDomain(invoice);
  }

  async findAll(options?: InvoiceQueryOptions): Promise<InvoiceListResult> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;

    const where: FindOptionsWhere<Invoice> = {};

    if (options?.status) {
      where.status = options.status as any;
    }
    if (options?.campaignId) {
      where.campaignId = options.campaignId;
    }
    if (!options?.includeArchived) {
      where.archivedAt = IsNull();
    }

    const [items, totalItems] = await this.invoiceRepository.findAndCount({
      where,
      relations: ['lineItems', 'lineItems.adjustments', 'campaign'],
      order: { createdAt: 'ASC', id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map((i) => InvoiceMapper.toDomain(i)),
      totalItems,
    };
  }

  async save(invoice: InvoiceAggregateRoot, tx?: EntityManager) {
    const manager = tx ?? this.invoiceRepository.manager;
    const invoicePO = InvoiceMapper.toPersistence(invoice);
    await manager.save(Invoice, invoicePO);

    const toSaveLineItemPOs: Partial<InvoiceLineItem>[] = [];
    const toDeleteLineItemIds: number[] = [];

    invoice.lineItems.newItems.forEach((item) => {
      toSaveLineItemPOs.push(InvoiceLineItemMapper.toPersistence(item));
    });
    invoice.lineItems.modifiedItems.forEach((item) => {
      toSaveLineItemPOs.push(InvoiceLineItemMapper.toPersistence(item));
    });
    invoice.lineItems.removedItems.forEach((item) => {
      toDeleteLineItemIds.push(item.id.value);
    });

    if (toSaveLineItemPOs.length > 0) {
      await manager.save(InvoiceLineItem, toSaveLineItemPOs);
    }
    if (toDeleteLineItemIds.length > 0) {
      await manager.delete(InvoiceLineItem, toDeleteLineItemIds);
    }

    const toSaveAdjustmentPOs: Partial<Adjustment>[] = [];
    const toDeleteAdjustmentIds: number[] = [];

    const lineItemsWithAdjustmentChanges = [
      ...invoice.lineItems.newItems,
      ...invoice.lineItems.modifiedItems,
      ...invoice.lineItems.items.filter((item) =>
        item.adjustments.hasChanges(),
      ),
    ];

    const seen = new Set<number>();
    for (const lineItem of lineItemsWithAdjustmentChanges) {
      if (seen.has(lineItem.id.value)) {
        continue;
      }
      seen.add(lineItem.id.value);

      lineItem.adjustments.newItems.forEach((adj) => {
        toSaveAdjustmentPOs.push(AdjustmentMapper.toPersistence(adj));
      });
      lineItem.adjustments.modifiedItems.forEach((adj) => {
        toSaveAdjustmentPOs.push(AdjustmentMapper.toPersistence(adj));
      });
      lineItem.adjustments.removedItems.forEach((adj) => {
        toDeleteAdjustmentIds.push(adj.id.value);
      });
    }

    if (toSaveAdjustmentPOs.length > 0) {
      await manager.save(Adjustment, toSaveAdjustmentPOs);
    }
    if (toDeleteAdjustmentIds.length > 0) {
      await manager.delete(Adjustment, toDeleteAdjustmentIds);
    }
  }
}
