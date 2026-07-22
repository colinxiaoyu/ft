import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import HomeHeaderApp from "../UIcomponents/HomeHeaderApp";
import BackCom from "../components/BackCom";
import { View, StyleSheet, Image, TouchableOpacity, Text, TouchableWithoutFeedback } from "react-native";
import { px } from "../utils/ScreenUtils";
import LinearGradient from "react-native-linear-gradient";
import LogoutModal from "../UIcomponents/LogoutModal";
import { connect } from "react-redux";
import { CURRENT } from "../models/configModal";
import { action } from "../utils";
import { useFocusEffect } from "@react-navigation/native";

const PersonCenterScreen = (props) => {
  const [show, setShow] = useState(false)

  const { navigation, currentApp, faultListFrist, faultListAppFirst, user, devMode } = props;

  const fault = useMemo(() => {
    if (currentApp === CURRENT.APP) {
      return faultListAppFirst
    } else {
      return faultListFrist
    }
  }, [currentApp, faultListFrist, faultListAppFirst,])

  const [showModal, setShowModal] = useState(false)

  useFocusEffect(
    useCallback(() => {
      if (currentApp === CURRENT.APP) {
        props.dispatch(action('faultListScreenAppModal/postFaultlistFirst'));
      } else {
        props.dispatch(action('faultListScreenModal/postFaultlistFirst',));
      }
    }, [])
  );


  const status = 0


  function handleSure () {
    navigation.popToTop()
    navigation.replace('LoginScreen')
  }

  function showFault () {
    setShow(!show)
  }


  function switchTo () {
    window.token = null

    props.dispatch(action('configModal/switchApp'));
    handleSure()
  }

  const [clickCount, setClickCount] = useState(0);

  function onDevPress () {
    setClickCount((prev) => prev + 1);

    // **5 次点击后启用开发者模式**
    if (clickCount + 1 === 5) {
      setClickCount(0); // **重置点击计数**
      props.dispatch(action('configModal/save', { devMode: !devMode }));
    }

    // **5 秒内未达 5 次，重置计数**
    setTimeout(() => setClickCount(0), 5000);
  }

  return <View style={styles.container}>
    <HomeHeaderApp style={styles.header} hiddenRight={true} />
    <BackCom title='个人中心' />
    <View style={[styles.row, styles.info]}>
      <View style={[styles.row,]}>
        <Image style={styles.infoImg} source={require('../assets/icon_head.png')} />
        <View>
          <View style={[styles.row]}>
            <Text style={styles.name}>{user?.user?.username}</Text>
            <TouchableWithoutFeedback onPress={onDevPress}>
              <View style={styles.jobContainer}>
                <Text style={styles.jobText}>装货工</Text>
              </View>
            </TouchableWithoutFeedback>

          </View>
          <Text style={styles.tel}>18852406542</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logout} onPress={() => setShowModal(true)}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </View>


    <TouchableOpacity style={[styles.row, styles.itemContainer]} onPress={() => {
      if (currentApp === CURRENT.APP) {
        navigation.navigate('JobManagerScreenApp')
      } else {
        navigation.navigate('JobManagerScreen')
      }
    }}>
      <View style={styles.row}>
        <Image style={styles.imgLeft} source={require('../assets/icon_tmenu.png')} />
        <Text style={styles.textLeft}> 任务信息</Text>
      </View>
      <Image style={styles.imgRight} source={require('../assets/icon_back.png')} />
    </TouchableOpacity>

    <View style={styles.itemContainer}>

      <TouchableOpacity style={[styles.row,]} onPress={() => {
        if (currentApp === CURRENT.APP) {
          navigation.navigate('FaultListScreenApp')
        } else {
          navigation.navigate('FaultListScreen')
        }
      }}>
        <View style={styles.row}>
          <Image style={styles.imgLeft} source={require('../assets/icon_alarm_1.png')} />
          <Text style={styles.textLeft}> 车辆故障信息</Text>
        </View>
        <Image style={styles.imgRight} source={require('../assets/icon_back.png')} />
      </TouchableOpacity>

      <TouchableOpacity style={[]} onPress={() => showFault()}>
        <View style={[styles.rightContent,]} >
          <Text style={[styles.text28, styles.textRed]}>当前故障信息</Text>
          <Image style={styles.topImg} source={!show ? require('../assets/icon_arrow_red.png') : require('../assets/icon_arrow_red.png')} />
        </View>

      </TouchableOpacity>

      {show && <View style={styles.baseInfo}>
        <LinearGradient
          colors={['#FFFFFF', status === 0 ? '#FFDDE2' : '#D9DEE5']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.left,]}>
          <View style={styles.rowCenter}>

            <Image source={status === 0 ? require('../assets/icon_sign_alarm2.png') : require('../assets/icon_sign_alarm.png')} style={styles.baseInfoImg} />
            <View >
              <Text style={[styles.text18, { marginBottom: px(12) }]}>故障状态</Text>
              <Text style={[styles.text22, status === 0 ? styles.textRed : styles.textGrey, styles.textBold, styles.mt10]}>{status === 0 ? '未解除' : '已解除'}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.center}>
          <View style={styles.rowCenter}>
            <Image source={require('../assets/icon_loction_28.png')} style={[styles.centerImg,]} />
            <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(90) }]}>故障位置</Text>
            <Text style={styles.text20}>{(fault?.location?.lat && fault?.location?.lon) ? (fault?.location?.lat + ',' + fault?.location?.lon) : ''}</Text>
          </View>
          <View style={[styles.rowCenter, { marginTop: px(19) }]}>
            <Image source={require('../assets/icon_cause.png')} style={[styles.centerImg]} />
            <Text style={[styles.text20, styles.textBold, styles.centerTextM]}>故障原因</Text>
            <Text style={styles.text20}>{fault?.faultDesc}</Text>
          </View>
        </View>
        <View style={styles.center}>
          <View style={styles.rowCenter}>
            <Image source={require('../assets/icon_type_28.png')} style={[styles.centerImg,]} />
            <Text style={[styles.text20, styles.textBold, styles.centerTextM]}>故障类型</Text>
            <Text style={styles.text20}>{fault?.faultType}</Text>
          </View>
          <View style={[styles.rowCenter, { marginTop: px(19) }]}>
            <Image source={require('../assets/icon_call_28.png')} style={styles.centerImg} />
            <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(130) }]}>故障报警时间</Text>
            <Text style={styles.text20}>{fault?.startTime}</Text>
          </View>
        </View>

        <View style={styles.center}>
          <View style={[styles.rowCenter,]}>
            <Image source={require('../assets/icon_lift_28.png')} style={[styles.centerImg,]} />
            <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(130) }]}>解除故障时间</Text>
            <Text style={styles.text20}>{fault?.status === 1 ? '--' : fault?.endTime}</Text>
          </View>
          {fault?.isIgnore === 1 && <View style={[styles.rowCenter, { marginTop: px(19) }]}>
            <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(130) }]}>故障已被忽略</Text>
          </View>}
        </View>
      </View>}

    </View>
    <LogoutModal
      visible={showModal}
      content={`退出后不会删除任何历史数据
下次登录后依然可使用本账号`}
      handleSure={handleSure}
      handleCancel={() => setShowModal(false)} />

    {devMode && <Fragment>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SocketMessageModalScreen')
        }}
        style={{ position: 'absolute', left: px(20), bottom: px(320), backgroundColor: 'red', padding: px(20) }}>
        <Text > socket log</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NativeMessageModalScreen')
        }}
        style={{ position: 'absolute', left: px(20), bottom: px(220), backgroundColor: 'red', padding: px(20) }}>
        <Text > 车载 log</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SettingsScreen')
        }}
        style={{ position: 'absolute', left: px(20), bottom: px(120), backgroundColor: 'red', padding: px(20) }}>
        <Text > 配置App</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={switchTo}
        style={{ position: 'absolute', left: px(20), bottom: px(20), backgroundColor: 'red', padding: px(20) }}>
        <Text > 切换App</Text>
      </TouchableOpacity>
    </Fragment>}

  </View>
}


