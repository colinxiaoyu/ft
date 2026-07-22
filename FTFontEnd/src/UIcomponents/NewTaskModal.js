import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, TextInput } from 'react-native';
import { height, px } from '../utils/ScreenUtils';
import PickerModal from '../components/PickerModal';
import { connect } from 'react-redux';
import { CURRENT } from '../models/configModal';
import { action } from '../utils';
import { pubSub } from '../utils/pubsub';
import NewTaskModalWebView from './NewTaskModalWebView';
import InputPickerModal from '../components/InputPickerModal';
import { Portal } from 'react-native-paper';
import VehNewTaskModalWebView from './VehNewTaskModalWebView';

// 公用新建任务时的弹窗

const NewTaskModal = (props) => {
  const { vehPath, visible, onClose, currentApp, deviveryList, goodsLists, stationList, vehList, vin, vinObj, selectedJobDetail, selectedJobDetailApp, vehPathData, VinMessage } = props;


  function onConfirm () {
    if (currentApp === CURRENT.APP) {
      if (deviveryList?.length === 0) {
        pubSub.publish('showAlert', '送货清单有误');
        return
      }
      if (!deviveryList?.every(obj => obj && Object.entries(obj).every(([key, val]) => {
        console.log('key,val', key, val)
        if (key === 'startPointId' || key === 'endPointId') {
          return val !== null && val !== undefined && val !== ''

        }
        return true
      }))) {
        pubSub.publish('showAlert', '送货清单有误');
        return
      }
      props.dispatch(action('newTaskModalModal/postJobCreate'))
    } else {
      if (!vehPathData?.startPoint || !vehPathData?.endPoint) {
        pubSub.publish('showAlert', '送货清单有误');
        return
      }
      props.dispatch(action('newTaskModalModal/postJobCreate'))

    }



    onClose && onClose()
  }

  function onCancel () {
    onClose && onClose()
  }


  const jobDetail = useMemo(() => {
    if (currentApp === CURRENT.APP) {
      return selectedJobDetailApp
    } else {
      return selectedJobDetail
    }
  }, [selectedJobDetailApp, selectedJobDetail])


  useEffect(() => {
    if (currentApp === CURRENT.APP) {
      if (deviveryList?.length > 0) {

        if (!vin) {
          pubSub.publish('showAlert', '请选择执行车辆VIN码');
          return
        }
        const stationIdList = []
        for (let index = 0; index < deviveryList.length; index++) {
          const element = deviveryList[index];
          stationIdList.push(element.startPointId)
          stationIdList.push(element.endPointId)
        }

        if (stationIdList.includes(undefined)) {
          return
        }
        props.dispatch(action('newTaskModalModal/pathPlan', { stationIdList: stationIdList }))
      }
    }

  }, [deviveryList])


  useEffect(() => {
    props.dispatch(action('newTaskModalModal/init'))

    return () => props.dispatch(action('newTaskModalModal/clear'))
  }, [])



  const selectedVinObj = useMemo(() => {
    return vinObj?.filter((value, key) => key === vin)
  }, [vinObj, vin])

  function onAdd () {
    props.dispatch(action('newTaskModalModal/onAdd'))
  }

  // 手持App 更改 goodlist
  function onSelect (item, i, type) {

    let obj = {}
    switch (type) {
      case 'goods':
        obj.goodsCode = item.id
        obj.goodsMame = item.value

        break;
      case 'startPoint':
        obj.startPointId = item.id
        obj.startPointName = item.value
        obj.startPoint = item.positionDTO
        break;
      case 'endPoint':
        obj.endPointId = item.id
        obj.endPointName = item.value
        break
    }

    props.dispatch(action('newTaskModalModal/onSelect', { obj, i }))
  }


  // 车载App 更改 目的地
  function onSelectEndStation (item,) {
    if (item?.id) {
      props.dispatch(action('newTaskModalModal/pathPlanPoint', { stationIdList: [item.id] }))
    } else {
      pubSub.publish('showAlert', '该站点有误');
    }
  }


  function onSelectVin (item) {
    props.dispatch(action('newTaskModalModal/clear'))
    props.dispatch(action('newTaskModalModal/save', { vin: item.id }))
    props.dispatch(action('newTaskModalModal/onSelectVin'))
  }

  function onDelete (i) {
    props.dispatch(action('newTaskModalModal/onDelete', { i }))

  }

  function onGoddsdDesChange (i, value) {
    props.dispatch(action('newTaskModalModal/onGoddsdDesChange', { i, value }))

  }

  return (
    <Portal>
      <Modal
        visible={true}
        transparent={true}
        animationType="none"
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={[styles.title, { width: px(900) }]}>新建任务</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.close}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickers}>
              {currentApp === CURRENT.VEH && <PickerModal direction="row" style={styles.picker} title="目的地" addAll={false}
                initData={stationList} onSelect={(item) => onSelectEndStation(item)}
              />}
              <PickerModal direction="row" style={styles.picker} title="任务编码" disable />
              {currentApp === CURRENT.APP &&
                <PickerModal direction="row" style={styles.picker} title="执行车辆VIN码" addAll={false}
                  initData={vehList} onSelect={(item) => onSelectVin(item)}

                />}

            </View>

            {currentApp === CURRENT.APP && deviveryList?.length > 0 && <View>
              {/* <View style={styles.centerContainer}>
                <Text>送货清单</Text>
                {vin && <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                  <Image source={require('../assets/icon_add.png')} style={styles.addButtonImg} />
                  <Text style={styles.addButtonText}>新增清单</Text>
                </TouchableOpacity>}
              </View> */}

              <View style={styles.tabTitle}>
                <Text style={[styles.tabText, { width: px(830) }]}>货物名称</Text>
                <Text style={[styles.tabText, { width: px(420) }]}>起始点</Text>
                <Text style={[styles.tabText, { width: px(350) }]}>目的地</Text>
                {/* <Text style={styles.tabText}>操作</Text> */}
              </View>
              {deviveryList?.map((item, i) => {
                return <View style={styles.tabContainer} key={item.id}>
                  <InputPickerModal direction="row" style={styles.tabPicker}
                    title=""
                    addAll={false}
                    initData={goodsLists} onSelect={(item) => onSelect(item, i, 'goods')} />
                  <TextInput
                    style={styles.goodsDesInput}
                    placeholder="请输入货物名称说明"
                    placeholderTextColor="#999"
                    value={item.goodsDes} onChangeText={(value) => onGoddsdDesChange(i, value)} />

                  <PickerModal direction="row" style={styles.tabPicker} title="" addAll={false}
                    initData={stationList} onSelect={(item) => onSelect(item, i, 'startPoint')}
                  />
                  <PickerModal direction="row" style={styles.tabPicker} title="" addAll={false}
                    initData={stationList} onSelect={(item) => onSelect(item, i, 'endPoint')}
                  />
                  {/* <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(i)}>
                    <Image source={require('../assets/icon_delete.png')} style={styles.deleteImg} />
                  </TouchableOpacity> */}
                </View>
              })}
            </View>}

            {currentApp === CURRENT.VEH ? <VehNewTaskModalWebView vehPathData={vehPathData} VinMessage={VinMessage} mapKey={'NewTaskModalWebView'} jobDetail={jobDetail} /> :
              <NewTaskModalWebView data={vehPath} deviveryList={deviveryList} vinData={selectedVinObj} mapKey={'NewTaskModalWebView' + vin} jobDetail={jobDetail} />}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={onCancel}>
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
                <Text style={[styles.buttonText, styles.confirmText]}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default connect(({ configModal: { currentApp }, messageModal: { vinObj }, nativeMessageModal: { VinMessage },
  userModal: { goodsLists },
  jobManagerScreenModal: { selectedJobDetail }, jobManagerScreenAppModal: { selectedJobDetail: selectedJobDetailApp },
  newTaskModalModal: { deviveryList, stationList, vehList, vin, vehPath, vehPathData } }) => ({
    currentApp, goodsLists, deviveryList, stationList, vehList, vin, vehPath, vinObj, selectedJobDetail, selectedJobDetailApp, vehPathData, VinMessage
  }))(NewTaskModal);


