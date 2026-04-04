'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Anchor, Breadcrumbs, Group, Title } from '@mantine/core';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs mb="xs">
          {breadcrumbs.map((item) => (
            <Anchor key={item.href} component={Link} href={item.href} size="sm">
              {item.label}
            </Anchor>
          ))}
          <span>{title}</span>
        </Breadcrumbs>
      )}
      <Group justify="space-between" mb="md">
        <Title order={2}>{title}</Title>
        {actions && <Group>{actions}</Group>}
      </Group>
    </>
  );
}