export default connect(({
  userModal: { user },
  configModal: { currentApp, devMode },
  faultListScreenModal: { faultListFrist },
  faultListScreenAppModal: { faultListFrist: faultListAppFirst } }) => ({
    user,
    faultListFrist,
    faultListAppFirst,
    currentApp, devMode
  }))(PersonCenterScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5EBEF',
  },

  header: {
    position: 'unset',
  },

  infoImg: {
    width: px(160),
    height: px(160),
    marginRight: px(37),
  },

  info: {
    paddingHorizontal: px(48),
    paddingVertical: px(90),
  },

  name: {
    fontSize: px(40),
    color: '#000',
    fontWeight: '500',
    marginBottom: px(14),
  },
  jobContainer: {
    backgroundColor: '#627CA4',
    width: px(80),
    height: px(36),
    borderTopRightRadius: px(8),
    borderBottomLeftRadius: px(16),
    marginLeft: px(20),
  },
  jobText: {
    color: '#fff',
    fontSize: px(20),
    lineHeight: px(36),
    textAlign: 'center'
  },

  tel: {
    marginTop: px(14),
    fontSize: px(32)
  },

  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  logout: {
    width: px(331),
    height: px(86),
    backgroundColor: '#2D7EF8',
    borderRadius: px(5),
  },
  logoutText: {
    fontSize: px(28),
    color: '#fff',
    textAlign: 'center',
    lineHeight: px(86)
  },
  itemContainer: {
    marginHorizontal: px(20),
    backgroundColor: '#fff',
    paddingHorizontal: px(68),
    paddingVertical: px(37),
    borderRadius: px(16),
    marginBottom: px(20),
  },
  imgLeft: {
    height: px(45),
    width: px(45),
  },
  textLeft: {
    marginLeft: px(22),
    fontSize: px(32),
    color: '#333',
  },
  imgRight: {
    height: px(45),
    width: px(45),
    transform: [{ rotate: '180deg' }],
  },
  rightContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: px(23),
    paddingHorizontal: px(80),
  },
  topImg: {
    marginLeft: px(5),
    tintColor: '#C8253D',
    width: px(24),
    height: px(24),
  },
  relieve: {
    width: px(120),
    height: px(50),
    backgroundColor: '#2D7EF8',
    borderRadius: px(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  relieved: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: px(4),
    borderColor: '#e5e5e5'
  },
  baseInfo: {

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    width: px(203),
    height: px(116),
    borderRadius: px(8),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },

  baseInfoImg: {
    width: px(54),
    height: px(54),
    marginLeft: px(31),
  },
  center: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  centerItem: {

  },

  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerImg: {
    width: px(28),
    height: px(28),
  },

  centerTextM: {
    marginLeft: px(8),
    marginRight: px(20),
  },

  confirm: {
    width: px(181),
    height: px(60),
    borderRadius: px(4),
    backgroundColor: '#2D7EF8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text28: {
    fontSize: px(28),
    color: '#333333',
  },

  text24: {
    fontSize: px(24),
    color: '#333333',
  },
  textBold: {
    fontWeight: 'bold',
  },
  text22: {
    fontSize: px(22),
    color: '#333333',
  },

  text18: {
    fontSize: px(22),
    color: '#333333',
  },

  color666: {
    color: '#666',
  },

  text20: {
    fontWeight: 500,
    fontSize: px(20),
    color: '#333333',
  },
  textRed: {
    color: '#C8253D',
  },
  textWhite: {
    color: '#fff',
  },
  mr19: {
    marginRight: px(19),
  }

})


