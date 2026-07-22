import React, { useEffect, useMemo, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { debugging } from '../utils';
import { debugHttpServer } from '../utils/Api';


// 故障信息  右侧 webview

const FaultListRightWebView = (props) => {

  const webviewRef = useRef(null);

  const { data } = props


  const { location, faultDesc } = data

  const position = [location?.lon, location?.lat]


  function toInjectedJS () {
    const injectdata = JSON.stringify({
      position: position,
      reason: faultDesc,
      status: data.status + '',
    })
    // 注入 JavaScript 的代码
    const injectedJS = `
      var injectdata = ${injectdata};
      addAlertMarker(injectdata.position, injectdata.reason, injectdata.status);
      reSetCenter(injectdata.position);
  `;

    webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
  }



  // 处理 WebView 发送过来的消息
  const handleMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    console.log('message', message)

    if (message?.messageType === 'mapOnload') {
      toInjectedJS()

    } else if (message?.messageType === 'Console') {
      console.log('formwebview', message?.data)
    }
  };

  const key = useMemo(() => {
    return data.id + '12'
  }, [data])

  const uri = useMemo(() => {
    if (__DEV__) {
      return `${debugHttpServer}/index_taskDetail?v=${key}`
    } else {
      return 'file:///android_asset/index_taskDetail.html'
    }
  }, [])



  return (
    <WebView
      key={key}
      originWhitelist={['*']}
      ref={webviewRef}
      source={{ uri: uri, headers: { 'Cache-Control': 'no-cache' } }}
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
      injectedJavaScript={debugging}
      cacheEnabled={false}

    />
  );
};

export default FaultListRightWebView;
