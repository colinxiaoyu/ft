import React, { useEffect, useMemo, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { debugging, isEmptyObject } from '../utils';
import { accDiv, toFloat } from '../utils/mathTools';
import { connect } from 'react-redux';
import { debugHttpServer } from '../utils/Api';

// 新建任务时的弹窗 webview 车载端

const VehNewTaskModalWebView = (props) => {

  const webviewRef = useRef(null);


  const { vehPathData, VinMessage, mapKey } = props;


  // const [estGoTime, estMileage] = useMemo(() => {

  //   return [toFloat(jobDetail?.vehDetailVO?.estGoTime / 60), toFloat(jobDetail?.vehDetailVO?.estMileage / 1000)]

  // }, [jobDetail])



  const start = useMemo(() => {
    return vehPathData ? vehPathData?.startPoint?.name : ''
  }, [vehPathData])

  const startPoint = useMemo(() => {
    return [vehPathData?.startPoint?.positionDTO?.lon, vehPathData?.startPoint?.positionDTO.lat]

  }, [vehPathData])


  const end = useMemo(() => {
    return vehPathData ? vehPathData?.endPoint?.name : ''
  }, [vehPathData])

  useEffect(() => {
    toInjectedJS()
  }, [start, end])

  useEffect(() => {
    toInjectedMarkerJS()
  }, [VinMessage])


  function toInjectedMarkerJS () {
    if (isEmptyObject(VinMessage)) {
      return
    }
    const vehicleData = JSON.stringify({
      [VinMessage.vehicleId]: {
        heading: VinMessage.heading,
        longitude: VinMessage.position?.longitude,
        latitude: VinMessage.position?.latitude,
      }
    })

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


  // 注入路径
  function toInjectedJS () {
    if (vehPathData?.pathPlanList?.length > 0) {
      let path = []
      let distance = 0

      vehPathData?.pathPlanList?.map(item => {
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

export default VehNewTaskModalWebView


