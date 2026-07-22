import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { height, px } from "../utils/ScreenUtils";
import { LinearGradient } from 'react-native-linear-gradient';
import { accAdd, accDiv, toFloat } from "../utils/mathTools";
import { getVehStatus, isEmptyObject } from "../utils";
import { connect } from "react-redux";
import { pubSub } from "../utils/pubsub";

// 车载端 左侧的任务信息
const HomeTaskInfo = (props) => {

  const { data, showDetail } = props

  const { currentVin, vinObj } = props;


  const [show, setShow] = useState(true)

  const goodName = useMemo(() => {
    return data?.goodsList?.map(item => item.goods).join(',')
  }, [data])

  const selectedVinObj = useMemo(() => {
    return vinObj?.get(currentVin)
  }, [vinObj, currentVin])

  const status = useMemo(() => {
    return selectedVinObj?.get('vehStatus')
  }, [selectedVinObj])

  useEffect(() => {
    if (!showDetail || status !== 2) {
      setShow(false)
    }
  }, [showDetail, status])

  const vehDetailVO = data?.vehDetailVO

  const arrivalStateText = useMemo(() => {
    switch (vehDetailVO?.arrivalState) {
      case 1:
        return '准时'
      case 2:
        return '超时'
      case 0:
        return ''
    }

  }, [vehDetailVO?.arrivalState])


  const taskStatus = useMemo(() => {
    switch (data?.status) {
      case 0:
        return {
          startBg: '#FF9C40',
          headerText: '未执行',
        }
      case 1:
        return {
          startBg: '#13CE66',
          headerText: '执行中',
        }
      case 2:
        return {
          startBg: '#2D7EF8',
          headerText: '已暂停',


        }
      case 3:
        return {
          startBg: '#FF9C40',
          headerText: '未执行',
        }
      case 9:
        return {
          startBg: '#627CA4',
          headerText: '已完成',
        }

      case -1:
        return {
          startBg: '#FF9C40',
          headerText: '已取消',
        }
      case -2:
        return {
          startBg: '#FF9C40',
          headerText: '作业失败',

        }
      default:
        return {}
    }

  }, [data?.status])








  // 当前行驶里程
  const currentMil = useMemo(() => {
    if (selectedVinObj && data?.vehDetailVO) {
      return data?.vehDetailVO?.estMileage - selectedVinObj?.getIn(['remMileage'])
    } else {
      return 0
    }
  }, [selectedVinObj, data])

  // 当前行驶时长 ,只有 detail 数据，不是动态变化的
  const currentTime = useMemo(() => {

    if (data?.taskList) {
      const millis = data?.taskList.reduce((total, item) => {
        const { goEndTime, goStartTime } = item
        if (goEndTime && goStartTime) {
          const diff = new Date(goEndTime).getTime() - new Date(goStartTime).getTime()
          return total + diff
        } else if (goStartTime && !goEndTime) {
          const diff = new Date().getTime() - new Date(goStartTime).getTime()
          return total + diff < 0 ? 0 : diff
        } else {
          return total
        }
      }, 0)

      return Number.parseInt(toFloat(millis / 1000, 1))
    } else {
      return 0
    }

  }, [data])

  const [increaseTime, setincreaseTime] = useState(currentTime || 0)

  const timer = useRef()
  useEffect(() => {
    timer.current = setTimeout(() => {
      setincreaseTime(increaseTime + 5)
    }, 5000);

  }, [increaseTime])

  useEffect(() => {
    return () => timer.current && clearTimeout(timer.current)
  }, [])

  function onToogle () {
    if (status !== 2) {
      pubSub.publish('showAlert', '该车辆没有正在执行的任务信息，无法查看当前任务信息');
      return
    }
    setShow(!show)
  }


  return <View style={styles.container}>
    <TouchableOpacity style={styles.topContainer} onPress={() => onToogle()}>
      <Text style={styles.topContainerText}>任务基本信息</Text>
      <View style={styles.topRight}>
        <Text style={[styles.text20, styles.textBlue]}>{show ? '收起' : '展开'}</Text>
        <Image style={styles.topImg} source={!show ? require('../assets/icon_right.png') : require('../assets/icon_top.png')} />
      </View>
    </TouchableOpacity>

    {show && <LinearGradient
      colors={['#F3F9FF', '#CDE3FF']}
      style={[styles.contentContainer]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: height - px(400) }}>
        <View style={styles.contentTopContent}>
          <View style={styles.contentTopContentLeft}>
            <Image source={require('../assets/icon_goods.png')} style={styles.contentTopContentLeftImage} />
            <Text style={styles.text20}>货物名称</Text>
          </View>
          <Text style={styles.text20}>{goodName}</Text>
        </View>
        <View style={styles.contentTopContent}>
          <View style={styles.contentTopContentLeft}>
            <Image source={require('../assets/icon_location.png')} style={styles.contentTopContentLeftImage} />
            <Text style={styles.text20}>任务终点</Text>
          </View>
          <Text style={styles.text20}>{data?.goodsList?.[data?.goodsList?.length - 1]?.endPointName}</Text>
        </View>
        {/* 任务状态 车辆状态 */}
        <View style={styles.status}>
          <View style={styles.statusItem}>
            <Image source={require('../assets/icon_status.png')} style={styles.statusImg} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusText}>任务状态</Text>
              <Text style={[styles.bold, styles.text22, { color: taskStatus.startBg },]}> {taskStatus.headerText}</Text>
            </View>
          </View>
          <View style={styles.statusItem}>
            <Image source={require('../assets/icon_car_s.png')} style={styles.statusImg} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusText}>车辆状态</Text>
              <Text style={[styles.bold, styles.text22, styles.textBlue,]}>{getVehStatus(status)}</Text>
            </View>
          </View>
        </View>
        {/* 行驶里程 行驶时长 */}
        <View style={styles.status1}>
          <View style={styles.status1Item}>
            <Text style={styles.text26}>{currentMil} <Text style={styles.text16}>m</Text></Text>
            <View style={styles.status1Bottom}>
              <Image source={require('../assets/icon_info_speed.png')} style={styles.status1BottomImg} />
              <Text style={styles.text20}>当前行驶里程</Text>
            </View>
          </View>
          <View style={styles.status1Item}>
            <Text style={styles.text26}>{toFloat(increaseTime / 60, 1)} <Text style={styles.text16}>min</Text></Text>
            <View style={styles.status1Bottom}>
              <Image source={require('../assets/icon_info_time.png')} style={styles.status1BottomImg} />
              <Text style={styles.text20}>当前行驶时长</Text>
            </View>
          </View>
        </View>

        <View style={styles.status2}>
          <Text style={[styles.text20, { marginRight: px(20) }]}>车辆到达状态 </Text><Text style={[styles.textBold, styles.textGreen]}>{arrivalStateText}</Text>
        </View>
        <View style={styles.status2}>
          <Text style={[styles.text20, { marginRight: px(20) }]}>任务开始时间 </Text><Text style={styles.text20}>{data?.startTime}</Text>
        </View>
        <View style={styles.status2}>
          <Text style={[styles.text20, { marginRight: px(20) }]}>任务结束时间 </Text><Text style={styles.text20}>{data?.endTime}</Text>
        </View>

        <View style={styles.status3}>
          <Text style={[styles.text22, styles.bold,]}>车辆VIN码</Text>
          <Text style={styles.text22}>{data?.vin}</Text>
        </View>
        <View style={styles.status3}>
          <Text style={[styles.text22, styles.bold,]}>任务编号</Text>
          <Text style={styles.text22}>{data?.jobNo}</Text>
        </View>
        <View style={styles.status3}>
          <Text style={[styles.text22, styles.bold,]}>对应工单编号</Text>
          <Text style={styles.text22}>{data?.workNo}</Text>
        </View>
      </ScrollView>

    </LinearGradient>}
  </View>
}

