import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import { ref, set, push, child } from 'firebase/database';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { database } from './firebaseConfig';

const LOCATION_TRACKING = "LOCATION_TASK_NAME"

export default function App() {
  TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
    if (error) {
      console.log('LOCATION_TRACKING task ERROR:', error);
      return;
    }
    if (data) {
      const {
        timestamp, coords: { latitude, longitude }
      } = data.locations[0];
      
      const newLocation = { timestamp, latitude, longitude };
      
      try {
        storeUserLocation("user123", newLocation)
        console.log('Salvo:', newLocation);

      } catch (error) {
        // console.log(error);
      }
    }
  });
  
  async function storeUserLocation(userId, location) {
    const reference = ref(database, `users/${userId}/coords`)
    await push(reference, { userId, ...location });
  }

   useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync()
      if (foreground.granted) await Location.requestBackgroundPermissionsAsync()
    }

    requestPermissions()
  }, [])

  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 10000,
      distanceInterval: 0,
    });

    // Localização em segundo plano
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
    console.log('tracking started?', hasStarted);
  };

    // Stop location tracking in background
  const stopLocationTracking = async () => {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TRACKING

      )
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TRACKING)
        console.log("Location tacking stopped")
      }
  };
  
  return (
    <View style={styles.container}>
      <Button
        onPress={startLocationTracking}
        title="Start in background"
        color="green"
      />
      <View style={styles.separator} />
      <Button
        onPress={stopLocationTracking}
        title="Stop in background"
        color="red"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
