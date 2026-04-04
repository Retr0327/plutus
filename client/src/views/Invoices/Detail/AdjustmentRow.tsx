'use client';

import { IconEdit, IconHistory, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Group, Paper, Text } from '@mantine/core';
import { MoneyDisplay } from '@plutus/components/MoneyDisplay';
import type { Adjustment } from '@plutus/types/invoice';

interface AdjustmentRowProps {
  adjustment: Adjustment;
  isDraft: boolean;
  currency?: string;
  rates?: Record<string, number>;
  onEdit: (adjustment: Adjustment) => void;
  onDelete: (adjustment: Adjustment) => void;
  onHistory: (adjustment: Adjustment) => void;
}

export function AdjustmentRow({
  adjustment,
  isDraft,
  currency,
  rates,
  onEdit,
  onDelete,
  onHistory,
}: AdjustmentRowProps) {
  return (
    <Paper p="xs" withBorder mb="xs">
      <Group justify="space-between" wrap="nowrap">
        <div style={{ flex: 1 }}>
          <Group gap="sm">
            <MoneyDisplay amount={adjustment.amount} colorSign currency={currency} rates={rates} />
            <Text size="sm" c="dimmed" lineClamp={1}>
              {adjustment.reason}
            </Text>
          </Group>
          <Text size="xs" c="dimmed">
            {adjustment.createdBy}
          </Text>
        </div>
        <Group gap="xs" wrap="nowrap">
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => onHistory(adjustment)}
            aria-label="View history"
          >
            <IconHistory size={16} />
          </ActionIcon>
          {isDraft && (
            <>
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => onEdit(adjustment)}
                aria-label="Edit adjustment"
              >
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={() => onDelete(adjustment)}
                aria-label="Delete adjustment"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </>
          )}
        </Group>
      </Group>
    </Paper>
  );
}
