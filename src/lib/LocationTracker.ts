import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { incrementAtScore } from './ActivityTracker';
import { supabase } from './supabase';

const LOCATION_TASK_NAME = 'background-location-task';

let lastLocation: Location.LocationObject | null = null;

const calculateDistance = (loc1: Location.LocationObject, loc2: Location.LocationObject) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.coords.latitude - loc1.coords.latitude);
  const dLon = toRad(loc2.coords.longitude - loc1.coords.longitude);
  const lat1 = toRad(loc1.coords.latitude);
  const lat2 = toRad(loc2.coords.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: TaskManager.TaskManagerTaskBody) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user && locations.length > 0) {
      const newLocation = locations[0];
      if (lastLocation) {
        const distance = calculateDistance(lastLocation, newLocation);
        if (distance > 0.01) { // Only update if moved at least 10 meters
          await incrementAtScore(session.user.id, distance);
        }
      }
      lastLocation = newLocation;
    }
  }
});

export const startLocationTracking = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== 'granted') {
    console.error('Foreground location permission not granted');
    return;
  }

  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    console.error('Background location permission not granted');
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 60000, // 1 minute
    distanceInterval: 10, // 10 meters
  });
};
