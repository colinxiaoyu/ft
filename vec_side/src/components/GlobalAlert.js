// GlobalAlert.js
import React, { useEffect, useState } from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { pubSub } from '../utils/pubsub';
import { px } from '../utils/ScreenUtils';

const GlobalAlert = () => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    const handleAlert = (message) => {

      setMessage(message);
      setVisible(true);

      setTimeout(() => {
        hideAlert();
      }, 3000);
    };

    pubSub.subscribe('showAlert', handleAlert);

    return () => {
      pubSub.unsubscribe('showAlert', handleAlert);
    };
  }, []);

  const hideAlert = () => {
    setVisible(false);
    setMessage('');
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={hideAlert}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.alertBox} onPress={hideAlert}>
          <Text style={styles.message}>{message}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#fff',
    borderRadius: px(10),
    alignItems: 'center',
    backgroundColor: 'rgba(255,239,241,0.8)',
    borderRadius: px(8),
    borderWidth: 1,
    borderColor: '#C8253D'
  },
  message: {
    marginHorizontal: px(80),
    marginVertical: px(12),
    fontSize: px(28),
    marginBottom: px(20),
    color: '#C8253D',
  },
});

export default GlobalAlert;