export default connect(({ configModal: { currentVin, }, messageModal: { vinObj } }) => ({
  currentVin, vinObj
}))(HomeTaskInfo);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: px(185),
    width: px(466),
    left: px(20),
  },

  topContainer: {
    display: 'flex',
    backgroundColor: '#F3F9FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: px(24),
    borderTopLeftRadius: px(16),
    borderTopRightRadius: px(16),
    backgroundColor: '#F3F9FF',
  },
  topContainerText: {
    fontWeight: 'bold',
    fontSize: px(26),
    color: '#000000',
  },
  topRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topImg: {
    marginLeft: px(5),
    width: px(14),
    height: px(14),
  },
  contentContainer: {
    flex: 1,
    width: px(466),
    borderBottomRightRadius: px(16),
    borderBottomLeftRadius: px(16),
    paddingHorizontal: px(28),
  },
  contentTopContent: {
    display: 'flex',
    flexDirection: 'row',
  },
  contentTopContentLeft: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: px(20),
    marginBottom: px(16),
  },
  contentTopContentLeftImage: {
    width: px(28),
    height: px(28),
    marginRight: px(8),
  },

  status: {
    width: px(414),
    height: px(108),
    backgroundColor: 'rgba(45,126,248,0.1)',
    borderRadius: px(8),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: px(26),
    marginBottom: px(20),
  },
  statusItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  statusImg: {
    width: px(54),
    height: px(54),
    marginRight: px(10),
  },
  statusText: {
    fontWeight: 500,
    fontSize: px(18),
    color: '#333333',
  },

  status1: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: px(20),
  },
  status1Item: {
    flex: 1,

  },
  status1Bottom: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: px(8),
  },
  status1BottomImg: {
    width: px(20),
    height: px(20),
    marginRight: px(8),
  },

  status2: {
    width: px(378),
    height: px(52),
    backgroundColor: '#FFFFFF',
    marginBottom: px(10),
    opacity: 0.8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: px(12),
  },

  status3: {
    marginTop: px(10),
    marginBottom: px(24),
  },

  text26: {
    fontWeight: 500,
    fontSize: px(26),
    color: '#333333',
  },
  text22: {
    fontWeight: 500,
    fontSize: px(22),
    color: '#333333',
  },
  text16: {
    fontWeight: 500,
    fontSize: px(16),
    color: '#333333',
  },
  text20: {
    fontWeight: 500,
    fontSize: px(20),
    color: '#333333',
  },
  bold: {
    fontWeight: 'bold',
  },
  textGreen: {
    color: '#13CE66',
  },
  textBlue: {
    color: '#2D7EF8',

  }
})