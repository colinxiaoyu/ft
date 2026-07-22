import React, { Fragment, useMemo, useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { height, px } from "../utils/ScreenUtils";
import LinearGradient from "react-native-linear-gradient";
import { accDiv } from "../utils/mathTools";

const list = [
  { name: '作业点A', action: '动作', statusText: '已完成', status: 0, },
  { name: '作业点A', action: '动作', statusText: '进行中', status: 1, },
  { name: '作业点A', action: '动作', statusText: '进行中', status: 1, },
  { name: '作业点A', action: '动作', statusText: '未执行', status: 2, },
  { name: '作业点A', action: '动作', statusText: '未执行', status: 2, },
]

// 任务页 右侧的 悬浮的数据，任务数据

const JobStaticesFinish = (props) => {

  const [showTask, setShowTask] = useState(false)

  const { data } = props;
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


  return <LinearGradient
    colors={['#F3F9FF', '#CDE3FF']}
    style={[styles.container]}
    start={{ x: 1, y: 0 }}
    end={{ x: 1, y: 1 }}>
    <TouchableOpacity style={styles.topContainer} onPress={() => setShowTask(!showTask)}>
      <Text style={styles.topLeftText}>任务数据</Text>
      <View style={styles.topRight}>
        <Text style={[styles.text20, styles.textBlue]}>{showTask ? '收起' : '展开'}</Text>
        <Image style={styles.topImg} source={!showTask ? require('../assets/icon_right.png') : require('../assets/icon_top.png')} />
      </View>
    </TouchableOpacity>
    {
      showTask && <ScrollView style={[styles.contentContainer, { maxHeight: height - px(640) }]} >
        <View style={[styles.content1, styles.mb17]}>
          <View style={[styles.content1Item, styles.mb21]}>
            <Text style={[styles.text20]}>本次行驶里程AD占比</Text>
            <Text style={[styles.text24, styles.textBold]}>{vehDetailVO?.mileagePer}%</Text>
          </View>
          <View style={[styles.content1Item, styles.mb21]}>
            <View style={styles.content1ItemLeft}>
              <Image source={require('../assets/icon_right.png')} style={styles.content1Img} />
              <Text style={styles.text20}>自动驾驶</Text>
            </View>
            <Text style={styles.text20}>{accDiv(vehDetailVO?.automaticMileage, 1000)}km</Text>
          </View>
          <View style={[styles.content1Item]}>
            <View style={styles.content1ItemLeft}>
              <Image source={require('../assets/icon_right.png')} style={styles.content1Img} />
              <Text style={styles.text20}>人工驾驶</Text>
            </View>
            <Text style={styles.text20}>{accDiv(vehDetailVO?.manualDrivingMileage, 1000)}km</Text>
          </View>
        </View>

        <View style={[styles.content1, styles.mb27]}>
          <View style={[styles.content1Item, styles.mb21]}>
            <Text style={[styles.text20]}>本次行驶时长AD占比</Text>
            <Text style={[styles.text24, styles.textBold]}>{vehDetailVO?.timePer}%</Text>
          </View>
          <View style={[styles.content1Item, styles.mb21]}>
            <View style={styles.content1ItemLeft}>
              <Image source={require('../assets/icon_right.png')} style={styles.content1Img} />
              <Text style={styles.text20}>自动驾驶</Text>
            </View>
            <Text style={styles.text20}>{vehDetailVO?.automaticTime}min</Text>
          </View>
          <View style={[styles.content1Item]}>
            <View style={styles.content1ItemLeft}>
              <Image source={require('../assets/icon_right.png')} style={styles.content1Img} />
              <Text style={styles.text20}>人工驾驶</Text>
            </View>
            <Text style={styles.text20}>{vehDetailVO?.manualDrivingTime}min</Text>
          </View>
        </View>

        <View style={[styles.content2, styles.mb31]}>
          <View>
            <Text style={[styles.text26, styles.textBold, styles.mb12]}>{vehDetailVO?.maxVelocity}<Text style={[styles.text16]}>km/h</Text></Text>
            <Text style={[styles.text20]}>最高车速</Text>
          </View>
          <View>
            <Text style={[styles.text26, styles.textBold, styles.mb12]}>{vehDetailVO?.minVelocity}<Text style={[styles.text16]}>km/h</Text></Text>
            <Text style={[styles.text20]}>最低车速</Text>
          </View>
          <View>
            <Text style={[styles.text26, styles.textBold, styles.mb12]}>{vehDetailVO?.avgVelocity}<Text style={[styles.text16]}>km/h</Text></Text>
            <Text style={[styles.text20]}>平均车速</Text>
          </View>
        </View>

        <View style={styles.status2}>
          <Text style={[styles.text20, { marginRight: px(20) }]}>车辆到达状态 </Text><Text style={[styles.textBold, styles.textGreen]}>{arrivalStateText}</Text>
        </View>
        <View style={styles.status2}>
          <Text style={[styles.text20, { marginRight: px(20) }]}>任务开始时间 </Text><Text style={styles.text16}>{data?.startTime}</Text>
        </View>
        <View style={styles.status2}>
          <Text style={[styles.text20, { marginRight: px(20) }]}>任务结束时间 </Text><Text style={styles.text16}>{data?.endTime}</Text>
        </View>

        <View style={[styles.content1, styles.mb17]}>
          <View style={[styles.content1Item, styles.mb21]}>
            <Text style={[styles.text20]}>预计行驶里程</Text>
            <Text style={[styles.text24, styles.textBold]}>{vehDetailVO?.estMileage}m</Text>
          </View>
          <View style={[styles.content1Item]}>
            <Text style={[styles.text20]}>预计行驶驾驶时长</Text>
            <Text style={[styles.text24, styles.textBold]}>{vehDetailVO?.estGoTime}min</Text>
          </View>
        </View>
      </ScrollView>
    }


  </LinearGradient>
}

export default JobStaticesFinish

const styles = StyleSheet.create({
  container: {

  },
  topContainer: {
    display: 'flex',
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
    marginBottom: px(20),
    borderBottomLeftRadius: px(16),
    borderBottomRightRadius: px(16),
  },

  content1: {
    padding: px(22),
    backgroundColor: '#fff',
  },
  content1Img: {
    width: px(12),
    height: px(12),
    marginRight: px(10),
  },
  content1Item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content1ItemLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  content2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  text26: {
    fontWeight: 500,
    fontSize: px(26),
    color: '#333333',
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
  },
  mb31: {
    marginBottom: px(31),
  },
  mb27: {
    marginBottom: px(27),
  },
  mb21: {
    marginBottom: px(21),
  },
  mb17: {
    marginBottom: px(17),
  },
  mb12: {
    marginBottom: px(12),
  }
})