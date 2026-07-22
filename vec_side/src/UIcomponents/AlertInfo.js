import React, { useState, Fragment, useMemo, useEffect } from "react";

import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { height, px } from "../utils/ScreenUtils";
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { CURRENT } from "../models/configModal";
import { pubSub } from "../utils/pubsub";

// 首页报警信息
const AlertInfo = (props) => {

  const { currentApp, data } = props

  const firstFault = useMemo(() => {
    return data?.[0]
  }, [data])

  useEffect(() => {
    if (!firstFault || firstFault?.status === 1 || firstFault?.isIgnore === 1) {
      setShowAlert(false)
    }
  }, [firstFault])

  const navigation = useNavigation();

  const [showAlert, setShowAlert] = useState(false)

  function handleDetail () {
    if (currentApp === CURRENT.VEH) {
      navigation.navigate('FaultListScreen', { id: firstFault?.id })
    } else {
      navigation.navigate('FaultListScreenApp', { id: firstFault?.id })
    }
  }

  function handleShow () {
    if (!firstFault || firstFault?.status === 1 || firstFault?.isIgnore === 1) {
      pubSub.publish('showAlert', '该车辆没有报警信息，无法查看车辆的报警信息');
      return
    }
    setShowAlert(!showAlert)
  }


  return <Fragment>
    <TouchableOpacity style={[styles.topContainer, !showAlert && { borderBottomLeftRadius: px(16), borderBottomRightRadius: px(16) }]} onPress={() => handleShow()}>
      <View style={styles.topLeft}>
        <Image style={styles.topLeftImg} source={require('../assets/icon_alarm.png')} />
        <Text style={styles.topLeftText}>报警信息</Text>
      </View>
      <View style={styles.topRight}>
        <Text style={[styles.text20, styles.textBlue]}>{showAlert ? '收起' : '展开'}</Text>
        <Image style={styles.topImg} source={!showAlert ? require('../assets/icon_right.png') : require('../assets/icon_top.png')} />
      </View>
    </TouchableOpacity>

    {showAlert && firstFault && <LinearGradient
      colors={['#F3F9FF', '#CDE3FF']}
      style={[styles.contentContainer]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <TouchableOpacity onPress={handleDetail}>
        <View style={styles.contentItem}>
          <Text style={[styles.text22, styles.mr19, styles.color666]}>报警时间</Text>
          <Text style={[styles.text22]}>{firstFault.startTime}</Text>
        </View>
        <View style={styles.contentItem}>
          <Text style={[styles.text22, styles.mr19, styles.color666]}>报警位置</Text>
          <Text style={[styles.text22, { width: px(280) }]}>{firstFault?.location?.lon + ',' + firstFault?.location?.lat}</Text>
        </View>
        <View style={[styles.contentItem, styles.contentItembetween]}>
          <View style={styles.contentItemLeft}>
            <Text style={[styles.text22, styles.mr19, styles.color666]}>报警原因</Text>
            <Text style={[styles.text22, { width: px(140) }]} numberOfLines={1} ellipsizeMode='tail'>{firstFault.faultDesc}</Text>
          </View>
          <View style={styles.button}>
            <Text style={[styles.text22, styles.textWhite]}>{'查看详情 >'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient>}
  </Fragment>
}

export default connect(({ configModal: { currentApp }, }) => ({
  currentApp
}))(AlertInfo);

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
    width: px(454),
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
    width: px(454),
    borderBottomRightRadius: px(16),
    borderBottomLeftRadius: px(16),
    paddingHorizontal: px(24),
    backgroundColor: '#fff',
    marginBottom: px(20),
    paddingTop: px(26),
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
    width: px(141),
    height: px(38),
    backgroundColor: '#2D7EF8',
    borderRadius: px(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text22: {
    fontSize: px(22),
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

  color666: {
    color: '#666',
  },
  mr19: {
    marginRight: px(19),
  }

})