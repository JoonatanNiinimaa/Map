import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import Map from './screens/Map';
import Constants from 'expo-constants';
import * as Location from "expo-location";
import MainAppBar from './components/MainAppBar';
import { PaperProvider } from 'react-native-paper';
import Settings from './screens/Settings';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import 'react-native-gesture-handler';


const Stack = createNativeStackNavigator(); // Add this line

const settings = {
  backgroundColor: '#00a484'
}

const icons = {
  location_not_known: 'crosshairs',
  location_searching: 'crosshairs-question',
  location_found: 'crosshairs-gps'
}

export default function App() {
  const [icon, setIcon] = useState(icons.location_not_known)
  const [location, setLocation] = useState({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [mapType, setMapType] = useState('standard');

  const getUserPosition = async () => {
    setIcon(icons.location_searching);
    let { status } = await Location.requestForegroundPermissionsAsync();

    try {
      if (status !== 'granted') {
        console.log('Geolocation permission denied');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        ...location,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setIcon(icons.location_found);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        await getUserPosition();
      } catch (error) {
        console.error('Error while getting user position:', error);
      }
    };

    getUserLocation();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Map'
          screenOptions={{header: (props) =>
          <MainAppBar {...props}
          backgroundColor={settings.backgroundColor}
          icon={icon}
          getUserPosition={getUserPosition}/>}}
          >
          <Stack.Screen name='Map'>
            {() =>
              <Map location={location} mapType={mapType} />
            }
          </Stack.Screen>
          <Stack.Screen name='Settings'>
            {() =>
              <Settings backgroundColor={settings.backgroundColor} mapType={mapType} setMapType={setMapType} />
            }
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>

    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0
  },
});
