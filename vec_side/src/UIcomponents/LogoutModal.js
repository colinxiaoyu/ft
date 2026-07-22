import React, { useMemo } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { px } from '../utils/ScreenUtils';
import { connect } from 'react-redux';
import { action } from '../utils';
import { useNavigation } from '@react-navigation/native';
import Api from '../utils/Api';

// 退出登录时的弹窗
const LogoutModal = (props) => {
  const { visible = false, title = '确认提示', handleSure, handleCancel, content = '' } = props;
  const navigation = useNavigation();

  function onConfirm () {

    Api.get('/admin/sso/logout').then(res => {

    }).finally(() => {
      window.token = null
      props.dispatch(action('userModal/save', { user: null }))
      handleSure && handleSure()
    })


  }

  function onCancel () {
    handleCancel && handleCancel()
  }

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
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>
              {content}
            </Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={onCancel}>
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.manual]} onPress={onConfirm}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: px(819),
    paddingTop: px(67),
    paddingHorizontal: px(56),
    paddingBottom: px(50),
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: px(16),
  },
  title: {
    fontSize: px(38),
    fontWeight: 'bold',
    marginBottom: px(33),
    textAlign: 'center',
  },
  content: {
    fontSize: px(32),
    lineHeight: px(38),
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

export default connect()(LogoutModal);
