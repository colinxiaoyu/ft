import React, { useMemo } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { px } from '../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';


// 车机控制 急停
const EmergencyPhysicsModal = (props) => {

  const { VinMessage } = props

  const visible = useMemo(() => VinMessage?.scramFlag === 1, [VinMessage?.scramFlag])


  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalBackground}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/image_alert.png')} // 替换为你的图片链接
            style={styles.image}
            resizeMode="contain" // 保持图片的纵横比，并适应容器
          />
        </View>
        <LinearGradient style={styles.modalContainer}
          colors={['#FFEAEA', '#fff']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}>

          <View>
            <Text style={styles.title}>提示</Text>
            <Text style={styles.content}>
              车辆处于紧急制动状态，
            </Text>
            <Text style={styles.content}>
              需解除紧急制动或转为人工驾驶，
            </Text>
            <Text style={styles.content}>
              即可恢复正常功能使用。
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default connect(({ nativeMessageModal: { VinMessage } }) => ({
  VinMessage
}))(EmergencyPhysicsModal);


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 背景半透明
  },
  modalContainer: {
    width: px(819),  // 转换为物理像素（px）
    paddingTop: px(112),
    paddingHorizontal: px(56),
    paddingBottom: px(50),
    borderRadius: px(16),
    alignItems: 'center',
  },
  imageContainer: {
    transform: [{ translateY: 50 }],
    zIndex: 20,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: px(126),
    height: px(126),

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
    backgroundColor: 'rgba(241,75,75,0.1)',
    paddingVertical: px(20),
    paddingHorizontal: px(110),
    borderRadius: px(5),
    marginHorizontal: px(10),
    alignItems: 'center',
  },
  buttonText: {
    color: '#F14B4B',
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

