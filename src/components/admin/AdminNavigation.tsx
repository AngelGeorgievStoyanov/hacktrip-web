'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Button } from '@mui/material';
import { ADMIN_NAVIGATION_SX } from '@/styles/presets/admin';

const sections = [
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/reports', label: 'Reports' },
  { href: '/admin/failed-login-logs', label: 'Failed login logs' },
  { href: '/admin/route-not-found-logs', label: 'Route not found logs' },
  { href: '/admin/images', label: 'Images' },
];

export function AdminNavigation() {
  const pathname = usePathname();

  return (
    <Box component="nav" aria-label="Admin navigation" sx={ADMIN_NAVIGATION_SX}>
      {sections.map((section) => {
        const active = pathname === section.href || pathname.startsWith(section.href + '/');

        return (
          <Button
            key={section.href}
            component={Link}
            href={section.href}
            size="small"
            variant={active ? 'contained' : 'text'}
            color={active ? 'primary' : 'inherit'}
            aria-current={active ? 'page' : undefined}
          >
            {section.label}
          </Button>
        );
      })}
    </Box>
  );
}
