import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreenApp from '../screens/HomeScreenApp';

import QRScannerScreen from '../screens/QRScannerScreen';
import HomeScreen from '../screens/HomeScreen';
import FaultListScreen from '../screens/FaultListScreen';
import JobManagerScreen from '../screens/JobManagerScreen';
import JobManagerScreenApp from '../screens/JobManagerScreenApp';
import DriveDetailScreenApp from '../screens/DriveDetailScreenApp';
import FaultListScreenApp from '../screens/FaultListScreenApp';
import PersonCenterScreen from '../screens/PersonCenterScreen';

import SettingsScreen from '../screens/SettingsScreen';
import NativeMessageModalScreen from '../screens/NativeMessageModalScreen';
import SocketMessageModalScreen from '../screens/SocketMessageModalScreen';
import OLMapTestScreen from '../screens/OLMapTestScreen';



const Stack = createStackNavigator();

const RootRouter = () => {

  return (


    <NavigationContainer>
      <StackS />
    </NavigationContainer>
  );
};

function StackS () {




  return <Stack.Navigator
    initialRouteName="LoginScreen"
  >

    <Stack.Screen name="OLMapTestScreen" component={OLMapTestScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="NativeMessageModalScreen" component={NativeMessageModalScreen} />
    <Stack.Screen name="SocketMessageModalScreen" component={SocketMessageModalScreen} />


    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PersonCenterScreen" component={PersonCenterScreen} options={{ headerShown: false }} />

    <Stack.Screen name="FaultListScreenApp" component={FaultListScreenApp} options={{ headerShown: false }} />
    <Stack.Screen name="FaultListScreen" component={FaultListScreen} options={{ headerShown: false }} />

    <Stack.Screen name="DriveDetailScreenApp" component={DriveDetailScreenApp} options={{ headerShown: false }} />

    <Stack.Screen name="JobManagerScreen" component={JobManagerScreen} options={{ headerShown: false }} />
    <Stack.Screen name="JobManagerScreenApp" component={JobManagerScreenApp} options={{ headerShown: false }} />
    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HomeScreenApp" component={HomeScreenApp} options={{ headerShown: false }} />
    <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
}


export default RootRouter;
