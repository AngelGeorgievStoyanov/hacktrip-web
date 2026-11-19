'use client';

import { useState } from 'react';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { adminApi } from '@/api/admin';
import { useAuth } from '@/hooks/useAuth';
import { useConfirm } from '@/components/common/ConfirmDialog';
import { getGenericErrorMessage } from '@/lib/errors';
import { ADMIN_PAGE_SIZE_DEFAULT } from '@/constants/admin';
import { ADMIN_PAGINATION_BUTTON_SX } from '@/styles/presets/pagination';
import { ADMIN_USERS_TITLE_SX, ADMIN_USERS_GRID_SX, ADMIN_USER_CARD_SX, ADMIN_USER_CARD_CONTENT_SX, ADMIN_USER_CARD_IDENTITY_SX, ADMIN_USER_CARD_ACTIONS_SX, ADMIN_USERS_PAGINATION_SX } from '@/styles/presets/admin';
import { BUTTON_STYLES } from '@/styles/presets/buttons';
import { hasRole } from '@/constants/roles';
import { ImageLightbox } from '@/components/images/ImageLightbox';
import { AppImage } from '@/components/images/AppImage';
import type { ImageDto } from '@/types';
import {
  ADMIN_PROFILE_AVATAR_LIST_INTERACTIVE_SX,
  ADMIN_PROFILE_AVATAR_READONLY_SX,
} from '@/styles/presets/profile-image';

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

export function AdminUsers() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { confirm } = useConfirm();
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ image: ImageDto; alt: string } | null>(null);
  const isAdmin = hasRole(user, 'admin');
  const isManager = hasRole(user, 'manager');

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['admin', 'users', page, ADMIN_PAGE_SIZE_DEFAULT],
    queryFn: () => adminApi.listUsers({ page, pageSize: ADMIN_PAGE_SIZE_DEFAULT }),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
    onError: (e) => setError(getGenericErrorMessage(e)),
  });

  const pagination = data?.pagination;
  const visibleUsers =
    data?.items.filter((item) => isAdmin || (isManager && item.role === 'user')) ?? [];

  return (
    <Box>
      <Typography variant="h4" sx={ADMIN_USERS_TITLE_SX}>
        Users
      </Typography>
      {error ? (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      ) : null}
      {isLoading ? <CircularProgress /> : null}
      {queryError ? <Alert severity="error">{getGenericErrorMessage(queryError)}</Alert> : null}
      {data ? (
        <>
          <Box sx={ADMIN_USERS_GRID_SX}>
            {visibleUsers.map((u) => {
              const canManage = isAdmin || (isManager && u.role === 'user');
              return (
                <Card
                  key={u.id}
                  sx={ADMIN_USER_CARD_SX}
                >
                  <CardContent
                    sx={ADMIN_USER_CARD_CONTENT_SX}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        alt={`${u.firstName} ${u.lastName}`.trim() || 'User profile'}
                        onClick={() => {
                          if (u.profileImage) {
                            setPreview({
                              image: u.profileImage,
                              alt: `${u.firstName} ${u.lastName}`.trim() || 'User profile',
                            });
                          }
                        }}
                        sx={
                          u.profileImage
                            ? ADMIN_PROFILE_AVATAR_LIST_INTERACTIVE_SX
                            : ADMIN_PROFILE_AVATAR_READONLY_SX
                        }
                      >
                        {u.profileImage ? (
                          <AppImage
                            image={u.profileImage}
                            alt={`${u.firstName} ${u.lastName}`.trim() || 'User profile'}
                            preset="profile"
                            useThumbnail
                            fill
                            sizes="88px"
                          />
                        ) : (
                          <PersonOutlineRoundedIcon fontSize="large" />
                        )}
                      </Avatar>
                      <Box sx={ADMIN_USER_CARD_IDENTITY_SX}>
                        <Typography variant="h6">
                          {u.firstName} {u.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {u.role} · {u.status}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider />
                    <Typography variant="body2">
                      <strong>User ID:</strong> {u.id}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {u.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email verified:</strong> {u.emailVerified ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Profile created:</strong> {formatDate(u.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Profile last edited:</strong> {formatDate(u.updatedAt)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Count of logs:</strong> {u.countOfLogs ?? '—'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last login:</strong> {formatDate(u.lastTimeLogin)}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <Stack direction="row" spacing={1} justifyContent="center" sx={ADMIN_USER_CARD_ACTIONS_SX}>
                    {canManage ? (
                      <Button component={Link} href={`/admin/users/${u.id}`} variant="contained" sx={BUTTON_STYLES.primary}>
                        Edit user
                      </Button>
                    ) : null}
                    {canManage ? (
                      <Button
                        color="error"
                        sx={BUTTON_STYLES.dangerText}
                        onClick={() =>
                          void confirm(
                            'Are you sure you want to delete this user?',
                            'Delete Confirmation',
                          ).then((confirmed) => {
                            if (confirmed) deleteMutation.mutate(u.id);
                          })
                        }
                      >
                        Delete
                      </Button>
                    ) : null}
                  </Stack>
                </Card>
              );
            })}
          </Box>
          {visibleUsers.length === 0 ? <Typography>WELCOME!</Typography> : null}
        </>
      ) : null}
      <ImageLightbox
        images={preview ? [preview.image] : []}
        index={preview ? 0 : null}
        alt={preview?.alt ?? 'User profile'}
        onIndexChange={() => undefined}
        onClose={() => setPreview(null)}
      />
      {pagination && (pagination.totalPages ?? 0) > 1 ? (
        <Box sx={ADMIN_USERS_PAGINATION_SX}>
          <Button sx={ADMIN_PAGINATION_BUTTON_SX} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Typography>
            Page {page} of {pagination.totalPages}
          </Typography>
          <Button
            sx={ADMIN_PAGINATION_BUTTON_SX}
            disabled={page >= (pagination.totalPages ?? 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
