import React, { useEffect, useMemo, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { debugging, getVehStatus, getWalkedPath, isEmptyObject } from '../utils';
import { toFloat } from '../utils/mathTools';
import { debugHttpServer } from '../utils/Api';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { px } from '../utils/ScreenUtils';
// 首页和 任务页的webview
const HomeWebView = (props) => {

  const { data, jobPath, onClickCar = () => { }, mapKey, jobBeforeAfterList, faultObj, homeRefreshFalg, isFollow } = props;

  const [isFollowing, setIsFollowing] = useState(true); // 是否跟随车辆

  // 切换跟随状态
  function toggleFollow() {
    const newFollowState = true;
    setIsFollowing(newFollowState);

    // 如果重新开启跟随，立即更新地图中心点
    if (newFollowState && data) {
      const vehicleData = data?.toJS();
      if (vehicleData && Object.keys(vehicleData).length > 0) {
        const firstVehicle = vehicleData[Object.keys(vehicleData)[0]];

        const injectedJS = `
          reSetCenter([${firstVehicle.longitude}, ${firstVehicle.latitude}]);
        `;
        webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
      }
    }
  }

  useEffect(() => {
    if (homeRefreshFalg > 1) { // 接收到刷新指令，清空 webview 上的内容
      toInjectedClearAllJS();
    }
  }, [homeRefreshFalg]);

  const transformData = useMemo(() => {


    const result = {};

    Object.keys(jobPath).forEach(vin => {
      const item = jobPath[vin];

      if (!isEmptyObject(item) && item?.goodsList !== null) {
        const path = item?.taskList?.flatMap(task =>
          task.planTrack.map(track => [track.lon, track.lat])
        );

        const startPoint = item.goodsList?.[0];
        const endPoint = item.goodsList?.[item.goodsList?.length - 1];

        const start = {
          point: [startPoint?.startPosition?.lon, startPoint?.startPosition?.lat],
          name: startPoint?.startPointName,
        };

        const end = {
          point: [endPoint?.endPosition?.lon, endPoint?.endPosition?.lat],
          name: endPoint?.endPointName,
          distance: item?.vehDetailVO?.estMileage ? toFloat(item?.vehDetailVO?.estMileage / 1000) : '--',
          time: item?.vehDetailVO?.estGoTime || '--',
        };

        result[vin] = {
          path,
          start,
          end,
        };
      }

    });

    const filteredData = Object.fromEntries(
      Object.entries(result).filter(([key, value]) => value.path.length > 0)
    );

    return filteredData;
  }, [jobPath]);


  // 绘制已走 path
  const walkPathObj = useMemo(() => {
    if (!data) {return null;}
    const result = {};

    Object.entries(data?.toJS()).map(([key, value]) => {
      const pathObj = transformData[key];

      if (pathObj && pathObj.path?.length !== 0) {
        const walkPath = getWalkedPath(pathObj.path, [value.longitude, value.latitude]);

        result[key] = {
          path: walkPath,

        };
      }
    });

    return result;

  }, [transformData, data]);


  const webviewRef = useRef(null);


  useEffect(() => {
    toInjectedPathJS();
  }, [transformData]);

  useEffect(() => {
    allMoveJS();
  }, [data, faultObj]);


  // 绘制小车位置
  function toInjectedVehJS () {
    const vehicleData = JSON.stringify(data?.toJS());


    const injectedJS = `
        var vehicleData = ${vehicleData}
        Object.entries(vehicleData).map(([key, value]) => {
          if (findMarker(key)) {
            moveMakersAndUpdate(key, [value.longitude, value.latitude], value.vehStatus,value.heading)
            ${isFollowing ? 'reSetCenter([value.longitude, value.latitude])' : ''}
          } else {
            addCurrentMarker([value.longitude, value.latitude], key, value.vehStatus,value.heading);
            ${isFollowing ? 'reSetCenter([value.longitude, value.latitude])' : ''}
          }
        });
    `;
    return injectedJS;

    // webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
  }



  function toInjectedPopUpJS () {

    const vehicleData = data?.toJS();

    if (!vehicleData) {return;}


    const res = { ...vehicleData };
    for (let index = 0; index < Object.keys(vehicleData).length; index++) {
      const element = Object.keys(vehicleData)[index];


      const vehObj = vehicleData[element];

      res[element].fault = (faultObj?.[element]?.[0]?.status === 0 && faultObj?.[element]?.[0]?.isIgnore === 0) && faultObj?.[element]?.[0]?.faultDesc || '';


      if (jobBeforeAfterList?.[element]?.length > 0) {

        let currentindex = 0;

        const newValue = jobBeforeAfterList[element].map((item, i) => {
          if (item.status === 1) {
            currentindex = i;
          }
          const dataDistance = (item.status === 1 || item.status === 2) ? vehObj?.remMileage : item.estMileage;
          const dataTime = (item.status === 1 || item.status === 2) ? vehObj?.remGoTime : item.estGoTime;
          return {
            status: item.status,
            dataEndPoint: item.endPointName,
            dataDistance: dataDistance > 0 ? dataDistance + 'm' : '--',
            dataTime: dataTime ? dataTime + 'min' : '--',
            dataStatus: getJobStatusText(item.status),
          };
        });

        // data  数据

        res[element].data = newValue || '';
        res[element].currentindex = currentindex + '';
        res[element].speed = vehObj?.velocity ? toFloat(vehObj?.velocity * 0.036) + 'km / h' : '--';
        res[element].workstatus = getVehStatus(vehObj?.vehStatus);
        res[element].runstatus = vehObj?.velocity === 0 ? '停车' : '行驶';
        res[element].drivemodetext = vehObj.driveMode === 4 ? '自动驾驶' : '人工驾驶';
        res[element].haveJob = 'true';
      } else {
        res[element].haveJob = 'false';
      }
    }



    const injectedJS = `
        var popResult = ${JSON.stringify(res)}
        Object.entries(popResult).map(([key, value]) => {
        if (value.vehStatus === 0 && value.fault === '') {
          delPopup(key)
        } else {
          if (findPopup(key)) {
            movePopupAndUpdate(key, [value.longitude, value.latitude], value)
          } else {
            addCurrentPopup([value.longitude, value.latitude], key, value);
          }
        }
      });
    `;
    return injectedJS;
    // webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
  }



  // 注入已行走路径
  function toInjectedWalkJS () {

    const walkPathData = JSON.stringify(walkPathObj);


    if (walkPathData === '{}' || walkPathData === 'null') {return;}

    const injectedJS = `
      var walkPathData = ${walkPathData}      

       Object.entries(walkPathData).map(([key, value]) => {

        var walkKey = key+'walkKey'
        var layerKey = key+'layerKey'

        if (value && value.path?.length !== 0) {
          addRoute(value.path, walkKey, layerKey, '#2D7EF8')
        }
      });
    `;

    return injectedJS;
    // webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
  }

  // 拼接
  function allMoveJS () {

    const allJS = toInjectedVehJS() + toInjectedWalkJS() + toInjectedPopUpJS();


    webviewRef.current && webviewRef.current.injectJavaScript(allJS);
  }

  // 注入 未行走的路径 和 起点终点
  function toInjectedPathJS () {
    const pathData = JSON.stringify(transformData);

    if (pathData === '{}') {return;}

    const injectedJS = `
      var pathData = ${pathData}
      Object.entries(pathData).map(([key, value]) => {
        addRoute(value.path, key + 'source', key + 'layer', '#96A7BC')

        var startKey = key + 'start'
        if (findMarker(startKey)) {
          moveMakers(startKey, value.start.point,)
        } else {
          addStartMarker(value.start.point, null, value.start.name, startKey)
        }

        var endKey = key + 'end'
        if (findMarker(endKey)) {
          moveMakers(endKey, value.end.point,)
        } else {
          addEndMarker(value.end.point, null, value.end.name, value.end.distance, value.end.time, endKey)
        }
      });
    `;
    webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
  }

  function toInjectedClearAllJS () {
    const injectedJS = `
      clearAll()
    `;
    webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
  }

  //添加 地图drag 事件
  function toInjectedDragJS () {
    // 添加地图拖动监听
    const injectedJS = `
      map.on('dragstart', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          messageType: 'mapDrag'
        }));
      });
    `;
    webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
  }

  // 处理 WebView 发送过来的消息
  const handleMessage = (event) => {

    const message = JSON.parse(event.nativeEvent.data);


    if (message?.messageType === 'mapOnload') {
      toInjectedPathJS();
      allMoveJS();
      toInjectedDragJS();
    } else if (message?.messageType === 'Console') {
      console.log('formwebview', message?.data);
    } else if (message?.messageType === 'mapClick') { // 处理点击小车事件
      onClickCar && onClickCar(message.markerKey);
    } else if (message?.messageType === 'mapDrag') {
      // 用户拖动地图时，关闭跟随
      setIsFollowing(false);
    }
  };

  const key = useMemo(() => {
    return mapKey + '22';
  }, [mapKey]);


  const uri = useMemo(() => {
    if (__DEV__) {
      return `${debugHttpServer}/index_taskDetail?v=${key}`;
    } else {
      return 'file:///android_asset/index_taskDetail.html';
    }
  }, []);


  return (
    <View style={{ flex: 1, position: 'relative' }}>
    {isFollow && <TouchableOpacity
        style={styles.followButton}
        onPress={toggleFollow}
      >
        <Image
          source={require('../assets/follow.png')}
          style={styles.followIcon}
          defaultSource={require('../assets/follow.png')}
        />
      </TouchableOpacity>}
    <WebView
      key={key}
      originWhitelist={['*']}
      ref={webviewRef}
      source={{ uri: uri, headers: { 'Cache-Control': 'no-cache' } }}
      style={props.style}
      javaScriptEnabled={true}
      onMessage={handleMessage}
      onError={(e) => {
        console.error(e.nativeEvent.description);
        alert('WebView error:' + e.nativeEvent.description);
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
    </View>
  );
};

export default HomeWebView;

// 添加样式
const styles = StyleSheet.create({
  followButton: {
    position: 'absolute',
    bottom: px(50),
    right: px(20),
    width: px(50),
    height: px(50),
    borderRadius: px(25),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  followIcon: {
    width: px(30),
    height: px(30),
    transform: [{ rotate: '45deg' }],
  },
});
function getJobStatusText (status) {
  switch (status) {
    case 0:
      return '未执行';
    case 1:
      return '执行中';
    case 2:
      return '已暂停';
    case 3:
      return '待执行';
    case 9:
      return '已完成';
    case -1:
      return '已取消';
    case -2:
      return '作业失败';
    default:
      return '';
  }
}

function getJobStatusBg (status) {
  switch (status) {
    case 0:
      return '#EC8526';//'未执行'
    case 1:
      return '#13CE66'; // '执行中'
    case 2:
      return '#2D7EF8 ';//'已暂停'
    case 3:
      return '#EC8526';//'未执行'
    default:
      return '';
  }
}
