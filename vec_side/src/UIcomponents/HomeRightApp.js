import React, { useEffect, useMemo, useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { height, px } from "../utils/ScreenUtils";
import AlertInfo from "./AlertInfo";
import { pubSub } from "../utils/pubsub";

// 手持端 选择 车辆后，车辆的状态 包括任务进程 和报警信息
const HomeRightApp = (props) => {

  const { data, faultData, vehStatus } = props

  const taskList = data?.taskList


  const [showTask, setShowTask] = useState(true)


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


  useEffect(() => {
    if (vehStatus !== 2) {
      setShowTask(false)
    }
  }, [vehStatus])

  function handleShowTask () {
    if (vehStatus !== 2) {
      pubSub.publish('showAlert', '该车辆没有正在执行的任务信息，无法查看当前任务信息');
      return
    }
    setShowTask(!showTask)
  }




  return <View style={styles.container}>
    <View style={{ marginBottom: px(20) }}>
      <TouchableOpacity style={[styles.topContainer,
      {
        borderBottomLeftRadius: !showTask && px(16), borderBottomRightRadius: !showTask && px(16)
      }]} onPress={() => handleShowTask()}>
        <View style={styles.topLeft}>
          <Image style={styles.topLeftImg} source={require('../assets/icon_task.png')} />
          <Text style={styles.topLeftText}>任务进程</Text>
        </View>
        <View style={styles.topRight}>
          <Text style={[styles.text20, styles.textBlue]}>{showTask ? '收起' : '展开'}</Text>
          <Image style={styles.topImg} source={!showTask ? require('../assets/icon_right.png') : require('../assets/icon_top.png')} />
        </View>
      </TouchableOpacity>

      {showTask && <View
        style={[styles.contentContainer]}
      >
        <View style={styles.statusDivider} />
        <View style={styles.currentStatus}>
          <Text style={[styles.text20,]}>任务状态</Text>
          <Text style={[styles.text20, { color: taskStatus.startBg }]}> {taskStatus.headerText}</Text>
        </View>
        <View style={styles.statusDivider} />

        {/* 0:未分配 1:执行中 2:已暂停 3:已分配 5:路由不可达 9:已完成 */}
        {
          taskList?.map((item, i) => {
            let sortBgColor, texColor, textBg, statusText;

            switch (item.status) {
              case 0:
                statusText = '未分配'
                sortBgColor = '#13CE66'
                texColor = '#333333'
                textBg = 'rgba(19,206,102,0.06)'

                break;
              case 1:
                statusText = '执行中'
                sortBgColor = '#2D7EF8'
                texColor = '#2D7EF8'
                textBg = 'rgba(45,126,248,0.06)'

                break;
              case 2:
                statusText = '已暂停'
                sortBgColor = '#999999'
                texColor = '#999999'
                textBg = 'rgba(153,153,153,0.06)'
                break;
              case 3:
                statusText = '已分配'
                sortBgColor = '#999999'
                texColor = '#999999'
                textBg = 'rgba(153,153,153,0.06)'
                break;
              case 5:
                statusText = '路由不可达'
                sortBgColor = '#999999'
                texColor = '#999999'
                textBg = 'rgba(153,153,153,0.06)'
                break;
              case 9:
                statusText = '已完成'
                sortBgColor = '#13CE66'
                texColor = '#333'
                textBg = 'rgba(19,206,102,0.06)'
                break;
              case -1:
                statusText = '已取消'
                sortBgColor = '#999999'
                texColor = '#999999'
                textBg = 'rgba(153,153,153,0.06)'
                break;

            }
            return <View key={i} style={styles.statusItem}>
              <View style={styles.statusItemContent}>
                <View style={[styles.statusItemSort, { backgroundColor: sortBgColor }]}>
                  <Text style={[styles.text14, styles.textWhite, { textAlign: 'center' }]}>{i + 1}</Text>
                </View>
                <View style={[styles.statusItemTexts, { backgroundColor: textBg }]}>
                  <Text style={[styles.text20, { color: texColor }]}>{statusText}</Text>
                  <Text style={[styles.text20, { color: texColor }]}>{item.endPointName}</Text>
                  <Text style={[styles.text20, { color: texColor }]}>{item.actionName}</Text>
                  <Text style={[styles.text20, { color: texColor }]}>{item.action}</Text>
                </View>
              </View>
              {taskList.length - 1 !== i &&
                <Image source={require('../assets/img_strip.png')} style={styles.statusItemImg} />}
            </View>
          })
        }
      </View>}

    </View>
    <AlertInfo data={faultData} />

  </View>
}

export default HomeRightApp

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: px(205),
    width: px(454),
    right: px(20),
  },

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
    paddingVertical: px(20),
    backgroundColor: '#fff',
  },
  statusDivider: {
    width: px(367),
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: px(9),
  },
  currentStatus: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },

  statusItem: {

  },
  statusItemContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItemSort: {
    width: px(32),
    height: px(32),
    borderRadius: px(16),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: px(10),
  },
  statusItemTexts: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: px(8),
  },

  statusItemImg: {
    marginLeft: px(10),
    width: px(10),
    height: px(44),
  },

  text24: {
    fontWeight: 500,
    fontSize: px(24),
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

})