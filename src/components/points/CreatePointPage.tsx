'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, Box, Card, CircularProgress } from '@mui/material';
import { tripApi } from '@/api/trips';
import { pointApi } from '@/api/points';
import { PointForm } from '@/components/points/PointForm';
import { PointList } from '@/components/points/PointList';
import { PointLocationPicker } from '@/components/maps/PointLocationPicker';
import { useConfirm } from '@/components/common/ConfirmDialog';
import { getGenericErrorMessage } from '@/lib/errors';
import { buildTripUrl } from '@/lib/tripUrl';
import type { TripGroupResponse, TripPoint } from '@/types';
import { POINT_FORM_PANEL_WITH_TOP_MARGIN_SX } from '@/styles/presets/forms';
import {
  CREATE_POINT_PAGE_SX,
  CREATE_POINT_GRID_SX,
  CREATE_POINT_LIST_COLUMN_SX,
  CREATE_POINT_EDITOR_COLUMN_SX,
  CREATE_POINT_LOADING_SX,
  CREATE_POINT_ERROR_ALERT_SX,
} from '@/styles/presets/layouts';

export function CreatePointPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirm } = useConfirm();
  const tripGroupId = Number(searchParams.get('tripGroupId'));
  const tripId = Number(searchParams.get('tripId'));
  const [tripGroup, setTripGroup] = useState<TripGroupResponse | null>(null);
  const [dayNumber, setDayNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pointLatitude, setPointLatitude] = useState('');
  const [pointLongitude, setPointLongitude] = useState('');
  const [findInMapTrigger, setFindInMapTrigger] = useState(0);
  const [mapSearchSelection, setMapSearchSelection] = useState<{
    name: string;
    revision: number;
  } | null>(null);

  const selectedDay = useMemo(
    () => tripGroup?.days.find((day) => day.id === tripId) ?? null,
    [tripGroup, tripId],
  );

  async function refreshTrip(): Promise<void> {
    const result = await tripApi.getTrip(tripGroupId);
    const day = result.days.find((item) => item.id === tripId);
    if (!day) {
      throw new Error('The requested trip does not belong to this trip group.');
    }
    setTripGroup(result);
    setDayNumber(day.dayNumber);
  }

  useEffect(() => {
    if (
      !Number.isSafeInteger(tripGroupId) ||
      tripGroupId < 1 ||
      !Number.isSafeInteger(tripId) ||
      tripId < 1
    ) {
      setError('A valid tripGroupId and tripId are required.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    tripApi
      .getTrip(tripGroupId)
      .then((result) => {
        if (cancelled) return;
        const selectedTrip = result.days.find((day) => day.id === tripId);
        if (!selectedTrip) {
          setError('The requested trip does not belong to this trip group.');
          return;
        }
        setTripGroup(result);
        setDayNumber(selectedTrip.dayNumber);
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
  }, [tripGroupId, tripId]);

  function handleBack(): void {
    if (tripGroup && dayNumber !== null) {
      router.replace(buildTripUrl(tripGroup.id, dayNumber));
      router.refresh();
      return;
    }
    router.replace('/trips');
  }

  async function handlePointSaved(): Promise<void> {
    setSaving(true);
    setError(null);
    try {
      await refreshTrip();
      setMapSearchSelection(null);
      setPointLatitude('');
      setPointLongitude('');
    } catch (requestError) {
      setError(getGenericErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePoint(point: TripPoint): Promise<void> {
    const accepted = await confirm(
      `Are you sure you want to delete "${point.name}"?`,
      'Delete Confirmation',
    );
    if (!accepted) return;

    setError(null);
    try {
      await pointApi.deletePoint(point.id);
      await refreshTrip();
    } catch (requestError) {
      setError(getGenericErrorMessage(requestError));
    }
  }

  async function handleMovePoint(point: TripPoint, direction: 'up' | 'down'): Promise<void> {
    if (!selectedDay || saving || !point.permissions.canEdit) return;

    const orderedPoints = [...selectedDay.points].sort(
      (first, second) => first.pointNumber - second.pointNumber,
    );
    const currentIndex = orderedPoints.findIndex((item) => item.id === point.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedPoints.length) return;

    const pointIds = orderedPoints.map((item) => item.id);
    const currentPointId = pointIds[currentIndex];
    const targetPointId = pointIds[targetIndex];
    if (currentPointId === undefined || targetPointId === undefined) return;

    pointIds[currentIndex] = targetPointId;
    pointIds[targetIndex] = currentPointId;

    setSaving(true);
    setError(null);
    try {
      const reorderedPoints = await pointApi.reorderPoints(tripId, { pointIds });
      setTripGroup((current) => {
        if (!current) return current;

        return {
          ...current,
          days: current.days.map((day) =>
            day.id === tripId ? { ...day, points: reorderedPoints } : day,
          ),
        };
      });
    } catch (requestError) {
      setError(getGenericErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box sx={CREATE_POINT_LOADING_SX}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !tripGroup) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!tripGroup || !selectedDay || dayNumber === null) {
    return <Alert severity="error">The requested trip could not be loaded.</Alert>;
  }

  return (
    <Box sx={CREATE_POINT_PAGE_SX}>
      {error ? (
        <Alert severity="error" sx={CREATE_POINT_ERROR_ALERT_SX} onClose={() => setError(null)}>
          {error}
        </Alert>
      ) : null}

      <Box
        sx={CREATE_POINT_GRID_SX}
      >
        <Box sx={CREATE_POINT_LIST_COLUMN_SX}>
          <PointList
            points={selectedDay.points}
            onEdit={(point) => router.push(`/points/edit/${point.id}`)}
            onDelete={(point) => void handleDeletePoint(point)}
            onMove={(point, direction) => void handleMovePoint(point, direction)}
            disabled={saving}
          />
        </Box>

        <Box
          sx={CREATE_POINT_EDITOR_COLUMN_SX}
        >
          <PointLocationPicker
            latitude={pointLatitude}
            longitude={pointLongitude}
            findInMapTrigger={findInMapTrigger}
            onChange={(latitude, longitude) => {
              setPointLatitude(latitude);
              setPointLongitude(longitude);
            }}
            onAddressSelect={(name) =>
              setMapSearchSelection((current) => ({ name, revision: (current?.revision ?? 0) + 1 }))
            }
          />

          <Card
            sx={POINT_FORM_PANEL_WITH_TOP_MARGIN_SX}
          >
            <PointForm
              tripGroupId={tripGroup.id}
              tripId={tripId}
              latitude={pointLatitude}
              longitude={pointLongitude}
              mapSearchSelection={mapSearchSelection}
              onLocationChange={(latitude, longitude) => {
                setPointLatitude(latitude);
                setPointLongitude(longitude);
              }}
              onFindInMap={() => setFindInMapTrigger((current) => current + 1)}
              onAddNextDay={() => router.push(`/trips/create?tripGroupId=${tripGroup.id}`)}
              onBack={handleBack}
              onDone={() => void handlePointSaved()}
            />
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
