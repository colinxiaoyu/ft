import React, { useState } from "react";

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { px, width } from '../utils/ScreenUtils';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraPermission } from 'react-native-vision-camera'
import LogoutModal from "./LogoutModal";

// 不带车辆状态的头部
const HomeHeaderApp = (props) => {

  const navigation = useNavigation()

  const { style, hiddenRight = false } = props;

  const [showModal, setShowModal] = useState(false)

  function handleSure () {
    navigation.popToTop()
    navigation.replace('LoginScreen')
  }

  async function handleScan () {

    const cameraPermission = Camera.getCameraPermissionStatus()

    if (cameraPermission === 'granted') {
      navigation.navigate('QRScannerScreen')
    } else {
      const permission = await Camera.requestCameraPermission()
      if (permission === 'denied') await Linking.openSettings()
    }
  }

  return <View style={[styles.header, style]}>
    <Image style={styles.headerLeft} source={require('../assets/icon_logo.png')} />

    {!hiddenRight ? <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerRightContainer} onPress={() => navigation.navigate('JobManagerScreenApp')}>
        <Image source={require('../assets/icon_menu.png')} style={styles.headerRightImg} />
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.headerRightContainer} onPress={handleScan}>
        <Image source={require('../assets/icon_scan.png')} style={styles.headerRightImg} />
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.headerRightContainer} onPress={() => navigation.navigate('PersonCenterScreen')}>
        <Image source={require('../assets/icon_head.png')} style={styles.headerRightImg} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerRightContainer} onPress={() => setShowModal(true)}>
        <Image source={require('../assets/icon_exit.png')} style={styles.headerRightImg} />
      </TouchableOpacity>
    </View> : null}

    {showModal && <LogoutModal
      visible={showModal}
      content={`退出后不会删除任何历史数据
下次登录后依然可使用本账号`}
      handleSure={handleSure}
      handleCancel={() => setShowModal(false)} />}
  </View>
}

export default HomeHeaderApp

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: px(14),
    paddingHorizontal: px(68),
  },
  headerLeft: {
    width: px(180),
    height: px(58),
  },
  headerCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerCenterImage: {
    width: px(48),
    height: px(48),
    marginRight: px(20),
  },
  headerCenterText: {
    fontWeight: 'bold',
    fontSize: px(24),
    color: '#333333',
    marginRight: px(20),
  },
  headerCenterStatus: {
    width: px(117),
    backgroundColor: 'rgba(19, 206, 102, 0.08)',
    borderRadius: px(8),
    borderWidth: 1,
    borderColor: '#13CE66',
    marginRight: px(50),
  },
  headerCenterStatusText: {
    fontWeight: 'bold',
    fontSize: px(22),
    color: '#13CE66',
    lineHeight: px(42),
    textAlign: 'center',
  },
  headerCenterAlert: {
    height: px(34),
    backgroundColor: 'rgba(19,206,102,0.1)',
    borderRadius: px(30),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopLeftRadius: px(15),
    borderBottomLeftRadius: px(15),
  },
  headerCenterAlertImg: {
    width: px(30),
    height: px(30),
    borderRadius: px(15),
  },
  headerCenterAlertText: {
    fontWeight: 'bold',
    fontSize: px(20),
    color: '#13CE66',
    lineHeight: px(34),
    textAlign: 'center',
    marginHorizontal: px(10),
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  headerRightContainer: {
    paddingHorizontal: px(20),

  },
  headerRightImg: {
    width: px(54),
    height: px(54),
  },


});