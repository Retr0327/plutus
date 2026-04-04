'use client';

import { IconPlus } from '@tabler/icons-react';
import { Button, Card, Group, Text, Title } from '@mantine/core';
import { MoneyDisplay } from '@plutus/components/MoneyDisplay';
import type { Adjustment, InvoiceLineItem } from '@plutus/types/invoice';
import { AdjustmentRow } from './AdjustmentRow';

interface LineItemCardProps {
  lineItem: InvoiceLineItem;
  isDraft: boolean;
  currency?: string;
  rates?: Record<string, number>;
  onAddAdjustment: (lineItemId: string) => void;
  onEditAdjustment: (lineItemId: string, adjustment: Adjustment) => void;
  onDeleteAdjustment: (lineItemId: string, adjustment: Adjustment) => void;
  onViewHistory: (lineItemId: string, adjustment: Adjustment) => void;
}

export function LineItemCard({
  lineItem,
  isDraft,
  currency,
  rates,
  onAddAdjustment,
  onEditAdjustment,
  onDeleteAdjustment,
  onViewHistory,
}: LineItemCardProps) {
  return (
    <Card withBorder mb="md">
      <Group justify="space-between" mb="sm">
        <Title order={5}>{lineItem.name}</Title>
        <Text size="sm">
          Actual:{' '}
          <MoneyDisplay amount={lineItem.actualAmount} fw={500} currency={currency} rates={rates} />
        </Text>
      </Group>

      {lineItem.adjustments.length > 0 && (
        <>
          <Text size="sm" fw={500} mb="xs">
            Adjustments:
          </Text>
          {lineItem.adjustments.map((adj) => (
            <AdjustmentRow
              key={adj.id}
              adjustment={adj}
              isDraft={isDraft}
              currency={currency}
              rates={rates}
              onEdit={(a) => onEditAdjustment(lineItem.id, a)}
              onDelete={(a) => onDeleteAdjustment(lineItem.id, a)}
              onHistory={(a) => onViewHistory(lineItem.id, a)}
            />
          ))}
        </>
      )}

      {isDraft && (
        <Button
          variant="light"
          size="xs"
          leftSection={<IconPlus size={14} />}
          mt="xs"
          onClick={() => onAddAdjustment(lineItem.id)}
        >
          Add Adjustment
        </Button>
      )}

      <Group justify="flex-end" mt="sm" gap="lg">
        <Text size="sm">
          Adjustments:{' '}
          <MoneyDisplay
            amount={lineItem.adjustmentsTotal}
            colorSign
            currency={currency}
            rates={rates}
          />
        </Text>
        <Text size="sm" fw={600}>
          Billable:{' '}
          <MoneyDisplay
            amount={lineItem.billableAmount}
            fw={600}
            currency={currency}
            rates={rates}
          />
        </Text>
      </Group>
    </Card>
  );
}
