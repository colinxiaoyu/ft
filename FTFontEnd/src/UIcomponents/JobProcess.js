import React, { Fragment, useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { height, px } from "../utils/ScreenUtils";


// 任务页 右侧的 悬浮的数据，任务进程

const JobProcess = (props) => {

  const { data } = props;

  const taskList = data.taskList || []


  const [showTask, setShowTask] = useState(false)

  return <Fragment>

    <TouchableOpacity style={[styles.topContainer, {
      borderBottomLeftRadius: !showTask && px(16), borderBottomRightRadius: !showTask && px(16)
    }]} onPress={() => setShowTask(!showTask)}>
      <Text style={styles.topLeftText}>任务进程</Text>
      <View style={styles.topRight}>
        <Text style={[styles.text20, styles.textBlue]}>{showTask ? '收起' : '展开'}</Text>
        <Image style={styles.topImg} source={!showTask ? require('../assets/icon_right.png') : require('../assets/icon_top.png')} />
      </View>
    </TouchableOpacity>

    {showTask && <ScrollView
      style={[styles.contentContainer]}
      contentContainerStyle={styles.contentContainerStyle}
    >

      {/* 0:未分配 1:执行中 2:已暂停 3:已分配 5:路由不可达 9:已完成 */}
      {
        taskList.map((item, i) => {
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
              sortBgColor = '#2D7EF8'
              texColor = '#2D7EF8'
              textBg = 'rgba(45,126,248,0.06)'
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
            case -2:
              statusText = '作业失败'
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
    </ScrollView>}
  </Fragment>
}

export default JobProcess

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
    height: px(264),
    width: px(391),
    paddingHorizontal: px(24),
    paddingVertical: px(20),
    backgroundColor: '#fff',
  },
  contentContainerStyle: {
    paddingBottom: px(40),

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
    paddingVertical: px(8),
    justifyContent: 'space-between'
  },

  statusItemImg: {
    marginLeft: px(12),
    height: px(44),
    width: px(10),
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