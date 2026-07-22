import React, { useMemo, useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { height, px } from "../utils/ScreenUtils";
import LinearGradient from "react-native-linear-gradient";

// 故障信息 手持

const FaultCardApp = (props) => {

  const { data, onPress, showDetail } = props;

  const [show, setShow] = useState(showDetail)

  function onRelieve () {
    onPress && onPress(data)
  }

  const statusText = useMemo(() => {
    if (data?.status === 0) {
      if (data?.isIgnore === 1) {
        return '已忽略'
      }
      return '忽略'
    } else {
      return '已解除'
    }
  }, [data])


  return <View style={styles.container}>
    <View style={styles.containerTop}>
      <Text style={[styles.text24, styles.textBold, { flex: 2 }]}>{data?.faultCode}</Text>
      <Text style={[styles.text24, styles.textBold, { flex: 2 }]}>{data?.startTime}</Text>
      <Text style={[styles.text24, styles.textBold, { flex: 2 }]}>{data?.vin}</Text>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={[styles.relieve, (data?.status === 1 || data?.isIgnore === 1) && styles.relieved]}
          onPress={() => onRelieve()} >
          <Text style={[styles.text24, styles.textWhite, (data?.status === 1 || data?.isIgnore === 1) && { color: '#333' },]}>{statusText}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[{ flex: 1, }]} onPress={() => setShow(!show)}>
        <View style={[styles.rightContent, { flex: 1, }]} >
          <Text style={[styles.text20, styles.textBlue]}>{show ? '收起' : '展开'}</Text>
          <Image style={styles.topImg} source={!show ? require('../assets/icon_right.png') : require('../assets/icon_top.png')} />
        </View>
      </TouchableOpacity>
    </View>

    {show && <View style={styles.baseInfo}>
      <LinearGradient
        colors={['#FFFFFF', data?.status === 0 ? '#FFDDE2' : '#D9DEE5']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.left,]}>
        <View style={styles.rowCenter}>

          <Image source={data?.status === 0 ? require('../assets/icon_sign_alarm2.png') : require('../assets/icon_sign_alarm.png')} style={styles.baseInfoImg} />
          <View style={styles.leftItemRight}>
            <Text style={[styles.text18,]}>故障状态</Text>
            <Text style={[styles.text22, data?.status === 0 ? styles.textRed : styles.textGrey, styles.textBold, styles.mt10]}>{data?.status === 0 ? '未解除' : '已解除'}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.center}>
        <View style={[styles.rowCenter, { marginBottom: px(19) }]}>
          <Image source={require('../assets/icon_loction_28.png')} style={[styles.centerImg,]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(100) }]}>故障位置</Text>
          <Text style={styles.text20}>{data?.location?.lat + ',' + data?.location?.lon}</Text>
        </View>
        <View style={[styles.rowCenter,]}>
          <Image source={require('../assets/icon_cause.png')} style={[styles.centerImg]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM]}>故障原因</Text>
          <Text style={styles.text20}>{data?.faultDesc}</Text>
        </View>
      </View>

      <View style={styles.center}>

        <View style={[styles.rowCenter, { marginBottom: px(19) }]}>
          <Image source={require('../assets/icon_type_28.png')} style={[styles.centerImg,]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM]}>故障类型</Text>
          <Text style={styles.text20}>{data?.faultType}</Text>
        </View>
        <View style={[styles.rowCenter]}>
          <Image source={require('../assets/icon_call_28.png')} style={styles.centerImg} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(130) }]}>故障报警时间</Text>
          <Text style={styles.text20}>{data?.startTime}</Text>
        </View>
      </View>

      <View style={styles.center}>
        <View style={[styles.rowCenter,]}>
          <Image source={require('../assets/icon_lift_28.png')} style={[styles.centerImg,]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(130) }]}>解除故障时间</Text>
          <Text style={styles.text20}>{data?.status === 0 ? '--' : data?.endTime}</Text>
        </View>
        {data?.isIgnore === 1 && <View style={[styles.rowCenter, { marginTop: px(19) }]}>
          <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(130) }]}>故障已被忽略</Text>
        </View>}
      </View>
    </View>}
  </View>
}

export default FaultCardApp

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: px(8),
    paddingHorizontal: px(94),
    marginTop: px(10),

  },

  containerTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: px(33),
  },

  topLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topLeftText: {
    fontWeight: 'bold',
    fontSize: px(26),
    color: '#000000',
  },
  topLeftImg: {
    width: px(49),
    height: px(49),
  },
  rightContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  topImg: {
    marginLeft: px(5),
    width: px(14),
    height: px(14),
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
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    height: px(183),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: px(29),
    paddingBottom: px(38),
  },

  left: {
    width: px(203),
    height: px(116),
    borderRadius: px(8),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: px(26),
    paddingVertical: px(20),
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

  text24: {
    fontSize: px(24),
    color: '#333333',
  },
  textBold: {
    fontWeight: 'bold',
  },

  text18: {
    fontSize: px(18),
    color: '#333333',
  },
  text22: {
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
  textBlue: {
    color: '#2D7EF8',
  },
  textWhite: {
    color: '#fff',
  },
  mr19: {
    marginRight: px(19),
  }

})