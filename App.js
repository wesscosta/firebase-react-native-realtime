import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TRACKING = "LOCATION_TASK_NAME"
let listLocation = [];

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log('LOCATION_TRACKING task ERROR:', error);
    return;
  }
  if (data) {
    const { locations } = data;

    listLocation.push({
      timestamp: locations[0].timestamp,
      latitude: locations[0].coords.latitude,
      longitude: locations[0].coords.longitude,
    });
       
    console.log(listLocation);
    
    // console.log(
    //   `${new Date(Date.now()).toLocaleString()}: ${locations[0].coords.latitude},${locations[0].coords.longitude}`
    // );

  }
});

export default function App() {
  // Configuração firebase e commit no banco
  const firebaseConfig = {
    apiKey: "AIzaSyAPuDIoGr3KVLd1uBXRLAsFwErr7ZT09mw",
    authDomain: "realtimelocation-45737.firebaseapp.com",
    projectId: "realtimelocation-45737",
    storageBucket: "realtimelocation-45737.appspot.com",
    messagingSenderId: "752695329557",
    appId: "1:752695329557:web:53a46cdf2397383faa1f1c"
  };
  
  initializeApp(firebaseConfig);
  
  function storeHighScore(userId="user123") {
    const db = getDatabase();
    const reference = ref(db, 'users/' + userId);   
    set(reference, {
      location: listLocation
      // latitude: locations[0].coords.latitude,
      // longitude: locations[0].coords.longitude,
    });
  }

   // Request permissions right after starting the app
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
      timeInterval: 5000,
      distanceInterval: 0,
    });
    // Localização em segundo plano
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING

    );
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
  
  window.setInterval(storeHighScore, 10000);
  
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

