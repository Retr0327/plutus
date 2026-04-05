'use client';

import type { ReactNode } from 'react';
import { Skeleton, Table } from '@mantine/core';
import { EmptyState } from '@plutus/components/EmptyState';
import { DataTablePagination } from './Pagination';

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
  rowKey: (item: T) => string | number;
  rowOpacity?: (item: T) => number | undefined;
}

export function DataTable<T>({
  data,
  columns,
  loading,
  onRowClick,
  pagination,
  emptyMessage,
  rowKey,
  rowOpacity,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={col.key}>{col.label}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <Table.Tr key={i}>
              {columns.map((col) => (
                <Table.Td key={col.key}>
                  <Skeleton height={20} />
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  }

  if (data.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  return (
    <>
      <Table highlightOnHover={!!onRowClick} striped>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={col.key}>{col.label}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item) => (
            <Table.Tr
              key={rowKey(item)}
              onClick={
                onRowClick
                  ? (e: React.MouseEvent) => {
                      const target = e.target as HTMLElement;
                      if (target.closest('button, a, [role="button"]')) return;
                      onRowClick(item);
                    }
                  : undefined
              }
              style={{
                cursor: onRowClick ? 'pointer' : undefined,
                opacity: rowOpacity?.(item),
              }}
            >
              {columns.map((col) => (
                <Table.Td key={col.key}>{col.render(item)}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {pagination && (
        <DataTablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </>
  );
}
