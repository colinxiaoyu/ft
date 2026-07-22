import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView } from "react-native";

import HomeHeader from "../UIcomponents/HomeHeader";
import { height, px, width } from "../utils/ScreenUtils";
import PickerModal from "../components/PickerModal";
import JobCard from "../UIcomponents/JobCard";
import JobManagerRight from "../UIcomponents/JobManagerRight";
import NewTaskModal from "../UIcomponents/NewTaskModal";
import BackCom from "../components/BackCom";
import { connect } from "react-redux";
import { action } from "../utils";
import InputPickerModal from "../components/InputPickerModal";


const JobManagerScreen = (props) => {

  const { jobList,
    jobNo,
    workNo,
    goods,
    startPointId,
    currentVin,
    endPointId, selectedJob, selectedJobDetail,
    goodsLists, stationList, recordsList, refreshCount
  } = props

  const [modalVisible, setModalVisible] = useState(false);

  const jobNoList = useMemo(() => {
    return recordsList.map(item => ({
      id: item.jobNo,
      value: item.jobNo,
    }))

  }, [recordsList])

  const workNoList = useMemo(() => {
    return recordsList.map(item => ({
      id: item.workNo,
      value: item.workNo,
    }))
  }, [recordsList])


  useEffect(() => {
    props.dispatch(action('jobManagerScreenModal/init'))
    return () => {
      props.dispatch(action('jobManagerScreenModal/clear'))
    }
  }, [refreshCount])

  useEffect(() => {
    postJobLostFetch()
  }, [refreshCount])


  useEffect(() => {
    props.dispatch(action('jobManagerScreenModal/getJobDetail'))
  }, [refreshCount])



  function postJobLostFetch () {
    props.dispatch(action('jobManagerScreenModal/postJobList', {
      jobNo,
      workNo,
      goods,
      startPointId,
      endPointId,
      vin: currentVin,
    }));
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };


  function onItemPress (itemData) {
    props.dispatch(action('jobManagerScreenModal/onSelectJob', { selectedJob: itemData }))

  }

  function onSelect (item, type) {
    props.dispatch(action('jobManagerScreenModal/save', { [type]: item.id }))

    props.dispatch(action('jobManagerScreenModal/postJobList', {
      jobNo,
      workNo,
      goods,
      startPointId,
      endPointId,
      vin: currentVin,
      [type]: item.id,
    }));
  }

  const jobNoRef = useRef();
  const workNoRef = useRef();
  const goodsRef = useRef();
  const startRef = useRef();
  const endRef = useRef();


  function reset () {
    jobNoRef.current?.resetData()
    workNoRef.current?.resetData()
    goodsRef.current?.resetData()
    startRef.current?.resetData()
    endRef.current?.resetData()
    props.dispatch(action('jobManagerScreenModal/reset'));
  }

  function search () {
    postJobLostFetch()
  }

  return <View style={styles.container}>
    <HomeHeader style={styles.header} />
    <View style={styles.content}>
      <View style={styles.contentHeader}>
        <BackCom title='任务管理' />
        <View style={styles.contentHeaderRight}>
          <TouchableOpacity style={[styles.contentHeaderRightButton]} onPress={search}>
            <Text style={[styles.text24, styles.textWhite]}> 查询</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contentHeaderRightButton, { backgroundColor: '#627CA4' }]} onPress={reset}>
            <Text style={[styles.text24, styles.textWhite]}> 重置</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.selectContainer}>
        <InputPickerModal title={'任务编号'} style={{ width: px(490) }} ref={jobNoRef}
          initData={jobNoList} onSelect={(item) => onSelect(item, 'jobNo')}
        />
        <InputPickerModal title={'工单编号'} style={{ width: px(490) }} ref={workNoRef}
          initData={workNoList} onSelect={(item) => onSelect(item, 'workNo')}
        />
        <InputPickerModal title={'货物名称'} style={{ width: px(287) }} ref={goodsRef}
          otherFiliter={(item, searchQuery) => {
            return item?.goodsNamePy?.toLowerCase().includes(searchQuery.toLowerCase())
          }}
          initData={goodsLists} onSelect={(item) => onSelect({ ...item, id: item.value }, 'goods')}
        />
        <InputPickerModal title={'任务起点'} style={{ width: px(287) }} ref={startRef}
          initData={stationList} onSelect={(item) => onSelect(item, 'startPointId')}
        />
        <InputPickerModal title={'任务终点'} style={{ width: px(289) }} ref={endRef}
          initData={stationList} onSelect={(item) => onSelect(item, 'endPointId')}
        />
      </View>


      <View style={styles.detailHeader}>
        <Text style={[styles.title, { width: px(408) }]}>任务列表</Text>
        <View style={styles.detailHeaderRight}>

          <Text style={[styles.title]}>任务信息</Text>
          <TouchableOpacity style={styles.newTask} onPress={openModal}>
            <Image source={require('../assets/icon_newtask.png')} style={styles.newTaskImg} />
            <Text style={[styles.text24, styles.textWhite]}> 新建任务</Text>
          </TouchableOpacity>
        </View>

      </View>

      <View style={styles.detail}>
        <View style={styles.detailLeft}>
          <ScrollView style={styles.scrollview}>
            {
              jobList?.records?.map((item, i) => {
                const selected = item.id === selectedJob?.id
                return <JobCard data={item} key={item.id}
                  selected={selected}
                  onItemPress={() => onItemPress(item)}

                />
              })
            }
          </ScrollView>
        </View>
        {selectedJobDetail && <JobManagerRight data={selectedJobDetail} />}
      </View>
    </View>

    {modalVisible && <NewTaskModal
      visible={modalVisible}
      onClose={closeModal}
    />}
  </View>
}


export default connect(({ jobManagerScreenModal: {
  jobList,
  jobNo,
  workNo,
  goods,
  startPointId,
  endPointId,
  selectedJob,
  selectedJobDetail,
  stationList, recordsList,
}, configModal: { currentVin, refreshCount }, userModal: { goodsLists }
}) =>
({
  jobList,
  jobNo,
  workNo,
  goods,
  startPointId,
  endPointId,
  selectedJob,
  selectedJobDetail,
  goodsLists, stationList, recordsList,
  currentVin, refreshCount
}))(JobManagerScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5EBEF',
  },

  header: {
    position: 'unset',
  },

  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  contentHeaderRight: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: px(12),
  },
  contentHeaderRightButton: {
    width: px(140),
    height: px(52),
    backgroundColor: '#2D7EF8',
    borderRadius: px(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: px(10),
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
  detailHeaderRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: px(20),
  },

  title: {
    fontSize: px(26),
    color: '000',
    fontWeight: 'bold',
  },

  newTask: {
    width: px(230),
    height: px(60),
    backgroundColor: '#2D7EF8',
    borderRadius: px(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  newTaskImg: {
    width: px(37),
    height: px(37),
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