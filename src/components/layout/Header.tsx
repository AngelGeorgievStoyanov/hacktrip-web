'use client';

import Link from 'next/link';
import { Fragment, useState, type KeyboardEvent } from 'react';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { isModeratorUser } from '@/constants/roles';
import { BREAKPOINTS, maxWidthQuery } from '@/constants/ui';
import {
  HEADER_ROOT_SX, HEADER_WELCOME_SX, HEADER_MENU_ICON_SX, HEADER_DRAWER_PAPER_SX,
  HEADER_DRAWER_NAV_SX, HEADER_DRAWER_NAV_BUTTON_SX, HEADER_TOOLBAR_SX,
} from '@/styles/presets/header';
import { BUTTON_STYLES } from '@/styles/presets/buttons';
import { HEADER_DRAWER_PAPER_SX } from '@/styles/presets/layouts';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

interface NavLink {
  href: string;
  label: string;
}

/**
 * Client Component because it reads the auth session to show login/account controls;
 * `useAuth()` is the single source of frontend auth state.
 */
export function Header() {
  const { status, user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const useDrawerNav = useMediaQuery(maxWidthQuery(BREAKPOINTS.desktopNav));
  const isAuthenticated = status === 'authenticated';
  const isModerator = isModeratorUser(user);

  const links: NavLink[] = isAuthenticated
    ? [
        { href: '/', label: 'HOME' },
        { href: '/trips', label: 'TRIPS' },
        { href: '/trips/create', label: 'CREATE TRIP' },
        { href: '/my-trips', label: 'MY TRIPS' },
        { href: '/favorites', label: 'MY FAVORITES' },
        { href: '/about', label: 'ABOUT US' },
        ...(isModerator ? [{ href: '/admin', label: 'ADMIN' }] : []),
      ]
    : [
        { href: '/', label: 'HOME' },
        { href: '/trips', label: 'TRIPS' },
        { href: '/login', label: 'LOGIN' },
        { href: '/register', label: 'REGISTER' },
        { href: '/about', label: 'ABOUT US' },
      ];

  function closeDrawer(): void {
    setDrawerOpen(false);
  }

  function handleDrawerKeyDown(event: KeyboardEvent): void {
    // Tab/Shift only move focus; the legacy drawer ignored them so keyboard traversal
    // through the menu does not close it.
    if (event.key === 'Tab' || event.key === 'Shift') {
      return;
    }
    closeDrawer();
  }

  async function handleLogout(): Promise<void> {
    closeDrawer();
    await logout();
  }

  function renderWelcome() {
    return (
      <Typography
        variant="h6"
        component="div"
        sx={HEADER_WELCOME_SX}
      >
        <Button component={Link} href="/profile" color="inherit" sx={BUTTON_STYLES.navigation}>
          Welcome{'   '}
          {user?.email}
        </Button>
      </Typography>
    );
  }

  function renderNavButtons() {
    return (
      <>
        {links.map((link) => (
          <Button
            key={`${link.href}-${link.label}`}
            component={Link}
            href={link.href}
            color="inherit"
            sx={BUTTON_STYLES.navigation}
          >
            {link.label}
          </Button>
        ))}
        <Button onClick={() => void handleLogout()} color="inherit" sx={BUTTON_STYLES.navigation}>
          LOGOUT
        </Button>
      </>
    );
  }

  function renderDrawer() {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setDrawerOpen((open) => !open)}
          sx={HEADER_MENU_ICON_SX}
        >
          {drawerOpen ? <CloseIcon fontSize="inherit" /> : <MenuIcon fontSize="inherit" />}
        </IconButton>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={closeDrawer}
          slotProps={{ paper: { elevation: 12, sx: HEADER_DRAWER_PAPER_SX } }}
        >
          <Box
            component="nav"
            aria-label="Navigation menu"
            onClick={closeDrawer}
            onKeyDown={handleDrawerKeyDown}
            sx={HEADER_DRAWER_NAV_SX}
          >
            {links.map((link) => (
              <Fragment key={`${link.href}-${link.label}`}>
                <Button component={Link} href={link.href} color="inherit" sx={HEADER_DRAWER_NAV_BUTTON_SX}>
                  {link.label}
                </Button>
                <Divider />
              </Fragment>
            ))}
            <Button onClick={() => void handleLogout()} color="inherit" sx={HEADER_DRAWER_NAV_BUTTON_SX}>
              LOGOUT
            </Button>
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    // The legacy `flexGrow: 1` (inert in the old block layout) would absorb the free
    // space that pushes the footer to the bottom of `.app-shell` on short pages.
    <Box sx={HEADER_ROOT_SX}>
      <AppBar position="static">
        <Toolbar
          sx={HEADER_TOOLBAR_SX}
        >
          {isAuthenticated ? (
            <>
              {renderWelcome()}
              {useDrawerNav ? renderDrawer() : renderNavButtons()}
            </>
          ) : (
            links.map((link) => (
              <Button
                key={`${link.href}-${link.label}`}
                component={Link}
                href={link.href}
                color="inherit"
                sx={BUTTON_STYLES.navigation}
              >
                {link.label}
              </Button>
            ))
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
