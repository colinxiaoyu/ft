import React, { useEffect, useMemo } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView } from "react-native";

import HomeHeader from "../UIcomponents/HomeHeader";
import { height, px } from "../utils/ScreenUtils";
import PickerModal from "../components/PickerModal";
import FaultCard from "../UIcomponents/FaultCard";
import FaultListRight from "../UIcomponents/FaultListRight";
import BackCom from "../components/BackCom";
import { action } from "../utils";
import { connect } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";


const faultStatus = [
  { id: 0, value: '未解除' },
  { id: 1, value: '已忽略' },
]

const FaultListScreen = (props) => {

  const navigation = useNavigation();

  const { faultList, status, faultCode, selectFaultCard, faultListRecord, faultDetail } = props

  const id = props?.route?.params?.id;

  useEffect(() => {
    if (id) {
      props.dispatch(action('faultListScreenModal/getFaultDetail', { id: id }));
    } else {
      props.dispatch(action('faultListScreenModal/postFaultlist', { status, faultCode }));
    }

  }, [status, faultCode, id])

  useEffect(() => {
    return () => props.dispatch(action('faultListScreenModal/clear'));

  }, [])

  const faultCodeList = useMemo(() => {

    return faultListRecord?.map(item => {
      return { id: item?.faultCode, value: item?.faultCode }
    })

  }, [faultListRecord])

  function onSelect (item, key) {
    props.dispatch(action('faultListScreenModal/save', { [key]: item.id }));
  }

  console.log('id', id)

  function handleCardPress (item) {
    props.dispatch(action('faultListScreenModal/save', { selectFaultCard: item }));

  }

  // 解除故障
  function onConfim (data) {
    if (id) {
      props.dispatch(action('faultListScreenModal/putFaultId', { faultData: data, id: id }));

      // navigation.navigate('FaultListScreen', { id: id })
    } else {
      props.dispatch(action('faultListScreenModal/putFaultId', { faultData: data }));

    }
  }

  return <View style={styles.container}>
    <HomeHeader style={styles.header} />

    <View style={styles.content}>
      <BackCom title={'故障详情'} />
      {!id && <View style={styles.selectContainer}>
        <PickerModal title={'故障状态'} direction='row' style={{ width: px(490) }} initData={faultStatus}
          onSelect={(item) => onSelect(item, 'status')} />
        <PickerModal title={'故障代码'} direction='row' style={{ width: px(490) }} initData={faultCodeList}
          onSelect={(item) => onSelect(item, 'faultCode')} />


      </View>}
      <View style={styles.detailHeader}>
        <Text style={[styles.title, { width: px(428) }]}>故障列表</Text>
        <Text style={[styles.title]}>故障基础信息</Text>
      </View>

      <View style={styles.detail}>
        <View style={styles.detailLeft}>
          {!id && <FlatList
            data={faultList}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={5}
            renderItem={({ item }) => {
              const selected = selectFaultCard.id === item.id
              return <FaultCard data={item} key={item.id} onPress={handleCardPress} selected={selected} />
            }}
            keyExtractor={(item, index) => item?.id?.toString()}
            onEndReached={
              () => props.dispatch(action('faultListScreenModal/postFaultlist'))
            }
            onEndReachedThreshold={0.5}
          />}
        </View>
        {!!id && <FaultListRight data={faultDetail} onConfim={onConfim} />}
        {!id && selectFaultCard?.id && <FaultListRight data={selectFaultCard} onConfim={onConfim} />}
      </View>
    </View>
  </View>
}


export default connect(({ faultListScreenModal: { faultList, status, faultCode, selectFaultCard, faultListRecord, faultDetail }, }) => ({
  faultList, status, faultCode, selectFaultCard, faultListRecord, faultDetail
}))(FaultListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5EBEF',
  },
  header: {
    position: 'static',
  },
  content: {
    flex: 1,
    paddingHorizontal: px(20),
  },

  selectContainer: {
    display: 'flex',
    flexDirection: 'row',
  },

  detailHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: px(20)
  },

  title: {
    fontSize: px(26),
    color: '000',
    fontWeight: 'bold',
  },

  detail: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },

  detailLeft: {
    marginRight: px(20),
  },

  scrollview: {
  },

  detailRight: {

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