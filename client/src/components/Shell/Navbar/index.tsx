'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconFileInvoice, IconSpeakerphone } from '@tabler/icons-react';
import { Route } from '@plutus/libs/config/routes';
import classes from './Navbar.module.css';

const navLinks = [
  { label: 'Campaigns', href: Route.Campaigns, icon: IconSpeakerphone },
  { label: 'Invoices', href: Route.Invoices, icon: IconFileInvoice },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={classes.link}
            data-active={isActive || undefined}
          >
            <link.icon size={20} stroke={1.5} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </>
  );
}
