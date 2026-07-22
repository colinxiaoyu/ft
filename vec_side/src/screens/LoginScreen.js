import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Platform, StatusBar, Image, Alert, TouchableOpacity } from 'react-native';
import { px } from '../utils/ScreenUtils';
import { connect } from 'react-redux';
import { action } from '../utils';
import { CURRENT } from '../models/configModal';
import CryptoJS from 'crypto-js'
import Api, { getConfig } from '../utils/Api';
import { closeWs } from '../services/socketS';

const LoginScreen = (props) => {

  // 18611186171  ZP@Foton2025
  // 13261556808  asdfgh123456!

  const { currentApp, navigation, user } = props;

  const [username, setUsername] = useState(__DEV__ ? '17771461695' : '');
  const [password, setPassword] = useState(__DEV__ ? 'Fotonprod@2024' : '');


  const [captcha, setCaptcha] = useState({}); // 从后端获取到的 图形验证信息
  const [captchaValue, setCaptchaValue] = useState('')

  const [error, setError] = useState('');


  useEffect(() => {
    Api.setNavigation(navigation);
    closeWs()
  }, []);



  useEffect(() => {
    getImgCaptcha();

  }, [])


  useEffect(() => {
    if (user?.token) {
      window.token = user.token
      props.dispatch(action('configModal/getCommonConfigInfo'));
      props.dispatch(action('userModal/getCommonGoodList'));



      if (currentApp === CURRENT.VEH) {
        navigation.replace('HomeScreen')
      } else {
        navigation.replace('HomeScreenApp')
      }


    }
  }, [user])


  // 获取图形验证码
  const getImgCaptcha = () => {
    Api.get('/admin/sso/getGraphic', {}, {}, getConfig().BASE_URL1).then(res => {
      setCaptcha(res.data)
      setCaptchaValue('')
    })
  }

  function switchTo () {
    window.token = null

    props.dispatch(action('configModal/switchApp'));
  }


  // 登录逻辑
  const handleLogin = async () => {
    setError('');
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    const res = await Api.post('/admin/sso/login', {
      "captchaKey": captcha.captchaKey,
      "inputCode": captchaValue,
      "naCode": "+86",
      "password": CryptoJS.MD5(password).toString(CryptoJS.enc.Hex),
      "phone": username,
      "type": 1
    }, {}, getConfig().BASE_URL1)
    if (res.data) {
      props.dispatch(action('userModal/toLogin', {
        user: res.data
      }))
    } else {
      // getImgCaptcha()
    }
  };



  const isButtonEnabled = () => {
    return username.length > 0 && password.length > 0 && captchaValue.length === 4;
  };

  return (
    <ImageBackground
      source={require('../assets/img_logon_bg.png')} // 替换为你的背景图片路径
      style={styles.background}
    >
      <View style={styles.loginBox}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>欢迎登录</Text>
          <Text style={styles.headerBold}>
            {currentApp === CURRENT.VEH ?
              '福田智驾车载APP' : '福田智驾手持APP'}
          </Text>
        </View>


        {/* 用户名输入框 */}
        <View style={styles.inputContainer}>
          <Image source={require('../assets/icon_user.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="用户"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* 密码输入框 */}
        <View style={styles.inputContainer}>
          <Image source={require('../assets/icon_unlock.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="密码"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        < View style={styles.captchaContainer}>
          <TextInput
            style={[styles.input, styles.captchaInput]}
            placeholder="图形验证码"
            value={captchaValue}
            onChangeText={setCaptchaValue}
          />
          <TouchableOpacity onPress={getImgCaptcha}>
            <Image style={styles.captcha} source={{ uri: captcha.captchaImg }} />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={[styles.button, !isButtonEnabled() && styles.disabledButton]}

          onPress={handleLogin} disabled={!isButtonEnabled()}>
          <Text style={[styles.buttonText, !isButtonEnabled() && styles.disabledButtonText]}>
            登录
          </Text>
        </TouchableOpacity>
      </View>

      {/* OpenLayers 地图替换验证入口，仅调试包可见，验证结束后连同 OLMapTestScreen 一起删除 */}
      {__DEV__ && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('OLMapTestScreen')
          }}
          style={{ position: 'absolute', left: px(20), bottom: px(220), backgroundColor: '#2D7EF8', padding: px(20) }}>
          <Text style={{ color: '#fff' }}> OL地图测试</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SettingsScreen')
        }}
        style={{ position: 'absolute', left: px(20), bottom: px(120), backgroundColor: 'red', padding: px(20) }}>
        <Text > 配置App</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={switchTo}
        style={{ position: 'absolute', left: px(20), bottom: px(20), backgroundColor: 'red', padding: px(20) }}>
        <Text > 切换App</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginBox: {
    width: px(732),
    padding: px(57),
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // 半透明白色背景
    borderRadius: px(20),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  headerContainer: {
    width: '100%',
  },
  header: {
    fontWeight: '500',
    fontSize: px(42),
    color: '#333333'
  },
  headerBold: {
    fontWeight: 'bold',
    fontSize: px(58),
    color: '#333333',
    marginTop: px(28),
    marginBottom: px(59),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: px(24),
    paddingVertical: px(4),
    marginBottom: 15,
    borderRadius: px(3),
    backgroundColor: '#fff'
  },
  icon: {
    width: px(28),
    height: px(28),
    marginRight: px(28),
  },
  input: {
    flex: 1, // 让输入框填满剩余空间
  },
  button: {
    backgroundColor: '#2D7EF8',
    width: '100%',
  },
  buttonText: {
    textAlign: 'center',
    lineHeight: px(76),
    fontSize: px(29),
    color: '#fff',
    fontWeight: 'bold',
  },
  captchaContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: px(20),
  },

  captchaInput: {
    width: px(100),
    backgroundColor: '#fff',
    marginRight: px(20),
    borderRadius: px(3),

  },
  captcha: {
    width: px(200),
    height: px(60),
  },
  errorText: {
    color: 'red',
    fontSize: px(14),
    textAlign: 'center',
    marginBottom: px(12),
  },
  disabledButton: {
    backgroundColor: '#e5e5e5',
  },
  disabledButtonText: {
    color: 'rgba(255,255,255)',
  },
});

export default connect(({ configModal: { currentApp }, userModal: { user } }) => ({
  currentApp, user
}))(LoginScreen);
