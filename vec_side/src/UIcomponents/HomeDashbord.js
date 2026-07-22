import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { px, width } from '../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';
import HomeDashboardModal from './HomeDashboardModal';
import { useNavigation } from '@react-navigation/native';
import NewTaskModal from './NewTaskModal';
import { connect } from 'react-redux';
import { action } from '../utils';
import { toFloat } from '../utils/mathTools';
import ProgressBar from "../components/ProgressBar";

// 车载端 控制台
const HomeDashbord = (props) => {

  const { data, VinMessage, currentVin } = props

  const navigation = useNavigation()

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const [homeDashboardModal, setHomeDashboardModal] = useState({
    visible: false
  })

  function handleConfirm (modalType) {

    console.log('modalType', modalType)
    // 
    switch (modalType) {
      case 0:
        props.dispatch(action('homeScreenModal/postVehRecharge', { vin: currentVin }))
        break
      case 1:
        props.dispatch(action('homeScreenModal/postVehRecycle', { vin: currentVin }))
        break
      case 2: // 自动驾驶
        props.dispatch(action('homeScreenModal/postVehDriveMode', { vin: currentVin }))
        props.dispatch(action('nativeMessageModal/sendComandToNative', { command: "sendChangeDriveMode0Command" }));


        break
      case 3: // 人工驾驶
        props.dispatch(action('homeScreenModal/postVehDriveMode', { vin: currentVin }))
        props.dispatch(action('nativeMessageModal/sendComandToNative', { command: "sendChangeDriveMode1Command" }));



        break
    }
    setHomeDashboardModal({ visible: false })
  }


  const driveModeText = useMemo(() => {

    if (VinMessage?.driveMode === 4) {
      return '自动驾驶'
    } else if (VinMessage?.driveMode === 1) {
      return '人工驾驶'
    } else {
      return '未知'
    }

  }, [VinMessage?.driveMode])


  const tapPos = useMemo(() => VinMessage?.tapPos, [VinMessage?.tapPos])

  const isSOC20 = useMemo(() => {
    if (VinMessage?.soc && (VinMessage?.soc / 100).toFixed(0) < 20) {
      return true
    }
    return false
  }, [VinMessage])

  const SOCImage = useMemo(() => {
    if (VinMessage?.chargedState === 1) {
      return require('../assets/icon_electricity_1.png')

    }
    if (VinMessage?.soc && (VinMessage?.soc / 100).toFixed(0) < 20) {
      return require('../assets/icon_electricity_3.png')
    }
    return require('../assets/icon_electricity_normal.png')
  }, [VinMessage])


  return (
    <View style={styles.customTabBarContainer}>
      <ImageBackground style={styles.dashboard} source={require('../assets/img_bg_dash.png')}>
        <View style={styles.centerContainer}>
          <View style={styles.centerLeft}>
            <View style={styles.left1}>
              <Text style={[styles.left1Text, tapPos === 33 && styles.left1TextActive]}>P</Text>
              <Text style={[styles.left1Text, tapPos === 32 && styles.left1TextActive]}>R</Text>
              <Text style={[styles.left1Text, tapPos === 31 && styles.left1TextActive]}>D</Text>
            </View>
            <LinearGradient colors={['rgba(45,126,248,0)', '#CDE3FF']}
              style={styles.left2}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }} >
              <View style={styles.left21}>
                <View style={styles.left211}>
                  <Image source={SOCImage}
                    style={styles.left211Image} />
                  <Text style={[styles.left211Text, isSOC20 && { color: 'red' }]}>{VinMessage?.soc ? (VinMessage?.soc / 100).toFixed(0) : 0}%</Text>
                </View>
                <Text style={styles.left21Text}>{data?.remDrivingTime}H</Text>
              </View>
              <ProgressBar progress={Math.min(100, VinMessage?.soc / 100 || 0)} showIcon={false} progressColor={isSOC20 ? 'red' : '#2D7EF8'} />

            </LinearGradient>
          </View>
          <View style={styles.centerCenter}>
            <Text style={styles.centerText1}>{driveModeText}</Text>
            <Text style={styles.centerText2}>{VinMessage?.velocity?.toFixed(2)}</Text>
            <Text style={styles.centerText3}>km/h</Text>

          </View>
          <View style={styles.centerRight}>
            <View style={styles.right1}>
              <Image style={styles.rightImg} source={tapPos === 33 ? require('../assets/icon_sign_park1.png') : require('../assets/icon_sign_park.png')} />
              <Image style={styles.rightImg} source={VinMessage?.scramFlag === 1 ? require('../assets/icon_sign_brake1.png') : require('../assets/icon_sign_brake.png')} />
              <Image style={styles.rightImg} source={data?.vehFault === 1 ? require('../assets/icon_sign_alarm1.png') : require('../assets/icon_sign_alarm.png')} />
            </View>
            <LinearGradient colors={['rgba(45,126,248,0)', '#CDE3FF']}
              style={styles.right2}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }} >
              <Text style={styles.right2Text}>
                当日里程{toFloat(data?.dayMileage)}km
              </Text>

            </LinearGradient>

          </View>
        </View>
      </ImageBackground>

      <TouchableOpacity
        onPress={() => setHomeDashboardModal({ visible: true, modalType: 0 })}
        style={styles.tabItem}
      >
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={require('../assets/icon_b_charge.png')} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setHomeDashboardModal({ visible: true, modalType: 1 })}
        style={styles.tabItem}
      >
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={require('../assets/icon_b_return.png')} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setHomeDashboardModal({ visible: true, modalType: VinMessage?.driveMode === 4 ? 3 : 2 })
        }}
        style={styles.tabItem}
      >
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={VinMessage?.driveMode === 4 ? require('../assets/icon_b_artificial_driving_t.png') : require('../assets/icon_b_artificial_driving.png')} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => {
          navigation.navigate('FaultListScreen')
        }}
      >
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={require('../assets/icon_b_workorder.png')} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          openModal()
        }}

        style={styles.tabItem}
      >
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon}
            source={require('../assets/icon_b_newtask.png')} />
        </View>
      </TouchableOpacity>



      <HomeDashboardModal
        data={homeDashboardModal}
        onConfirm={handleConfirm}
        onCancel={() => setHomeDashboardModal({ visible: false })}
      />

      {modalVisible && <NewTaskModal
        visible={modalVisible}
        onClose={closeModal}
      />}
    </View>
  );
};

