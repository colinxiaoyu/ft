import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import { height, px, width } from '../utils/ScreenUtils';
import HomeHeader from '../UIcomponents/HomeHeader';
import DetailInfo from '../UIcomponents/DetailInfo';
import BackCom from '../components/BackCom';
import { action, filterDataBybId } from '../utils';
import { connect } from 'react-redux';
import DashbordApp from '../UIcomponents/DashbordApp';
import HomeWebView from '../UIcomponents/HomeWebView';


const DriveDetailScreenApp = (props) => {


  const { vehDetail, jobPath, vinObj, refreshCount, homeRefreshFalg } = props

  const veh = props.route.params.data;

  useEffect(() => {
    props.dispatch(action('homeScreenAppModal/getVehList'));
    props.dispatch(action('driveDetailScreenAppModal/getVehDetail', { vin: veh.vin }));
  }, [refreshCount])

  const selectedJobPath = useMemo(() => {
    return filterDataBybId(jobPath, veh.vin)
  }, [jobPath, veh])

  const selectedVinObj = useMemo(() => {
    return vinObj?.filter((value, key) => key === veh.vin)
  }, [vinObj])

  //
  return (
    <View style={styles.container}>
      <HomeHeader style={styles.header} selectedVinObj={vinObj?.get(veh?.vin)} />

      <HomeWebView
        homeRefreshFalg={homeRefreshFalg}
        mapKey={'DriveDetailScreenApp'}
        style={styles.bigScreen}
        data={selectedVinObj}
        jobPath={selectedJobPath}
        isFollow={true}
        />

      <View style={styles.back}>
        <BackCom title='车辆详情' />
      </View>
      <DetailInfo vinObj={selectedVinObj?.get(veh.vin)} selectedJobPath={selectedJobPath?.[veh.vin]} />
      <DashbordApp data={vehDetail} vinObj={selectedVinObj?.get(veh.vin)} />
    </View>
  );
};


export default connect(({
  configModal: { refreshCount },
  driveDetailScreenAppModal: { vehDetail, },
  homeScreenAppModal: { jobPath, homeRefreshFalg },
  messageModal: { vinObj } }) => ({
    vehDetail, vinObj, jobPath, refreshCount, homeRefreshFalg
  }))(DriveDetailScreenApp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'unset'
  },
  bigScreen: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    top: px(102),
    left: px(20),
    backgroundColor: '#fff',
    width: px(466),
    paddingHorizontal: px(7),
    // backgroundColor: 'red',
    borderRadius: px(16),
  },



});



