import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { getConfig, setCurrentEnv } from '../utils/Api';
import { px } from '../utils/ScreenUtils';


const SettingsScreen = ({ navigation }) => {


  const [vcTcp, setVcTcp] = useState(getConfig().vcTcp);
  const [vcTcpPort, setVcTcpPort] = useState(getConfig().vcTcpPort);
  const [env, setEnv] = useState('dev')



  function cancel () {
    navigation.goBack(); // 返回上一页
  }

  function switchEnv () {
    const newEnv = env === 'dev' ? 'pro' : 'dev';
    setEnv(newEnv)


  }

  function sure () {
    setCurrentEnv(env, vcTcp, vcTcpPort)

    navigation.popToTop()
    navigation.replace('LoginScreen')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={styles.label}>{"当前环境 " + env}</Text>


      <Text style={styles.label}>VC TCP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter VC TCP Address"
        value={vcTcp}
        onChangeText={setVcTcp}
      />
      <Text style={styles.label}>VC TCP Port</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter VC TCP Port"
        keyboardType="numeric"
        value={vcTcpPort + ''}
        onChangeText={(text) => setVcTcpPort(Number.parseInt(text))}
      />
      <Button title="cancel" onPress={cancel} style={styles.button} />
      <Button style={styles.button}
        onPress={() => {
          switchEnv()
        }} title={"切换"} />
      <Button style={styles.button}
        onPress={() => {
          sure()
        }} title={"确定"} />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    marginBottom: px(100)
  }
});

export default SettingsScreen;
