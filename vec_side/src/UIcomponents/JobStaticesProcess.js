import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { height, px } from "../utils/ScreenUtils";
import LinearGradient from "react-native-linear-gradient";
import { accAdd, accDiv, toFloat } from "../utils/mathTools";

const list = [
  { name: '作业点A', action: '动作', statusText: '已完成', status: 0, },
  { name: '作业点A', action: '动作', statusText: '进行中', status: 1, },
  { name: '作业点A', action: '动作', statusText: '进行中', status: 1, },
  { name: '作业点A', action: '动作', statusText: '未执行', status: 2, },
  { name: '作业点A', action: '动作', statusText: '未执行', status: 2, },
]

// 任务页 右侧的 悬浮的数据，任务数据

const JobStaticesProcess = (props) => {

  const { data, selectedVinObj } = props;

  const vehDetailVO = data?.vehDetailVO

  const [showTask, setShowTask] = useState(false)

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

  // 当前行驶里程
  const currentMil = useMemo(() => {
    if (selectedVinObj && data?.vehDetailVO) {
      if (data?.vehDetailVO?.estMileage && selectedVinObj?.getIn([data.vin, 'remMileage'])) {
        return data?.vehDetailVO?.estMileage - selectedVinObj?.getIn([data.vin, 'remMileage']);
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }, [selectedVinObj, data]);

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

      return Math.abs(Number.parseInt(toFloat(millis / 1000, 1)))
    }

  }, [data])



  const [increaseTime, setincreaseTime] = useState(currentTime)

  const timer = useRef()
  useEffect(() => {
    timer.current = setTimeout(() => {
      setincreaseTime(increaseTime + 5)
    }, 5000);

  }, [increaseTime])

  useEffect(() => {
    return () => timer.current && clearTimeout(timer.current)
  }, [])



  return <Fragment>

    <TouchableOpacity style={styles.topContainer} onPress={() => setShowTask(!showTask)}>
      <Text style={styles.topLeftText}>任务数据</Text>
      <View style={styles.topRight}>
        <Text style={[styles.text20, styles.textBlue]}>{showTask ? '收起' : '展开'}</Text>
        <Image style={styles.topImg} source={!showTask ? require('../assets/icon_right.png') : require('../assets/icon_top.png')} />
      </View>
    </TouchableOpacity>

    {showTask && <LinearGradient
      colors={['#F3F9FF', '#CDE3FF']}
      style={[styles.contentContainer]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}>
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
        <Text style={[styles.text20, { marginRight: px(20) }]}>车辆到达状态 </Text><Text style={[styles.textBold, styles.text20, styles.textGreen]}>{arrivalStateText}</Text>
      </View>
      <View style={styles.status2}>
        <Text style={[styles.text20, { marginRight: px(20) }]}>任务开始时间 </Text><Text style={styles.text20}>{data?.startTime}</Text>
      </View>
      <View style={styles.status2}>
        <Text style={[styles.text20, { marginRight: px(20) }]}>任务结束时间 </Text><Text style={styles.text20}>{data?.endTime}</Text>
      </View>
    </LinearGradient>}
  </Fragment>
}

export default JobStaticesProcess

const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: px(24),
    paddingVertical: px(13),
    borderTopLeftRadius: px(16),
    borderTopRightRadius: px(16),
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
    padding: px(15),
    borderBottomLeftRadius: px(16),
    borderBottomRightRadius: px(16),
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

  topContainer: {
    display: 'flex',
    backgroundColor: '#F3F9FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: px(24),
    paddingVertical: px(13),
    borderTopLeftRadius: px(16),
    borderTopRightRadius: px(16),
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

  contentItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: px(24),
  },
  contentItembetween: {
    justifyContent: 'space-between'
  },
  contentItemLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    width: px(97),
    height: px(38),
    backgroundColor: '#2D7EF8',
    borderRadius: px(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  textBold: {
    fontWeight: 'bold',
  },
  textGreen: {
    color: '#13CE66',
  },

  color666: {
    color: '#666',
  },
  mr19: {
    marginRight: px(19),
  }
})