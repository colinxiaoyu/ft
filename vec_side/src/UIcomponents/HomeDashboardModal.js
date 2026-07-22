import React, { useMemo } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { px } from '../utils/ScreenUtils';

// 公用 控制台的弹窗
const HomeDashboardModal = ({ data, onConfirm, onCancel }) => {
  const { visible, modalType } = data;


  const text = useMemo(() => {
    switch (modalType) {
      case 0:
        return '是否需要将车辆返回充电点'
      case 1:
        return '是否需要将车辆返回停车点'
      case 2:
        return '是否需要将车辆切换为自动驾驶模式'
      case 3:
        return '是否需要将车辆切换为人工驾驶模式'
    }
  }, [modalType])
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}
          colors={['#FFEAEA', '#fff']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View>
            <Text style={styles.title}>确认提示</Text>
            <Text style={styles.content}>
              {text}
            </Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={onCancel}>
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.manual]} onPress={() => {
                onConfirm(modalType)
              }}>
                <Text style={[styles.buttonText, styles.manualText]}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>


        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 背景半透明
  },
  modalContainer: {
    width: px(819),  // 转换为物理像素（px）
    paddingTop: px(67),
    paddingHorizontal: px(56),
    paddingBottom: px(50),
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: px(16),
  },
  title: {
    fontSize: px(38), // 字体大小转为 px
    fontWeight: 'bold',
    marginBottom: px(33),
    textAlign: 'center',
  },
  content: {
    fontSize: px(32), // 字体大小转为 px
    textAlign: 'center',
    marginBottom: px(20),
    color: '#333'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: px(90),
  },
  button: {
    backgroundColor: 'rgba(51,51,51,0.1)',
    paddingVertical: px(20),
    paddingHorizontal: px(110),
    borderRadius: px(5),
    marginHorizontal: px(10),
    alignItems: 'center',
  },
  buttonText: {
    color: '#333333',
    fontSize: px(28),
    fontWeight: 'bold',
  },
  manual: {
    backgroundColor: '#2D7EF8'
  },
  manualText: {
    color: '#fff'
  }
});

export default HomeDashboardModal;
