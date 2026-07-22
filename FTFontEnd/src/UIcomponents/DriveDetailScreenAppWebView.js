import React, { useEffect, useMemo, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { debugHttpServer } from '../utils/Api';


// 废弃
const DriveDetailScreenAppWebView = (props) => {

  const webviewRef = useRef(null);

  const { data } = props


  console.log('DriveDetailScreenAppWebView data', data)

  const position = [data?.position.lon, data?.position?.lat]


  // 注入 JavaScript 的代码
  const injectedJS = `
    (function() {
      const position = ${JSON.stringify(position)};
      const reason = "${11}";
      addAlertMarker(position, reason);
      reSetCenter(position);
    })();
  `;


  // 处理 WebView 发送过来的消息
  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data?.messageType === 'mapOnload') {
      webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
    }
  };

  const uri = useMemo(() => {
    if (__DEV__) {
      return `${debugHttpServer}/index_taskDetail.html?v=2`
    } else {
      return 'file:///android_asset/index_taskDetail.html'
    }
  }, [])

  if (!data) {
    return null
  }
  return (
    <WebView
      key={data.vin}
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
      cacheEnabled={false}
    />
  );
};

export default DriveDetailScreenAppWebView;
