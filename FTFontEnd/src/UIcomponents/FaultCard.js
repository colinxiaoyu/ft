import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { height, px } from "../utils/ScreenUtils";
import LinearGradient from "react-native-linear-gradient";

// 故障信息 车机端
const FaultCard = (props) => {

  const { data, onPress, selected } = props;

  function handlePress () {
    onPress && onPress(data)
  }

  return <LinearGradient
    colors={['#FFFFFF', selected ? '#CCE0FF' : '#fff']}
    start={{ x: 1, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.container, selected && styles.containerBorder]}>
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.header}>
        <View style={[styles.headerStart, data?.status === 0 ? styles.headerStartRed : styles.headerStartGrey]} />
        <Text style={[styles.text24, styles.textBold]}>{data?.status === 0 ? '未解除' : '已解除'}</Text>
      </View>

      <View style={styles.divider} />
      <View style={[styles.content,]}>
        <View style={styles.item}>
          <Text style={[styles.text22, { marginBottom: px(10) }]}>
            故障代码
          </Text>
          <Text style={[styles.text22, { marginBottom: px(20) }]}>
            {data?.faultCode}
          </Text>
        </View>

        <View>
          <Text style={[styles.text22, { marginBottom: px(10) }]}>
            报警时间
          </Text>
          <Text style={styles.text20}>
            {data?.startTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  </LinearGradient>
}

export default FaultCard;


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
  },
  headerStartGrey: {
    backgroundColor: '#627CA4'
  },
  headerStartRed: {
    backgroundColor: '#C8253D'
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
  text24: {
    fontSize: px(22),
    color: '#333',
  },
  text22: {
    fontSize: px(22),
    color: '#333',
  },
  text20: {
    fontSize: px(20),
    color: '#333',
  },
  textBold: {
    fontWeight: 'bold',
  }
})