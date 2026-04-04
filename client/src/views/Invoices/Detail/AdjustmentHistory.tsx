'use client';

import { IconCircleCheck, IconEdit, IconTrash } from '@tabler/icons-react';
import { Center, Loader, Text, Timeline } from '@mantine/core';
import { useAdjustmentHistory } from '@plutus/hooks';
import { formatDateTime, formatMoney } from '@plutus/utils/format';

interface AdjustmentHistoryProps {
  invoiceId: string;
  lineItemId: string;
  adjustmentId: string;
}

const actionIcons = {
  create: <IconCircleCheck size={16} />,
  update: <IconEdit size={16} />,
  delete: <IconTrash size={16} />,
} as const;

const actionColors = {
  create: 'green',
  update: 'blue',
  delete: 'red',
} as const;

function renderDiff(
  oldVal: Record<string, unknown> | null,
  newVal: Record<string, unknown> | null
) {
  const changes: string[] = [];
  if (!newVal) return null;

  for (const key of Object.keys(newVal)) {
    const oldV = oldVal?.[key];
    const newV = newVal[key];
    if (oldV !== undefined && oldV !== newV) {
      const fmt = (v: unknown) =>
        typeof v === 'number' && key === 'amount' ? formatMoney(v) : String(v);
      changes.push(`${key}: ${fmt(oldV)} → ${fmt(newV)}`);
    } else if (oldV === undefined) {
      const fmt = (v: unknown) =>
        typeof v === 'number' && key === 'amount' ? formatMoney(v) : String(v);
      changes.push(`${key}: ${fmt(newV)}`);
    }
  }

  return changes.map((change) => (
    <Text key={change} size="sm" c="dimmed">
      {change}
    </Text>
  ));
}

export function AdjustmentHistory({ invoiceId, lineItemId, adjustmentId }: AdjustmentHistoryProps) {
  const { data: entries, isLoading } = useAdjustmentHistory(invoiceId, lineItemId, adjustmentId);

  if (isLoading) {
    return (
      <Center p="xl">
        <Loader />
      </Center>
    );
  }

  if (!entries || entries.length === 0) {
    return <Text c="dimmed">No history available.</Text>;
  }

  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Timeline active={sorted.length - 1} bulletSize={24} lineWidth={2}>
      {sorted.map((entry) => (
        <Timeline.Item
          key={entry.id}
          bullet={actionIcons[entry.action]}
          color={actionColors[entry.action]}
          title={`${entry.action.toUpperCase()} — ${entry.changedBy}`}
        >
          <Text size="xs" c="dimmed">
            {formatDateTime(entry.createdAt)}
          </Text>
          {entry.action === 'delete' ? (
            <Text size="sm" c="dimmed">
              Adjustment deleted
            </Text>
          ) : (
            renderDiff(entry.oldValue, entry.newValue)
          )}
        </Timeline.Item>
      ))}
    </Timeline>
  );
}
