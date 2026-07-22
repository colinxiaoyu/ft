import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';

const SocketMessageModalScreen = (props) => {
  const { vinObj } = props

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages((prevMessages) => {
      const updatedMessages = [vinObj.toJS(), ...prevMessages];
      return updatedMessages;
    });
  }, [vinObj]);


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
  messageModal: { vinObj } }) => ({
    vinObj,
  }))(SocketMessageModalScreen);

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
