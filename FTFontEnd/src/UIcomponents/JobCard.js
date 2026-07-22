import React, { useMemo } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { height, px } from "../utils/ScreenUtils";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";

// 任务页 左侧的卡片
const JobCard = (props) => {

  const { data, cardType = 'hold', onPause, onContinue, onCancel, onItemPress, selected } = props;




  function getButtonGroupValue (buttonGroup, operations) {
    return buttonGroup?.map(item => {
      if (operations.includes(item.key)) {
        return item.value
      }
    }).filter(item => !!item)

  }

  const cardContent = useMemo(() => {


    const buttonGroup = [
      {
        key: "PAUSE",
        value: <TouchableOpacity style={styles.itemButton} onPress={onPause}>
          <Image source={require('../assets/icon_pause.png')} style={styles.itemButtonImg} />
          <Text style={styles.itemButtonText}>暂停</Text>
        </TouchableOpacity>
      },
      {
        key: "CANCEL",
        value: <TouchableOpacity style={[styles.itemButton, styles.itemButtonCancel]} onPress={onCancel}>
          <Image source={require('../assets/icon_cancel.png')} style={styles.itemButtonImg} />
          <Text style={[styles.itemButtonText, styles.itemButtonTextCancel]}>取消</Text>
        </TouchableOpacity>
      },
      {
        key: "CONTINUE",
        value: <TouchableOpacity style={styles.itemButton} onPress={onContinue}>
          <Image source={require('../assets/icon_start.png')} style={styles.itemButtonImg} />
          <Text style={styles.itemButtonText}>继续</Text>
        </TouchableOpacity>
      },
    ]


    // 可操作按钮 START_DELIVERY:开始送货 UNLOADED:卸货完成 CANCEL:取消 PAUSE:暂停 CONTINUE:继续
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

  }, [data?.status])


  return <LinearGradient
    colors={['#FFFFFF', selected ? '#CCE0FF' : '#fff']}
    start={{ x: 1, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.container, selected && styles.containerBorder]}>
    <View style={styles.header}>
      <View style={[styles.headerStart, { backgroundColor: cardContent.startBg }]} />
      <Text>{cardContent.headerText}</Text>
    </View>

    <View style={styles.divider} />
    <TouchableOpacity style={[styles.content,]} onPress={onItemPress}>
      <View style={[styles.item, styles.mb22]}>
        <Text style={styles.text22}>
          工单编号
        </Text>
        <Text style={styles.text20}>
          {data?.workNo}
        </Text>
      </View>

      <View style={[styles.item, styles.mb22]}>
        <Text style={styles.text22}>
          执行时间
        </Text>
        <Text style={styles.text20}>
          {data?.startTime}- {data?.endTime}
        </Text>
      </View>

      <View style={[styles.item, cardType === 'app' && styles.mb22]}>
        <Text style={styles.text22}>
          执行车辆VIN码
        </Text>
        <Text style={styles.text20}>
          {data?.vin}
        </Text>
      </View>
    </TouchableOpacity>
    {cardType === 'app' && <View style={[styles.itemButtons,
    cardContent.leftButton !== null && cardContent.rightButton !== null && { marginTop: px(12) }]}>
      {cardContent.buttons}
    </View>}
  </LinearGradient>
}

export default connect()(JobCard);




const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: px(408),
    padding: px(20),
    borderRadius: px(8),
    marginBottom: px(10),
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerStart: {
    width: px(4),
    height: px(22),
    marginRight: px(15),
    backgroundColor: '#627CA4'
  },

  headerStartGreen: {
    backgroundColor: '#13CE66'
  },

  headerStartGrey: {
    backgroundColor: '#627CA4'
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    width: px(370),
    marginVertical: px(15),
  },

  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between'
  },

  containerBorder: {
    borderBottomWidth: px(4),
    borderColor: '#2D7EF8',
  },

  itemButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: px(168),
    height: px(56),
    backgroundColor: '#2D7EF8',
    borderRadius: px(4),
  },
  itemButtonCancel: {
    backgroundColor: 'rgba(230,106,68,0.06)',
  },
  itemButtonImg: {
    width: px(32),
    height: px(32),
    marginRight: px(4),
  },
  itemButtonText: {
    color: '#fff'
  },
  itemButtonTextCancel: {
    color: '#E56A44'
  },
  text22: {
    fontSize: px(22),
    color: '#333',
  },
  text20: {
    fontSize: px(20),
    color: '#333',
  },
  mb22: {
    marginBottom: px(22),
  }
})