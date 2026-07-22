import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { height, px, width } from '../utils/ScreenUtils';
import HomeWebView from '../UIcomponents/HomeWebView';
import HomeTaskInfo from '../UIcomponents/HomeTaskInfo';
import Home3DWebView from '../UIcomponents/Home3DWebView';

import EmergencyModal from '../UIcomponents/EmergencyModal';
import HomeDashbord from '../UIcomponents/HomeDashbord';
import { action, isEmptyObject } from '../utils';
import { connect } from 'react-redux';
import { connectToServer, useNativeMessageListener } from '../services/V2CMessageS';
import EmergencyPhysicsModal from '../UIcomponents/EmergencyPhysicsModal';
import AlertInfo from '../UIcomponents/AlertInfo';
import { fromJS } from 'immutable';
import { useFocusEffect } from '@react-navigation/native';
import HomeVinHeader from '../UIcomponents/HomeVinHeader';
import { connectWebSocket } from '../services/socketS';
import { testData } from './HomeScreenApp';
import { pubSub } from '../utils/pubsub';


const HomeScreen = (props) => {

  const { vehDetail, jobDetail, currentVin, refreshCount, VinMessage, projectId, faultObj, homeRefreshFalg } = props

  const [show3D, setshow3D] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      setshow3D(true)
      return () => {
        setshow3D(false)
      };
    }, [])
  );

  useEffect(() => {
    connectWebSocket(projectId, handleSocket)
  }, [projectId])

  function handleSocket (message) {

    if (message.type === 'RESULT' && message.businessType === 'VEH_REAL') {

      message.payload.timestamp = null

      props.dispatch(action('messageModal/vehMessage', message.payload));
    } else if (message.type === 'RESULT' && message.businessType === 'JOB_CHANGE') {

      props.dispatch(action('configModal/refesh',)); // 任务状态变更刷新页面

    } else if (message.type === 'RESULT' && message.businessType === 'VEH_FAULT') {
      props.dispatch(action('messageModal/faultMessage', message.payload));
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (currentVin) {
        props.dispatch(action('homeScreenModal/getVehDetail', { vin: currentVin }));
      }
    }, [refreshCount, currentVin])
  );


  // useEffect(() => {
  //   setInterval(() => {
  //     props.dispatch(action('configModal/refesh'))
  //   }, 3030)
  // }, [])


  const jobPath = useMemo(() => {

    return { [currentVin]: jobDetail }

  }, [jobDetail])


  const nativeVinOvj = useMemo(() => {
    if (!isEmptyObject(VinMessage)) {
      return fromJS({
        [VinMessage.vehicleId]: {
          heading: VinMessage.heading,
          longitude: VinMessage.position?.longitude,
          latitude: VinMessage.position?.latitude,
        }
      })
    }
    return null
  }, [VinMessage])

  useEffect(() => {
    // if (!__DEV__) {
    connectToServer()
    // }
  }, [])

  // 模拟数据使用 报警信息
  // useEffect(() => {

  //   setTimeout(() => {
  //     props.dispatch(action('messageModal/faultMessage', testData.payload));
  //   }, 5000);
  // }, [])

  // 模拟数据使用
  useEffect(() => {
    // let count = 1;
    // let timer
    // if (__DEV__) {
    //   timer = setInterval(() => {
    //     const testData = {
    //       ...testVinMessage, velocity: count,
    //       vehicleId: 'XXHPT1D2022101801'  // XXHPT1D2022101801  LTFKEVS7XX08261
    //     }
    //     console.log('testData.velocity', testData.velocity)
    //     count++
    //     props.dispatch(action('nativeMessageModal/vehNativeMessage', testData));
    //   }, 1000)
    // }

    // return () => timer && clearInterval(timer)
  }, [])


  useNativeMessageListener(handleNativeMessage)

  function handleNativeMessage (message) {
    // message.scramFlag = 1

    if (__DEV__) { // 用于正式环境调试数据
      message.vehicleId = "XXHPT1D2022101801"
    }

    props.dispatch(action('nativeMessageModal/vehNativeMessage', message));
  }

  const [isSmallScreen, setIsSmallScreen] = useState(true); // 控制小屏幕的位置和大小


  function onEmergencyPress () {
    if (VinMessage?.driveMode === 1) {
      pubSub.publish('showAlert', "人工驾驶模式下无法发送紧急制动指令");
      return
    }
    props.dispatch(action('nativeMessageModal/sendComandToNative', { command: "sendScramCommand" }));
  }


  // console.log('vehDetail', vehDetail)
  // 切换屏幕大小和位置
  const toggleScreen = () => {
    setIsSmallScreen(!isSmallScreen);
  };

  return (
    <View style={styles.screenContainer}>

      {show3D && <Home3DWebView style={isSmallScreen ? styles.smallScreen : styles.bigScreen} toggleScreen={toggleScreen} />}

      <HomeWebView
        homeRefreshFalg={homeRefreshFalg}
        mapKey={'HomeScreen'}
        style={!isSmallScreen ? styles.smallScreen : styles.bigScreen}
        data={nativeVinOvj}
        faultObj={faultObj}
        jobPath={jobPath}
        isFollow={true}
        />

      <HomeVinHeader />



      <TouchableOpacity style={styles.leftTop} onPress={() => onEmergencyPress()}>
        <Image style={styles.leftTopImg} source={require('../assets/button_stop.png')} />
        <Text style={styles.leftTopText}>一键紧急制动</Text>
      </TouchableOpacity>


      <HomeTaskInfo data={jobDetail} showDetail={!isEmptyObject(jobDetail)} />

      <TouchableOpacity style={styles.expand} onPress={toggleScreen}>
        <Image source={require('../assets/icon_expand.png')} style={styles.expandImg} />

      </TouchableOpacity>

      <View style={styles.alertContainer}>
        <AlertInfo data={faultObj[currentVin]} />
      </View>
      <HomeDashbord data={vehDetail} />
      <EmergencyModal />
      <EmergencyPhysicsModal />
    </View>
  );
};

export default connect(({
  homeScreenModal: { vehDetail, jobDetail, homeRefreshFalg },
  configModal: { currentVin, refreshCount, projectId }, messageModal: { faultObj },
  nativeMessageModal: { VinMessage } }) => ({
    vehDetail, jobDetail, currentVin, refreshCount, VinMessage, projectId, faultObj, homeRefreshFalg
  }))(HomeScreen);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  bigScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  smallScreen: {
    position: 'absolute',
    top: px(102),
    right: px(20),
    width: px(498),
    height: px(555),
    zIndex: 20,
  },

  leftTop: {
    width: px(466),
    height: px(72),
    backgroundColor: '#FFFFFF',
    borderRadius: px(4),
    position: 'absolute',
    top: px(102),
    left: px(20),
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftTopImg: {
    width: px(48),
    height: px(48),
    marginRight: px(16),
  },
  leftTopText: {
    fontWeight: 'bold',
    fontSize: px(24),
    color: '#333333',
  },
  expand: {
    position: 'absolute',
    top: px(580),
    right: px(49),
    zIndex: 30,
  },
  expandImg: {
    width: px(54),
    height: px(54),
  },
  alertContainer: {
    position: 'absolute',
    top: px(660),
    width: px(498),
    right: px(20),
    zIndex: 40,
  },
});

