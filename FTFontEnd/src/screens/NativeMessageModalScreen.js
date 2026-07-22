import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { connectToServer, useNativeMessageListener } from '../services/V2CMessageS';
import { connect } from 'react-redux';

const NativeMessageModalScreen = (props) => {

  const { VinMessage } = props

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { tapPos, scramFlag, remoteScramFlag, driveMode, soc, velocity, position, vehicleId, ...rest } = VinMessage
    handleNativeMessage({ tapPos, scramFlag, remoteScramFlag, driveMode, soc, velocity, position, vehicleId })
  }, [VinMessage]);



  function handleNativeMessage (message) {
    setMessages((prevMessages) => {
      const updatedMessages = [message, ...prevMessages];
      return updatedMessages.slice(0, 100);
    });
  }

  console.log('VinMessage', VinMessage)


  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {messages.map((message, index) => (
          <View key={index} style={styles.messageContainer}>
            <Text style={styles.messageText}>{JSON.stringify(message)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


export default connect(({
  nativeMessageModal: { VinMessage } }) => ({
    VinMessage
  }))(NativeMessageModalScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  scrollView: {
    width: '100%',
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
});
