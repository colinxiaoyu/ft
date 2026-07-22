import React, { useEffect } from "react";
import { View, StyleSheet, Image, Text, FlatList, ScrollView } from "react-native";

import HomeHeader from "../UIcomponents/HomeHeader";
import { height, px } from "../utils/ScreenUtils";
import FaultCardApp from "../UIcomponents/FaultCardApp";
import BackCom from "../components/BackCom";
import { connect } from "react-redux";
import { action } from "../utils";

const FaultListScreenApp = (props) => {

  const { faultList, faultDetail } = props;

  const id = props?.route?.params?.id;

  useEffect(() => {
    if (id) {
      props.dispatch(action('faultListScreenAppModal/getFaultDetail', { id: id }));
    } else {
      props.dispatch(action('faultListScreenAppModal/postFaultlist'));
    }
  }, [id])

  useEffect(() => {
    return () => props.dispatch(action('faultListScreenAppModal/clear'));
  }, [])

  // 忽略故障
  function onConfim (data) {
    props.dispatch(action('faultListScreenAppModal/putFaultId', { faultData: data }));
  }


  return <View style={styles.container}>
    <HomeHeader style={styles.header} />
    <View style={styles.content}>
      <BackCom title={'故障详情'} />

      <View style={styles.tableHeader}>
        <Text style={[styles.text24, { flex: 2 }]}>故障码</Text>
        <Text style={[styles.text24, { flex: 2 }]}>故障时间</Text>
        <Text style={[styles.text24, { flex: 2 }]}>故障车辆</Text>
        <Text style={[styles.text24, { flex: 1 }]}>解除</Text>
        <Text style={[styles.text24, { flex: 1 }]}>详情</Text>
      </View>
      {!!id ?
        <FaultCardApp data={faultDetail} onPress={onConfim} showDetail={true} />
        :
        <FlatList
          data={faultList}
          keyExtractor={item => item?.id?.toString()}
          renderItem={({ item }) => (
            <FaultCardApp data={item} onPress={onConfim} showDetail={false} />
          )}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
          onEndReached={
            () => props.dispatch(action('faultListScreenAppModal/postFaultlist'))
          }
          onEndReachedThreshold={0.5}
        />}



    </View>
  </View>
}

export default connect(({ faultListScreenAppModal: { faultList, faultDetail }, }) => ({
  faultList, faultDetail
}))(FaultListScreenApp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5EBEF',
  },

  header: {
    position: 'unset',
  },
  content: {
    flex: 1,
    paddingHorizontal: px(20),
  },


  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    flexDirection: 'row',
    paddingHorizontal: px(94),
    paddingVertical: px(24),
  },

  scrollview: {
    height: height - px(500),
  },

  text24: {
    fontWeight: 500,
    fontSize: px(24),
    color: '#333333',
  },

  textWhite: {
    color: '#fff',
  },

})