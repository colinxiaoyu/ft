import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { height, px, width } from '../utils/ScreenUtils';
import HomeHeaderApp from '../UIcomponents/HomeHeaderApp';
import HomeCarList from '../UIcomponents/HomeCarList';
import HomeRightApp from '../UIcomponents/HomeRightApp';
import { connect } from 'react-redux';
import HomeWebView from '../UIcomponents/HomeWebView';
import { action } from '../utils';
import { useFocusEffect } from '@react-navigation/native';
import { closeWs, connectWebSocket } from '../services/socketS';
import HomeRightNewTaskApp from '../UIcomponents/HomeRightNewTaskApp';

const HomeScreenApp = (props) => {

  const { jobPath, vinObj, currentVin, refreshCount, vehList, jobBeforeAfterList, projectId, faultObj, homeRefreshFalg } = props


  useFocusEffect(
    useCallback(() => {
      props.dispatch(action('homeScreenAppModal/getVehList'));

    }, [refreshCount])
  );


  // useEffect(() => {

  //   setTimeout(() => {
  //     props.dispatch(action('messageModal/faultMessage', testData.payload));
  //   }, 5000);
  // }, [])

  useEffect(() => {
    connectWebSocket(projectId, handleSocket)
    return () => closeWs()
  }, [projectId])

  function handleSocket (message) {


    if (message.type === 'RESULT' && message.businessType === 'VEH_REAL') {

      message.payload.timestamp = null // 不比对此字段

      props.dispatch(action('messageModal/vehMessage', message.payload));
    } else if (message.type === 'RESULT' && message.businessType === 'JOB_CHANGE') {

      props.dispatch(action('configModal/refesh',)); // 任务状态变更刷新页面

    } else if (message.type === 'RESULT' && message.businessType === 'VEH_FAULT') {
      props.dispatch(action('messageModal/faultMessage', message.payload));
    }
  }

  function handleClickCar (car) {
    props.dispatch(action('homeScreenAppModal/save', { currentVin: car }))
  }


  return (
    <View style={styles.screenContainer}>
      <HomeWebView
        homeRefreshFalg={homeRefreshFalg}
        mapKey={'HomeScreenApp'}
        style={styles.bigScreen}
        data={vinObj}
        jobBeforeAfterList={jobBeforeAfterList}
        faultObj={faultObj}
        jobPath={jobPath} onClickCar={handleClickCar} />
      <HomeHeaderApp />

      <HomeCarList vehList={vehList} vinObj={vinObj} />

      <HomeRightNewTaskApp />

      {currentVin && <HomeRightApp data={jobPath[currentVin]} faultData={faultObj[currentVin]} vehStatus={vinObj.getIn([currentVin, 'vehStatus'])} />}

    </View>
  );
};


export default connect(({ homeScreenAppModal: { jobPath, currentVin, vehList, jobBeforeAfterList, homeRefreshFalg }, messageModal: { vinObj, faultObj }, configModal: { refreshCount, projectId } }) => ({
  jobPath, currentVin, vinObj, faultObj, refreshCount, vehList, jobBeforeAfterList, projectId, homeRefreshFalg
}))(HomeScreenApp);


const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    position: 'relative',
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
});

export const testData = {
  "type": "RESULT",
  "businessType": "VEH_FAULT",
  "payload": [
    {
      "tenantId": "0",
      "faultBit": 22,
      "faultType": "规划",
      "faultName": "山东省潍坊市奎文区樱前街多功能汽车厂停车场",
      "faultDesc": "山东省潍坊市奎文区樱前街多功能汽车厂停车场",
      "faultCode": "4194304",
      "status": 0,
      "isIgnore": 1,
      "faultNo": "GZ1898955136962760704",
      "deviceId": "XXHPT1D2022101801",
      "startTime": "2025-03-10 12:32:39",
      "location": {
        "lon": 119.28085902217357,
        "lat": 36.69408609075882,
        "pointFeature": "119.28085902217357_36.69408609075882"
      },
      "projectId": "1865994966275584002",
      "vehInstanceId": "vehicle1869635328737357824",
      "vin": "XXHPT1D2022101801",
      "ext": "{\"timestamp\":1741581159958,\"vehicleId\":\"XXHPT1D2022101801\",\"position\":{\"lon\":119.28085902217357,\"lat\":36.69408609075882,\"pointFeature\":\"119.28085902217357_36.69408609075882\"},\"velocity\":244,\"heading\":72.107,\"pathId\":65535,\"pathProgress\":255,\"actionCode\":\"unloadCargo\",\"actionValue\":1,\"soc\":7800,\"driveMode\":1,\"tapPos\":31,\"endurance\":4.294967295E9,\"scramFlag\":0,\"vehFault\":4194304}",
      "license": "XX101801",
      "locationText": "山东省潍坊市奎文区樱前街多功能汽车厂停车场"
    }
  ]
}


