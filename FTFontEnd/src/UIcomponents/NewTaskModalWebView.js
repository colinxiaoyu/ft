import React, { useEffect, useMemo, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { debugging } from '../utils';
import { accDiv, toFloat } from '../utils/mathTools';
import { debugHttpServer } from '../utils/Api';

// 新建任务时的弹窗 webview 手持端


const NewTaskModalWebView = (props) => {

  const webviewRef = useRef(null);


  const { data, deviveryList, vinData, mapKey, jobDetail } = props;


  // const [estGoTime, estMileage] = useMemo(() => {

  //   return [toFloat(jobDetail?.vehDetailVO?.estGoTime / 60), toFloat(jobDetail?.vehDetailVO?.estMileage / 1000)]

  // }, [jobDetail])



  const start = useMemo(() => {

    return deviveryList ? deviveryList[0]?.startPointName : ''

  }, [deviveryList])

  const startPoint = useMemo(() => {
    return deviveryList ? [deviveryList[0]?.startPoint?.lon, deviveryList[0]?.startPoint?.lat] : ''

  }, [deviveryList])


  const end = useMemo(() => {
    return deviveryList ? deviveryList[deviveryList.length - 1]?.endPointName : ''
  }, [deviveryList])

  useEffect(() => {
    toInjectedJS()
  }, [data, start, end])

  useEffect(() => {
    toInjectedMarkerJS()
  }, [vinData])


  function toInjectedMarkerJS () {
    const vehicleData = JSON.stringify(vinData.toJS())

    const injectedJS = `
        var vehicleData = ${vehicleData}
        Object.entries(vehicleData).map(([key, value]) => {
          if (findMarker(key)) {
            moveMakersAndUpdate(key, [value.longitude, value.latitude], value.vehStatus,value.heading)
          } else {
            addCurrentMarker([value.longitude, value.latitude], key, value.vehStatus,value.heading);
            reSetCenter([value.longitude, value.latitude])
          }
        });
    `
    webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
  }


  function toInjectedJS () {
    if (data?.length > 0) {
      let path = []
      let distance = 0

      data.map(item => {
        item.pointList.map(a => {
          path.push([a.lon, a.lat])
        })
        distance = distance + item.distance
      })


      const time = toFloat(distance / 60 * 1.38, 1)

      distance = toFloat(accDiv(distance, 1000), 1)


      const injectedJS = `
        var path = ${JSON.stringify(path)};
        var distance =${distance}
        var time =${time}
        var startPoint = ${JSON.stringify(startPoint)}
          
        addRoute(path, 'unwalkedPathsourceKey', 'unwalkedPathlayerId', '#96A7BC')
        reSetCenter(path[0])

        delMakers('start')
        delMakers('end')

        addStartMarker(startPoint, null, '${start}', null)
        addEndMarker(path[path.length - 1], null,  '${end}', distance, time, null)
      `

      webviewRef.current && webviewRef.current?.injectJavaScript(injectedJS);
    }
  }





  // 处理 WebView 发送过来的消息
  const handleMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);

    if (message?.messageType === 'mapOnload') {
      toInjectedJS()
      toInjectedMarkerJS()
    } else if (message?.messageType === 'Console') {
      console.log('formwebview', data)
    }
  };

  const key = useMemo(() => {
    return mapKey
  }, [mapKey])
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
      injectedJavaScript={debugging}
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

export default NewTaskModalWebView;


