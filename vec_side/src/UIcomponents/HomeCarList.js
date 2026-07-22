import React, { useState } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { height, px } from "../utils/ScreenUtils";
import { useNavigation } from "@react-navigation/native";
import { getVehStatus } from "../utils";


// 手持端 左侧 车辆列表
const HomeCarList = (props) => {

  const { vehList, vinObj } = props


  const [show, setShow] = useState(true)

  const navigation = useNavigation()

  const renderTag = (status) => { // 0:离线 1:空闲 2:执行中

    switch (status) {
      case 1:
        return <View style={[styles.status, styles.bold, styles.unUseBg,]}>
          <Text style={[styles.text22, styles.textGreey]}>{getVehStatus(status)}</Text>
        </View>

      case 2:
        return <View style={[styles.status, styles.bold, styles.greenBg,]}>
          <Text style={[styles.text22, styles.textGreen]}>{getVehStatus(status)}</Text>
        </View>
      case 0:
        return <View style={[styles.status, styles.bold, styles.greenBg,]}>
          <Text style={[styles.text22, styles.textGreey]}>{getVehStatus(status)}</Text>
        </View>

    }
  }


  return <View style={styles.container}>
    <TouchableOpacity style={styles.topContainer} onPress={() => setShow(!show)}>
      <Text style={styles.topContainerText}>车辆列表</Text>
      <View style={styles.topRight}>
        <Text style={[styles.text20, styles.textBlue]}>{show ? '收起' : '展开'}</Text>
        <Image style={styles.topImg} source={!show ? require('../assets/icon_right.png') : require('../assets/icon_top.png')} />
      </View>
    </TouchableOpacity>

    {show && <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainerStyle}
      showsVerticalScrollIndicator={false}
    >
      {
        vehList?.map((item, i) => {
          return <TouchableOpacity
            key={i}
            style={styles.contentItem}
            onPress={() => {
              navigation.navigate('DriveDetailScreenApp', { data: item })
            }}
          >
            <View style={styles.contentItemTop}>
              <View style={styles.contentItemTopLeft}>
                <View style={styles.divier} />
                <Text style={[styles.text22]}>执行车辆VIN码</Text>
              </View>

              {renderTag(vinObj.getIn([item.vin, 'vehStatus']))}
            </View>
            <Text style={styles.text20}>{item.vin}</Text>
          </TouchableOpacity>
        })
      }
    </ScrollView>
    }
  </View>
}

export default HomeCarList;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: px(105),
    width: px(466),
    left: px(20),
  },

  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: px(24),
    borderTopLeftRadius: px(16),
    borderTopRightRadius: px(16),
    backgroundColor: 'rgba(255,255,255,0.9)'

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

  scrollView: {
    maxHeight: height - px(220),
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomLeftRadius: px(16),
    borderBottomRightRadius: px(16),
  },
  contentContainerStyle: {
    paddingHorizontal: px(22),
    paddingBottom: px(20),

  },

  contentItem: {
    backgroundColor: '#fff',
    paddingHorizontal: px(12),
    paddingVertical: px(22),
    marginBottom: px(10),
    borderRadius: px(8),
  },
  contentItemTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: px(20),
  },
  contentItemTopLeft: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  divier: {
    backgroundColor: '#1869D8',
    width: px(4),
    height: px(22),
    marginRight: px(10),
  },

  status: {
    width: px(100),
    height: px(38),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(16),
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
  },
  textGreey: {
    color: '#999999',
  },
  textArrive: {
    color: '#627CA4'
  },
  greenBg: {
    backgroundColor: 'rgba(19,206,102,0.2)'
  },

  unUseBg: {
    backgroundColor: 'rgba(153,153,153,0.1)'
  },

  arriveBg: {
    backgroundColor: 'rgba(98,124,164,0.1)'
  }


})