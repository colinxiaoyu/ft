import React, { useState } from "react";

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { px, width } from '../utils/ScreenUtils';
import { useNavigation } from "@react-navigation/native";
import LogoutModal from "./LogoutModal";
import { connect } from "react-redux";
import { getVehStatus } from "../utils";


// 车载端 首页头部信息
const HomeVinHeader = (props) => {

  const { style, currentVin, vinObj } = props;


  const navigation = useNavigation()

  const [showModal, setShowModal] = useState(false)

  function handleSure () {
    navigation.popToTop()
    navigation.replace('LoginScreen')
  }


  const renderTag = () => {
    const selectedVinObj = vinObj.get(currentVin)

    const status = selectedVinObj?.get('vehStatus')
    switch (status) {
      case 1:
        return <View style={[styles.status, styles.bold, {
          backgroundColor: 'rgba(153,153,153,0.1)',
          borderColor: '#999'
        }]}>
          <Text style={[styles.text22, { color: '#999999', }]}>{getVehStatus(status)}</Text>
        </View>

      case 2:
        return <View style={[styles.status, styles.bold, {
          backgroundColor: 'rgba(19,206,102,0.2)',
          borderColor: '#13CE66'

        }]}>
          <Text style={[styles.text22, { color: '#13CE66', }]}>{getVehStatus(status)}</Text>
        </View>

      case 0:
        return <View style={[styles.status, styles.bold, {
          backgroundColor: 'rgba(19,206,102,0.2)',
          borderColor: '#999'
        }]}>
          <Text style={[styles.text22, { color: '#999999', }]}>{getVehStatus(status)}</Text>
        </View>

    }
  }


  return <View style={[styles.header, style]}>
    <Image style={styles.headerLeft} source={require('../assets/icon_logo.png')} />
    <View style={styles.headerCenter}>
      <Image style={styles.headerCenterImage} source={require('../assets/icon_car_s.png')} />
      <Text style={styles.headerCenterText}>{currentVin}</Text>
      {renderTag()}
      <View style={styles.headerCenterAlert}>
        <Image style={styles.headerCenterAlertImg} source={require('../assets/icon_securitytest_ok.png')} />
        <Text style={styles.headerCenterAlertText}>车辆自检完成</Text>
      </View>
    </View>
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerRightContainer} onPress={() => navigation.navigate('PersonCenterScreen')}>
        <Image source={require('../assets/icon_head.png')} style={styles.headerRightImg} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerRightContainer} onPress={() => setShowModal(true)}>
        <Image source={require('../assets/icon_exit.png')} style={styles.headerRightImg} />
      </TouchableOpacity>
    </View>
    {showModal && <LogoutModal
      visible={showModal}
      content={`退出后不会删除任何历史数据
    下次登录后依然可使用本账号`}
      handleSure={handleSure}
      handleCancel={() => setShowModal(false)} />}
  </View>
}




export default connect(({ configModal: { currentVin, }, messageModal: { vinObj } }) => ({
  currentVin, vinObj
}))(HomeVinHeader);

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

  status: {
    width: px(100),
    height: px(38),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(16),
    borderWidth: 1,
    borderRadius: px(8),
    marginRight: px(51),
  },
  bold: {
    fontWeight: 'bold',
  },
  textGreen: {

  },
  textBlue: {
    color: '#2D7EF8',
  },
  textGreey: {

  },
  textArrive: {

  },
  greenBg: {

  },

  unUseBg: {

  },
  text22: {
    fontWeight: 500,
    fontSize: px(22),
    color: '#333333',
  },

  arriveBg: {

  }
});