const styles = StyleSheet.create({
  // 背景遮罩层，确保模态显示时背景会有黑色透明遮罩
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end', // 右侧显示模态
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色背景

  },
  container: {
    width: px(1667),  // 控制模态宽度，适当调整
    height: '100%',   // 控制模态高度
    backgroundColor: '#fff',
    padding: px(20),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: px(20),
  },
  title: {
    fontSize: px(26),
    color: '#000',
    fontWeight: 'bold',
  },
  close: {
    marginLeft: px(600),
    padding: px(20),
    fontSize: px(26),
    color: '#000',
  },
  pickers: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: px(40),
  },
  picker: {
    width: px(656),
    height: px(60),
    backgroundColor: 'rgba(78,111,160,0.1)',
  },

  centerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: px(20),
  },
  addButton: {
    backgroundColor: '#2D7EF8',
    borderRadius: px(4),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: px(14),
    paddingVertical: px(8),
  },
  addButtonImg: {
    width: px(26),
    height: px(26),
    marginRight: px(8),
  },
  addButtonText: {
    fontSize: px(22),
    color: '#fff',
  },

  tabTitle: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgba(238,241,246,0.5)',
    borderRadius: px(8),
    paddingHorizontal: px(38),
    paddingVertical: px(13),
  },
  tabText: {
    fontSize: px(24),
    color: '#333',
    fontWeight: 'bold',
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: px(38),
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    paddingVertical: px(18),
    justifyContent: 'space-between',
  },
  tabPicker: {
    width: px(320),
    height: px(60),
    backgroundColor: 'rgba(78,111,160,0.1)',
  },
  goodsDesInput: {
    width: px(320),
    height: px(60),
    backgroundColor: 'rgba(78,111,160,0.1)',
    fontSize: px(24),
    paddingVertical: px(4)
  },
  deleteButton: {
    paddingHorizontal: px(20),
    paddingVertical: px(10),
  },
  deleteImg: {
    width: px(48),
    height: px(48),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: px(40),
  },
  button: {
    backgroundColor: 'rgba(51,51,51,0.1)',
    paddingVertical: px(14),
    paddingHorizontal: px(80),
    borderRadius: px(5),
  },
  buttonText: {
    color: '#333333',
    fontSize: px(24),
    fontWeight: 'bold',
  },
  confirm: {
    backgroundColor: '#2D7EF8',
    marginLeft: px(18),
  },
  confirmText: {
    color: '#fff',
  },
});

