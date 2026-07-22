import React, { useMemo, useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { height, px } from "../utils/ScreenUtils";
import { LinearGradient } from 'react-native-linear-gradient';
import ProgressBar from "../components/ProgressBar";
import { toFloat } from "../utils/mathTools";
import { pubSub } from "../utils/pubsub";

// 手持端 车辆详情 控制台
const DetailInfo = (props) => {

  const { vinObj, selectedJobPath } = props;


  const [show, setShow] = useState(false)


  function openDetail () {
    if (selectedJobPath) {
      setShow(!show)
    } else {
      pubSub.publish('showAlert', '该车辆没有正在执行的任务信息，无法查看当前任务信息');
    }
  }


  const progress = useMemo(() => {

    const status = selectedJobPath?.status
    if (status === 9) {
      return 100
    } else if (status === 1 || status === 2) {
      return toFloat(Math.min((1 - vinObj?.get('remMileage') / selectedJobPath?.vehDetailVO?.estMileage) * 100, 99), 0)
    }

  }, [vinObj, selectedJobPath])


  return <View style={styles.container}>
    <TouchableOpacity style={styles.topContainer} onPress={() => openDetail()}>
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
      <View style={styles.deagree}>
        <Image source={require('../assets/icon_course.png')} style={styles.deagreeImage} />
        <Text style={[styles.text20, { marginRight: px(30) }]}>航向角</Text>
        <Text style={[styles.text20,]}>{vinObj?.get('heading')}</Text>
      </View>
      <Text style={[styles.text22, styles.textBold, { marginBottom: px(8) }]}>正在执行的任务编号</Text>
      <Text style={[styles.text22, { marginBottom: px(36) }]}>{vinObj?.get('taskId')}</Text>
      <ProgressBar progress={progress} />
      <View style={[styles.seedItem, styles.seedItemContainer]}>


        <View style={[styles.seedItem, { flex: 1, justifyContent: 'flex-end' }]}>
          {selectedJobPath?.status === 1 ?
            <Text style={styles.text18}>{selectedJobPath?.vehDetailVO?.estGoTime ? toFloat(selectedJobPath?.vehDetailVO?.estGoTime) : 0}min</Text> :
            <Text></Text>}
          <View style={styles.divider} />
          <Text style={styles.text18}>{selectedJobPath?.vehDetailVO?.estMileage ? toFloat((selectedJobPath?.vehDetailVO?.estMileage / 1000)) : 0}km</Text>
        </View>
      </View>


    </LinearGradient>}
  </View>
}

export default DetailInfo

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: px(192),
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

  deagree: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    opacity: .8,
    marginBottom: px(30),
    paddingVertical: px(8),
    paddingHorizontal: px(14),
  },

  deagreeImage: {
    width: px(24),
    height: px(24),
    marginRight: px(8),
  },

  seedItemContainer: {
    marginVertical: px(22),
  },
  seedItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  divider: {
    width: px(3),
    height: px(20),
    backgroundColor: '#333333',
    marginHorizontal: px(20),
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
  text18: {
    fontWeight: 500,
    fontSize: px(18),
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

  },
  textBold: {
    fontWeight: 'bold',
  },
})