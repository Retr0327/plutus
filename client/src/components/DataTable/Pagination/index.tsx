'use client';

import { Group, Pagination as MantinePagination, Text } from '@mantine/core';

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({ page, totalPages, onPageChange }: DataTablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Group justify="space-between" mt="md">
      <Text size="sm" c="dimmed">
        Page {page} of {totalPages}
      </Text>
      <MantinePagination value={page} onChange={onPageChange} total={totalPages} size="sm" />
    </Group>
  );
}
