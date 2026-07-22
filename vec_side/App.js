import React, { useEffect, useState } from 'react';
import Orientation from 'react-native-orientation-locker';
import AppWrapper from './src/AppWrapper';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeuuid } from './src/utils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-native-paper';
import * as Sentry from '@sentry/react-native';


Sentry.init({
  dsn: 'https://5606e59dfb171fa736c9ce4843951556@o4509121982431232.ingest.us.sentry.io/4509121991999488',


  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

function App () {
  useEffect(() => {
    Orientation.lockToLandscape();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  // 加载配置
  const loadConfig = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem('user_config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        // 如果没有配置，使用默认值
        setConfig({
          web3DUrl: 'https://icv.foton.com.cn/cross/app/3dmap/',
          BASE_URL: 'https://icv.foton.com.cn/foton/job/les',
          BASE_URL1: 'https://icv.foton.com.cn/foton',
          socketUrl: `wss://icv.foton.com.cn/foton/job/jobScheduling/realtime/${makeuuid()}`,
          vcTcp: '192.168.2.101',
          vcTcpPort: 5000,
        });
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  };

  if (!config) {
    return (
      <View>
        <Text>Loading configuration...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <Provider>
        <AppWrapper />
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App


