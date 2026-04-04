'use client';

import type { ReactNode } from 'react';
import { IconDatabaseOff } from '@tabler/icons-react';
import { Center, Stack, Text, ThemeIcon } from '@mantine/core';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export function EmptyState({
  title = 'No data',
  description = 'No records found matching your criteria.',
  icon,
}: EmptyStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="sm">
        {icon ?? (
          <ThemeIcon size={48} variant="light" color="gray">
            <IconDatabaseOff size={28} />
          </ThemeIcon>
        )}
        <Text fw={500} size="lg">
          {title}
        </Text>
        <Text c="dimmed" size="sm" ta="center">
          {description}
        </Text>
      </Stack>
    </Center>
  );
}
