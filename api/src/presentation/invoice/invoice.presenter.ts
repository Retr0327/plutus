import { Injectable } from '@nestjs/common';
import {
  InvoiceListItemDto,
  PaginationMeta,
} from '@plutus/application/use-case/queries/get-invoice-list/get-invoice-list.output';
import { AdjustmentMapper } from '@plutus/infrastructure/mappers/adjustment.mapper';
import { AuditLogMapper } from '@plutus/infrastructure/mappers/audit-log.mapper';
import { CampaignMapper } from '@plutus/infrastructure/mappers/campaign.mapper';
import { InvoiceMapper } from '@plutus/infrastructure/mappers/invoice.mapper';
import { Presenter } from '@common/domain/interfaces/presenter';

export type GetInvoiceListPresenterInput = {
  items: InvoiceListItemDto[];
  meta: PaginationMeta;
};

export type GetInvoiceListPresenterOutput = GetInvoiceListPresenterInput;

@Injectable()
export class GetInvoiceListPresenter implements Presenter<
  GetInvoiceListPresenterInput,
  GetInvoiceListPresenterOutput
> {
  present(input: GetInvoiceListPresenterInput) {
    return { items: input.items, meta: input.meta };
  }
}

export type GetOneInvoicePresenterInput = {
  invoice: ReturnType<(typeof InvoiceMapper)['toDto']>;
  campaign: ReturnType<(typeof CampaignMapper)['toDto']>;
};

export type GetOneInvoicePresenterOutput = {
  id: number;
  invoiceNumber: string;
  status: string;
  archivedAt: number | null;
  campaign: {
    id: number;
    name: string;
  };
  lineItems: {
    id: number;
    name: string | null;
    campaignLineItemId: number;
    actualAmount: number;
    adjustments: {
      id: number;
      amount: number;
      reason: string;
      createdBy: string;
      createdAt: number;
      updatedAt: number;
    }[];
    adjustmentsTotal: number;
    billableAmount: number;
  }[];
  totalActualAmount: number;
  totalAdjustments: number;
  totalBillableAmount: number;
  createdAt: number;
  updatedAt: number;
};

@Injectable()
export class GetOneInvoicePresenter implements Presenter<
  GetOneInvoicePresenterInput,
  GetOneInvoicePresenterOutput
> {
  present(input: GetOneInvoicePresenterInput) {
    const { invoice, campaign } = input;

    const totalActualAmount = invoice.lineItems.reduce(
      (sum, li) => sum + li.actualAmount,
      0,
    );
    const totalAdjustments = invoice.lineItems.reduce(
      (sum, li) => sum + li.adjustmentsTotal,
      0,
    );

    const campaignLineItemNameMap = new Map(
      campaign.lineItems.map((cli) => [cli.id, cli.name]),
    );

    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      archivedAt: invoice.archivedAt,
      campaign: {
        id: invoice.campaignId,
        name: campaign.name,
      },
      lineItems: invoice.lineItems.map((li) => ({
        id: li.id,
        name: campaignLineItemNameMap.get(li.campaignLineItemId) ?? null,
        campaignLineItemId: li.campaignLineItemId,
        actualAmount: li.actualAmount,
        adjustments: li.adjustments.map((adj) => ({
          id: adj.id,
          amount: adj.amount,
          reason: adj.reason,
          createdBy: adj.createdBy,
          createdAt: adj.createdAt ?? 0,
          updatedAt: adj.updatedAt ?? 0,
        })),
        adjustmentsTotal: li.adjustmentsTotal,
        billableAmount: li.billableAmount,
      })),
      totalActualAmount,
      totalAdjustments,
      totalBillableAmount: totalActualAmount + totalAdjustments,
      createdAt: 0,
      updatedAt: 0,
    };
  }
}

export type ArchiveInvoicePresenterInput = {
  readonly id: number;
  readonly archivedAt: number | null;
};

export type ArchiveInvoicePresenterOutput = ArchiveInvoicePresenterInput;

@Injectable()
export class ArchiveInvoicePresenter implements Presenter<
  ArchiveInvoicePresenterInput,
  ArchiveInvoicePresenterOutput
> {
  present(input: ArchiveInvoicePresenterInput) {
    return { id: input.id, archivedAt: input.archivedAt };
  }
}

export type UnarchiveInvoicePresenterInput = {
  readonly id: number;
};

export type UnarchiveInvoicePresenterOutput = { id: number; archivedAt: null };

@Injectable()
export class UnarchiveInvoicePresenter implements Presenter<
  UnarchiveInvoicePresenterInput,
  UnarchiveInvoicePresenterOutput
> {
  present(input: UnarchiveInvoicePresenterInput) {
    return { id: input.id, archivedAt: null };
  }
}

type AdjustmentDto = ReturnType<(typeof AdjustmentMapper)['toDto']>;

export type GetAdjustmentPresenterInput = {
  readonly adjustment: AdjustmentDto;
};

export type GetAdjustmentPresenterOutput = AdjustmentDto;

@Injectable()
export class GetAdjustmentPresenter implements Presenter<
  GetAdjustmentPresenterInput,
  GetAdjustmentPresenterOutput
> {
  present(input: GetAdjustmentPresenterInput) {
    return {
      id: input.adjustment.id,
      invoiceLineItemId: input.adjustment.invoiceLineItemId,
      amount: input.adjustment.amount,
      reason: input.adjustment.reason,
      createdBy: input.adjustment.createdBy,
      createdAt: input.adjustment.createdAt,
      updatedAt: input.adjustment.updatedAt,
    };
  }
}

export type DeleteAdjustmentPresenterInput = {
  readonly id: number;
};

export type DeleteAdjustmentPresenterOutput = {
  id: number;
  deleted: true;
};

@Injectable()
export class DeleteAdjustmentPresenter implements Presenter<
  DeleteAdjustmentPresenterInput,
  DeleteAdjustmentPresenterOutput
> {
  present(input: DeleteAdjustmentPresenterInput) {
    return { id: input.id, deleted: true as const };
  }
}

type AuditLogDto = ReturnType<(typeof AuditLogMapper)['toDto']>;

export type GetAdjustmentHistoryPresenterInput = {
  readonly items: AuditLogDto[];
};

export type GetAdjustmentHistoryPresenterOutput = {
  items: AuditLogDto[];
};

@Injectable()
export class GetAdjustmentHistoryPresenter implements Presenter<
  GetAdjustmentHistoryPresenterInput,
  GetAdjustmentHistoryPresenterOutput
> {
  present(input: GetAdjustmentHistoryPresenterInput) {
    return { items: input.items };
  }
}