export default connect(({ nativeMessageModal: { VinMessage }, configModal: { currentVin } }) => ({
  VinMessage, currentVin
}))(HomeDashbord);

const styles = StyleSheet.create({
  customTabBarContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: px(111),
    backgroundColor: '#fff',
    borderTopWidth: 0,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: px(256),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusedTab: {
    // You can style the focused tab with different background or border
  },
  tabLabel: {
    fontSize: 12,
    color: '#000',
  },
  focusedLabel: {
    color: '#6200ee',
  },
  iconContainer: {
    marginBottom: px(5),
  },
  icon: {
    width: px(62),
    height: px(62),
  },

  dashboard: {
    position: 'absolute',
    bottom: px(110),
    left: 0,
    width: width,
    height: px(200),
  },
  centerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: px(1002),
    marginHorizontal: px(459),
    paddingHorizontal: px(93),
    paddingTop: px(19),
  },

  centerLeft: {
    flex: 1
  },
  left1: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: px(27),
    marginLeft: px(40),
    marginBottom: px(28),
  },
  left1Text: {
    marginRight: px(30),
    fontSize: px(35),
    color: '#A8B2C1'
  },
  left1TextActive: {
    color: '#2D7EF8'
  },
  left2: {
    paddingVertical: px(20),
    paddingHorizontal: px(22),
    width: px(231),
    height: px(89),
  },
  left21: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  left211: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  left211Image: {
    width: px(30),
    height: px(30),
  },
  left211Text: {
    color: '#333',
    fontSize: px(23),
  },
  left21Text: {
    color: '#333',
    fontSize: px(23),
    fontWeight: 'bold',
  },
  centerCenter: {
    flex: 1,
  },
  centerText1: {
    color: '#00D3DA',
    fontSize: px(26),
    fontWeight: 'bold',
    marginTop: px(19),
    textAlign: 'center',
  },
  centerText2: {
    color: '#000',
    fontSize: px(60),
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: px(20),
  },
  centerText3: {
    color: '#666',
    fontSize: px(24),
    textAlign: 'center',
  },

  centerRight: {
    flex: 1,
  },
  right1: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: px(27),
    justifyContent: 'flex-end',
    marginBottom: px(20),

  },
  rightImg: {
    width: px(48),
    height: px(48),
    marginLeft: px(14),
  },
  right2: {
    marginLeft: px(45),
    paddingVertical: px(15),
    paddingHorizontal: px(22),
    width: px(231),
    height: px(89),
    borderRadius: px(16),
  },
  right2Text: {
    color: '#666',
    fontSize: px(23),
  }
});


