'use client';

import { Badge } from '@mantine/core';

interface StatusBadgeProps {
  status: 'draft' | 'finalized';
}

const statusConfig = {
  draft: { color: 'yellow', label: 'Draft' },
  finalized: { color: 'green', label: 'Finalized' },
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge color={config.color} variant="light">
      {config.label}
    </Badge>
  );
}
