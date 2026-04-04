'use client';

import { IconArchive, IconArchiveOff } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';

interface ArchiveButtonProps {
  isArchived: boolean;
  onArchive: () => void;
  onUnarchive: () => void;
  loading?: boolean;
}

export function ArchiveButton({ isArchived, onArchive, onUnarchive, loading }: ArchiveButtonProps) {
  const handleClick = () => {
    modals.openConfirmModal({
      title: isArchived ? 'Unarchive' : 'Archive',
      children: isArchived
        ? 'Are you sure you want to unarchive this item?'
        : 'Are you sure you want to archive this item?',
      labels: { confirm: isArchived ? 'Unarchive' : 'Archive', cancel: 'Cancel' },
      confirmProps: { color: isArchived ? 'blue' : 'red' },
      onConfirm: isArchived ? onUnarchive : onArchive,
    });
  };

  return (
    <Button
      variant="light"
      color={isArchived ? 'blue' : 'red'}
      size="xs"
      leftSection={isArchived ? <IconArchiveOff size={16} /> : <IconArchive size={16} />}
      onClick={handleClick}
      loading={loading}
    >
      {isArchived ? 'Unarchive' : 'Archive'}
    </Button>
  );
}
