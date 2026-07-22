import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { getConfig } from '../utils/Api';
import { connect } from 'react-redux';


// 车载首页3d页面
const Home3DWebView = (props) => {

  const webviewRef = useRef(null);

  const { VinMessage } = props

  console.log('VinMessage', VinMessage)

  useEffect(() => {
    webviewRef?.current?.postMessage(JSON.stringify({ VinMessage: VinMessage }));
  }, [VinMessage, webviewRef?.current])


  const handleMessage = (event) => {
    const message = event.nativeEvent.data;

    if (message === 'mapOnload') {


    }
  };


  return (
    <View
      style={props.style}
    >
      <WebView
        key={6}
        originWhitelist={['*']}
        ref={webviewRef}
        source={{ uri: getConfig().web3DUrl, headers: { 'Cache-Control': 'no-cache' } }}
        // source={{ uri: 'https://www.baidu.com/', }}
        style={props.style}
        javaScriptEnabled={true}
        onMessage={handleMessage}
        onError={(e) => {
          console.error(e.nativeEvent.description)
          alert('WebView error:' + e.nativeEvent.description)
        }}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        useWebKit={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowingReadAccessToURL="*"
        mixedContentMode="always"
        cacheEnabled={false}

      />
    </View>
  );
};



export default connect(({ nativeMessageModal: { VinMessage } }) => ({
  VinMessage
}))(Home3DWebView);
