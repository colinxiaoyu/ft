import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { action, debugging, getWalkedPath, isEmptyObject } from '../utils';
import { toFloat } from '../utils/mathTools';

import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { px } from '../utils/ScreenUtils';
import DragXViewProgress from './DragXViewProgress';
import DragXViewSpeed from './DragXViewSpeed';
import { debugHttpServer } from '../utils/Api';

// 任务页 右侧的webview

const JobManagerRightContentWebView = (props) => {

  const webviewRef = useRef(null);

  const { historyList, speed, progress, isplay, data, jobPath, mapKey, isFollow } = props;

  const [showTask, setShowTask] = useState(true);

  const [isFollowing, setIsFollowing] = useState(true); // 是否跟随车辆

  // 切换跟随状态
 function toggleFollow() {
  const newFollowState = true;
  setIsFollowing(newFollowState);
}

  function handleSpeed (result) {
    props.dispatch(action('jobManagerScreenAppModal/save', { speed: result, isplay: false }));
  }

  function handleProgress (result) {
    props.dispatch(action('jobManagerScreenAppModal/save', { progress: result, isplay: false }));
    timer.current && clearTimeout(timer.current);
  }

  function switchPlay () {
    props.dispatch(action('jobManagerScreenAppModal/switchPlay'));
  }


  const timmerId = useRef();
  useEffect(() => {

    if (isplay && webviewRef?.current) {
      injctMarker();
    }

    return () => timmerId.current && clearInterval(timmerId.current);
  }, [progress, isplay, webviewRef?.current, speed]);


  const key = useMemo(() => {

    return mapKey + '43';
  }, [mapKey]);


  console.log('jobPath', jobPath);
  const timer = useRef();

  function injctMarker () {

    const length = historyList.length - 1;
    const index = Math.floor(progress * length);


    const value = historyList[index];


    if (index <= length) {

      const allPath = historyList.map((item) => {
        return [parseFloat(item.longitude), parseFloat(item.latitude)];
      });

      const walkPath = getWalkedPath(allPath, [value.longitude, value.latitude]);

      console.log('walkPath', walkPath);

      const injectedJS = `
          var value = ${JSON.stringify(value)}
          var allPath = ${JSON.stringify(allPath)}
          var walkPath = ${JSON.stringify(walkPath)}
          var walkKey = 'walkKey'
          var layerKey = 'layerKey' 
          
          var key = 'move'
          if (findMarker(key)) {
            moveMakersAndUpdate(key, [value.longitude, value.latitude], null, value.heading)
            addRoute(walkPath, walkKey, layerKey, '#2D7EF8')
            ${isFollowing ? 'reSetCenter([value.longitude, value.latitude])' : ''}
          } else {
            addCurrentMarker([value.longitude, value.latitude], key, null, value.heading);
            ${isFollowing ? 'reSetCenter([value.longitude, value.latitude])' : ''}
          }
    `;

      webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);

      timer.current = setTimeout(() => {

        const newProgress = speed / length + progress;

        props.dispatch(action('jobManagerScreenAppModal/save', { progress: newProgress }));

      }, 1000);
    } else {
      timer.current && clearTimeout(timer.current);
      props.dispatch(action('jobManagerScreenAppModal/save', { progress: 0, isplay: false, speed: 1 }));
    }
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
      toInjectedDragJS();
    } else if (message?.messageType === 'Console') {
      console.log('formwebview', message);
    } else if (message?.messageType === 'mapDrag') {
      // 用户拖动地图时，关闭跟随
      setIsFollowing(false);
    }
  };




  const uri = useMemo(() => {
    if (__DEV__) {
      return `${debugHttpServer}/index_taskDetail.html?v=${key}`;
    } else {
      return 'file:///android_asset/index_taskDetail.html';
    }
  }, []);


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
          point: path?.[0],
          name: startPoint?.startPointName,
        };

        const end = {
          point: path?.[path?.length - 1],
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

    return result;
  }, [jobPath]);




  // 绘制总体路径
  function toInjectedPathJS () {
    const pathData = JSON.stringify(transformData);

    const allPath = historyList.map((item) => {
      return [parseFloat(item.longitude), parseFloat(item.latitude)];
    });



    if (pathData === '{}') {return;}
    const injectedJS = `
      var pathData = ${pathData}
      var allPath = ${JSON.stringify(allPath)}
      Object.entries(pathData).map(([key, value]) => {
        reSetCenter(value.path[0])

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
      var key = 'route'
      addRoute(allPath, key + 'source', key + 'layer', '#96A7BC')

    `;
    webviewRef.current && webviewRef.current.injectJavaScript(injectedJS);
  }


  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <View style={{
        position: 'absolute',
        bottom: px(40),
        left: px(20),
        width: px(967),
        zIndex: 20,
      }}>
        <TouchableOpacity style={styles.topContainer} onPress={() => setShowTask(!showTask)}>
          <Text style={styles.topLeftText}>轨迹回放</Text>
          <View style={styles.topRight}>
            <Text style={[styles.text20, styles.textBlue]}>{showTask ? '收起' : '展开'}</Text>
            <Image style={styles.topImg} source={!showTask ? require('../assets/icon_right.png') : require('../assets/icon_top.png')} />
          </View>
        </TouchableOpacity>

        {showTask && (
          <View style={styles.container}>
            <DragXViewProgress handleProgress={handleProgress} progress={progress} />
            <View style={[styles.playContainer, { paddingTop: px(20) }]}>
              <View style={{ flex: 1 }}  />
              <TouchableOpacity style={{ flex: 1, alignContent: 'center' }} onPress={switchPlay}>
                <Image source={isplay ? require('../assets/icon_history_pause.png') : require('../assets/icon_history_start.png')} style={styles.playImg} />
              </TouchableOpacity>
              <View style={[styles.playContainer, { flex: 1 }]}>
                <DragXViewSpeed showResult speed={speed} handleSpeed={handleSpeed}>
                  <Image source={require('../assets/icon_history_speed.png')} style={styles.speed} />
                </DragXViewSpeed>
              </View>
            </View>
          </View>
        )}
      </View>
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
        injectedJavaScript={debugging}
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
        cacheEnabled={false}
      />
    </View>

  );
};



export default connect(({ jobManagerScreenAppModal: {
  historyList, speed, progress, isplay,
},
}) =>
({
  historyList, speed, progress, isplay,
}))(JobManagerRightContentWebView);


const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: px(24),
    paddingVertical: px(13),
    borderTopLeftRadius: px(16),
    borderTopRightRadius: px(16),
    flex: 1,

  },
  topLeftText: {
    fontWeight: 'bold',
    fontSize: px(26),
    color: '#000000',
  },
  topRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topImg: {
    marginLeft: px(5),
    width: px(14),
    height: px(14),
  },
  text20: {
    fontWeight: '500',
    fontSize: px(20),
    color: '#333333',
  },
  textBlue: {
    color: '#2D7EF8',
  },

  container: {
    paddingHorizontal: px(20),
    paddingVertical: px(20),
    borderBottomLeftRadius: px(16),
    borderBottomRightRadius: px(16),
  },

  playContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playImg: {
    width: px(38),
    height: px(38),
    alignSelf: 'center',

  },
  speed: {
    width: px(16),
    height: px(30),

  },
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
