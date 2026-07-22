import React, { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { px } from "../utils/ScreenUtils";
import LinearGradient from "react-native-linear-gradient";
import FaultListRightWebView from "./FaultListRightWebView";


// { id: 0, value: '无故障' },
//   { id: 1, value: '故障' },
// 故障信息  右侧
const FaultListRight = (props) => {

  const { data, onConfim } = props


  const { status } = data



  function handleConfim () {
    onConfim && onConfim(data)
  }


  const statusButton = useMemo(() => {
    if (data?.status === 0) {
      if (data?.isIgnore === 1) {
        return <TouchableOpacity style={[styles.confirm, { backgroundColor: '#999' }]} disabled>
          <Text style={[styles.text26, styles.textBold, styles.textWhite, { textAlign: 'center' }]}>故障已被忽略</Text>
        </TouchableOpacity>
      }
      return <TouchableOpacity style={styles.confirm} onPress={handleConfim}>
        <Text style={[styles.text26, styles.textBold, styles.textWhite, { textAlign: 'center' }]}>确认忽略</Text>
      </TouchableOpacity>
    } else {
      return null
    }
  }, [data])


  return <View style={styles.detailRight}>

    <View style={styles.baseInfo}>
      <LinearGradient
        colors={['#FFFFFF', status === 0 ? '#FFDDE2' : '#D9DEE5']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.left,]}>
        <View style={styles.rowCenter}>

          <Image source={status === 0 ? require('../assets/icon_sign_alarm2.png') : require('../assets/icon_sign_alarm.png')} style={styles.baseInfoImg} />
          <View style={styles.leftItemRight}>
            <Text style={[styles.text18,]}>故障状态</Text>
            <Text style={[styles.text22, status === 0 ? styles.textRed : styles.textGrey, styles.textBold, styles.mt10]}>{status === 0 ? '未解除' : '已解除'}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.center}>
        <View style={[styles.rowCenter, { marginBottom: px(16) }]}>
          <Image source={require('../assets/icon_alarm_28.png')} style={styles.centerImg} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM]}>故障代码</Text>
          <Text style={styles.text20}>{data?.faultCode}</Text>
        </View>
        <View style={[styles.rowCenter, { marginBottom: px(16) }]}>
          <Image source={require('../assets/icon_cause.png')} style={[styles.centerImg]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM]}>故障原因</Text>
          <Text style={styles.text20}>{data?.faultDesc}</Text>
        </View>
        <View style={styles.rowCenter}>
          <Image source={require('../assets/icon_type_28.png')} style={[styles.centerImg,]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM]}>故障类型</Text>
          <Text style={styles.text20}>{data?.faultType}</Text>
        </View>
      </View>

      <View style={styles.center}>
        <View style={[styles.rowCenter, { marginBottom: px(16) }]}>
          <Image source={require('../assets/icon_call_28.png')} style={styles.centerImg} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(130) }]}>故障报警时间</Text>
          <Text style={styles.text20}>{data?.startTime}</Text>
        </View>
        <View style={[styles.rowCenter, { marginBottom: px(16) }]}>
          <Image source={require('../assets/icon_lift_28.png')} style={[styles.centerImg,]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(130) }]}>解除故障时间</Text>
          <Text style={styles.text20}>{status === 0 ? '--' : data?.endTime}</Text>
        </View>
        <View style={styles.rowCenter}>
          <Image source={require('../assets/icon_loction_28.png')} style={[styles.centerImg,]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(130) }]}>故障位置</Text>
          <Text style={styles.text20}>{data?.location?.lat + ',' + data?.location?.lon}</Text>
        </View>
      </View>

      {
        statusButton
      }
    </View>
    <FaultListRightWebView data={data} />

  </View>
}

export default FaultListRight

const styles = StyleSheet.create({
  detailRight: {
    flex: 1,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  baseInfo: {
    height: px(188),
    backgroundColor: '#fff',
    borderRadius: px(8),
    borderBottomWidth: px(4),
    borderColor: '#2D7EF8',
    padding: px(20),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    width: px(203),
    height: px(148),
    borderRadius: px(8),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: px(26),
    paddingVertical: px(40),
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseInfoImg: {
    width: px(54),
    height: px(54),
  },
  center: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  centerItem: {

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


  text26: {
    fontWeight: 500,
    fontSize: px(26),
    color: '#000',
  },
  mt10: {
    marginTop: px(6),
  },

  text24: {
    fontWeight: 500,
    fontSize: px(24),
    color: '#333333',
  },
  text22: {
    fontWeight: 500,
    fontSize: px(22),
    color: '#333333',
  },
  text20: {
    fontWeight: 500,
    fontSize: px(20),
    color: '#333333',
  },
  text18: {
    fontWeight: 500,
    fontSize: px(18),
    color: '#333333',
  },
  text14: {
    fontWeight: 500,
    fontSize: px(14),
    color: '#333333',
  },
  textBlue: {
    color: '#2D7EF8',
  },
  textWhite: {
    color: '#fff',
  },
  textRed: {
    color: '#C8253D',
  },
  textGrey: {
    color: '#627CA4',
  },
  textBold: {
    fontWeight: 'bold',
  }
})