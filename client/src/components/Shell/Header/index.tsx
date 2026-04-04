'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { ActionIcon, Anchor, Burger, Group, Title, useMantineColorScheme } from '@mantine/core';

interface HeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export function Header({ opened, onToggle }: HeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={onToggle} hiddenFrom="sm" size="sm" />
        <Anchor component={Link} href="/campaigns" underline="never" c="inherit">
          <Title order={3}>Dashboard</Title>
        </Anchor>
      </Group>
      <ActionIcon
        variant="default"
        onClick={toggleColorScheme}
        size="lg"
        aria-label="Toggle color scheme"
      >
        {mounted && colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Group>
  );
}
