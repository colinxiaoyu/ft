import React, { Fragment, useState } from "react";
import { TouchableOpacity, Image, Text, View, StyleSheet } from "react-native";
import { px } from "../utils/ScreenUtils";
import NewTaskModal from "./NewTaskModal";

// 手持端 选择 车辆后，右侧的新建任务

const HomeRightNewTaskApp = () => {


  const [modalVisible, setModalVisible] = useState(false);


  const openModal = () => {
    setModalVisible(true);
  };


  const closeModal = () => {
    setModalVisible(false);
  };

  return <Fragment>
    <View style={styles.container}>
      <TouchableOpacity style={styles.newTask} onPress={openModal}>
        <Image source={require('../assets/icon_newtask.png')} style={styles.newTaskImg} />
        <Text style={[styles.text24, styles.textWhite]} > 新建任务</Text>
      </TouchableOpacity>
    </View>
    {modalVisible && <NewTaskModal
      visible={modalVisible}
      onClose={closeModal}
    />}
  </Fragment>

}

export default HomeRightNewTaskApp


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: px(105),
    width: px(454),
    right: px(20),
  },
  newTask: {
    width: px(454),
    height: px(72),
    backgroundColor: '#2D7EF8',
    borderRadius: px(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: px(30),
  },
  newTaskImg: {
    width: px(37),
    height: px(37),
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