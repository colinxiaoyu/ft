import React, { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { px } from "../utils/ScreenUtils";
import LinearGradient from "react-native-linear-gradient";
import JobManagerRightContent from "./JobManagerRightContent";
import { getVehStatus } from "../utils";
import { connect } from 'react-redux';
import JobVehStatus from "./JobVehStatus";


// 任务页 右侧的内容信息

const JobManagerRight = (props) => {

  const { data, cardType = 'hold', onStartDelivery, onUnloaded, vinObj } = props;

  const buttonGroup = [
    {
      key: "START_DELIVERY",
      value: <TouchableOpacity style={[styles.itemButton, styles.itemButtonCancel]} onPress={onStartDelivery}>
        <Image source={require('../assets/icon_dgoods_36.png')} style={styles.itemButtonImg} />
        <Text style={[styles.itemButtonText,]}>开始送货</Text>
      </TouchableOpacity>
    },
    {
      key: "UNLOADED",
      value: <TouchableOpacity style={styles.itemButton} onPress={onUnloaded}>
        <Image source={require('../assets/icon_unboxing_36.png')} style={styles.itemButtonImg} />
        <Text style={styles.itemButtonText}>解挂完成</Text>
      </TouchableOpacity>
    },

  ]



  function getButtonGroupValue (buttonGroup, operations) {
    return buttonGroup?.map(item => {
      if (operations.includes(item.key)) {
        return item.value
      }
    }).filter(item => !!item)

  }


  const jobStatus = useMemo(() => {
    switch (data?.status) {
      case 0:
        return {
          startBg: '#FF9C40',
          headerText: '未执行',
          buttons: getButtonGroupValue(buttonGroup, data.operations)
        }
      case 1:
        return {
          startBg: '#13CE66',
          headerText: '执行中',
          buttons: getButtonGroupValue(buttonGroup, data.operations)
        }
      case 2:
        return {
          startBg: '#2D7EF8',
          headerText: '已暂停',
          buttons: getButtonGroupValue(buttonGroup, data.operations)

        }
      case 3:
        return {
          startBg: '#FF9C40',
          headerText: '未执行',
          buttons: getButtonGroupValue(buttonGroup, data.operations)

        }
      case 9:
        return {
          startBg: '#627CA4',
          headerText: '已完成',
          buttons: getButtonGroupValue(buttonGroup, data.operations)

        }

      case -1:
        return {
          startBg: '#FF9C40',
          headerText: '已取消',
          buttons: getButtonGroupValue(buttonGroup, data.operations)

        }
      case -2:
        return {
          startBg: '#FF9C40',
          headerText: '作业失败',
          buttons: getButtonGroupValue(buttonGroup, data.operations)
        }
      default:
        return {}
    }
  }, [data])


  const goodName = useMemo(() => {
    return data?.goodsList.map(item => {
      return item.goods
    }).join(',')
  }, [data])

  return <View style={styles.detailRight}>

    <View style={styles.baseInfo}>
      <LinearGradient
        colors={['#FFFFFF', '#CCE0FF']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.left,]}>
        <View style={[styles.rowCenter, styles.mb16]}>
          <Image source={require('../assets/icon_status.png')} style={styles.leftImg} />
          <View style={styles.leftItemRight}>
            <Text style={[styles.text18,]}>任务状态</Text>
            <Text style={[styles.text22, styles.textGreen, styles.textBold, styles.mt6]}>{jobStatus.headerText}</Text>
          </View>
        </View>
        {data?.status === 1 && <View style={styles.rowCenter}>
          <Image source={require('../assets/icon_car_s.png')} style={styles.leftImg} />
          <View style={styles.leftItemRight}>
            <Text style={[styles.text18,]}>车辆状态</Text>
            <JobVehStatus vin={data.vin} style={[styles.mt6, styles.textBold]} />
          </View>
        </View>}
      </LinearGradient>

      <View style={[styles.center, { paddingVertical: px(15) }]}>
        <View style={styles.rowCenter}>
          <Image source={require('../assets/icon_goods.png')} style={styles.centerImg} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM]}>货物名称</Text>
          <Text style={[styles.text20, { maxWidth: px(300) }]} numberOfLines={1}>{goodName}</Text>
        </View>
        <View style={styles.rowCenter}>
          <Image source={require('../assets/icon_location.png')} style={[styles.centerImg, { tintColor: '#13CE66' }]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM]}>任务起点</Text>
          <Text style={styles.text20}>{data?.goodsList[0]?.startPointName}</Text>
        </View>
        <View style={styles.rowCenter}>
          <Image source={require('../assets/icon_location.png')} style={[styles.centerImg, { tintColor: '#FF9C40' }]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM]}>任务终点</Text>
          <Text style={styles.text20}>{data?.goodsList[data?.goodsList.length - 1]?.endPointName}</Text>
        </View>
      </View>

      <View style={[styles.center, { paddingVertical: px(15) }]}>
        <View style={styles.rowCenter}>
          <Image source={require('../assets/icon_job_id.png')} style={styles.centerImg} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(100) }]}>任务编号</Text>
          <Text style={styles.text20}>{data?.jobNo}</Text>
        </View>
        <View style={styles.rowCenter}>
          <Image source={require('../assets/icon_job_vin.png')} style={[styles.centerImg,]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(100) }]}>车辆VIN码</Text>
          <Text style={styles.text20}>{data?.vin}</Text>
        </View>
        <View style={styles.rowCenter}>
          <Image source={require('../assets/icon_job_tag.png')} style={[styles.centerImg,]} />
          <Text style={[styles.text20, styles.textBold, styles.centerTextM, { width: px(100) }]}>工单编号</Text>
          <Text style={styles.text20}>{data?.workNo}</Text>
        </View>
      </View>

//      {cardType === 'app' && <View style={[styles.center, { paddingVertical: px(15) }]}>
//        {jobStatus?.buttons}
//      </View>}
      <View style={[styles.center, { paddingVertical: px(15) }]}>
         {jobStatus?.buttons}
      </View>
    </View>
    <JobManagerRightContent data={data} />
  </View>
}

export default JobManagerRight

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
    padding: px(10),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  left: {
    width: px(205),
    height: px(168),
    borderRadius: px(8),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftImg: {
    width: px(54),
    height: px(54),
    marginRight: px(10),
  },
  rowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  itemButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: px(201),
    height: px(60),
    backgroundColor: '#FF9C40',
    borderRadius: px(4),
  },
  itemButtonCancel: {
    backgroundColor: '#2D7EF8',
  },
  itemButtonImg: {
    width: px(32),
    height: px(32),
    marginRight: px(12),
  },
  itemButtonText: {
    color: '#fff'
  },

  text26: {
    fontWeight: 500,
    fontSize: px(26),
    color: '#000',
  },
  mt6: {
    marginTop: px(6),
  },
  mb16: {
    marginBottom: px(16),
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
  textGreen: {
    color: '#13CE66',
  },
  textBold: {
    fontWeight: 'bold',
  }
})