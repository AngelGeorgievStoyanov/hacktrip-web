'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Alert, Box, Card, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { pointApi } from '@/api/points';
import { PointForm } from '@/components/points/PointForm';
import { AppImage } from '@/components/images/AppImage';
import { SocialObjectPlaceholder } from '@/components/placeholders';
import { RemoveImageIcon } from '@/constants/icons';
import { useConfirm } from '@/components/common/ConfirmDialog';
import { PointLocationPicker } from '@/components/maps/PointLocationPicker';
import { getGenericErrorMessage } from '@/lib/errors';
import type { SocialImageDto, TripPoint } from '@/types';
import {
  EDIT_POINT_PAGE_SX,
  EDIT_POINT_LOADING_SX,
  EDIT_POINT_ERROR_SX,
  EDIT_POINT_MAP_WRAPPER_SX,
  EDIT_POINT_CONTENT_ROW_SX,
  EDIT_POINT_FORM_CARD_SX,
  EDIT_POINT_IMAGES_SECTION_SX,
  getEditPointImageGridSx,
  EDIT_POINT_IMAGE_TILE_SX,
  EDIT_POINT_IMAGE_DELETE_SX,
  EDIT_POINT_IMAGE_PLACEHOLDER_SX,
} from '@/styles/presets/forms';

export function EditPointPage() {
  const router = useRouter();
  const { confirm } = useConfirm();
  const params = useParams<{ pointId: string }>();
  const pointId = Number(params.pointId);
  const [point, setPoint] = useState<TripPoint | null>(null);
  const [existingImages, setExistingImages] = useState<SocialImageDto[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [findInMapTrigger, setFindInMapTrigger] = useState(0);
  const [mapSearchSelection, setMapSearchSelection] = useState<{
    name: string;
    revision: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isSafeInteger(pointId) || pointId < 1) {
      setError('A valid point ID is required.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    pointApi
      .getPoint(pointId)
      .then((result) => {
        if (cancelled) return;
        if (!result.permissions.canEdit) {
          setError('You do not have permission to edit this point.');
          return;
        }
        setPoint(result);
        setExistingImages(result.images ?? []);
        setLatitude(result.lat == null ? '' : String(result.lat));
        setLongitude(result.lng == null ? '' : String(result.lng));
      })
      .catch((requestError) => {
        if (!cancelled) setError(getGenericErrorMessage(requestError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pointId]);

  async function handleDeleteImage(image: SocialImageDto): Promise<void> {
    const accepted = await confirm(
      'Are you sure you want to delete this image?',
      'Delete Confirmation',
    );
    if (!accepted) return;

    setDeletingImageId(image.id);
    setError(null);
    try {
      await pointApi.deletePointImage(pointId, image.id);
      setExistingImages((current) => current.filter((item) => item.id !== image.id));
    } catch (requestError) {
      setError(getGenericErrorMessage(requestError));
    } finally {
      setDeletingImageId(null);
    }
  }

  if (loading) {
    return (
      <Box sx={EDIT_POINT_LOADING_SX}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !point) return <Alert severity="error">{error}</Alert>;
  if (!point) return <Alert severity="error">The point could not be loaded.</Alert>;

  return (
    <Box
      sx={EDIT_POINT_PAGE_SX}
    >
      {error ? (
        <Alert severity="error" sx={EDIT_POINT_ERROR_SX}>
          {error}
        </Alert>
      ) : null}
      <Box sx={EDIT_POINT_MAP_WRAPPER_SX}>
        <PointLocationPicker
          latitude={latitude}
          longitude={longitude}
          findInMapTrigger={findInMapTrigger}
          onChange={(nextLatitude, nextLongitude) => {
            setLatitude(nextLatitude);
            setLongitude(nextLongitude);
          }}
          onAddressSelect={(name) =>
            setMapSearchSelection((current) => ({ name, revision: (current?.revision ?? 0) + 1 }))
          }
        />
      </Box>
      <Box sx={EDIT_POINT_CONTENT_ROW_SX}>
        <Card
          sx={EDIT_POINT_FORM_CARD_SX}
        >
          <PointForm
            key={point.id}
            tripGroupId={0}
            tripId={point.tripId}
            point={point}
            existingImages={existingImages}
            latitude={latitude}
            longitude={longitude}
            mapSearchSelection={mapSearchSelection}
            onLocationChange={(nextLatitude, nextLongitude) => {
              setLatitude(nextLatitude);
              setLongitude(nextLongitude);
            }}
            onFindInMap={() => setFindInMapTrigger((current) => current + 1)}
            onAddNextDay={() => undefined}
            onBack={() => router.back()}
            onDone={() => router.back()}
          />
        </Card>

        <Box sx={EDIT_POINT_IMAGES_SECTION_SX}>
          {existingImages.length > 0 ? (
            <Box
              sx={getEditPointImageGridSx(existingImages.length)}
            >
              {existingImages.map((image) => (
                <Box
                  key={image.id}
                  sx={EDIT_POINT_IMAGE_TILE_SX}
                >
                  <AppImage
                    image={image}
                    alt={point.name}
                    preset="editorPointThumb"
                    fill
                    sizes="(max-width: 600px) 30vw, 160px"
                  />
                  <Tooltip title="Delete image" arrow>
                    <span>
                      <IconButton
                        aria-label={`Delete image ${image.id}`}
                        onClick={() => void handleDeleteImage(image)}
                        disabled={deletingImageId !== null}
                        size="small"
                        sx={EDIT_POINT_IMAGE_DELETE_SX}
                      >
                        <RemoveImageIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={EDIT_POINT_IMAGE_PLACEHOLDER_SX}>
              <SocialObjectPlaceholder />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
