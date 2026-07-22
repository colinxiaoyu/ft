import React, {useMemo, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {debugging} from '../utils';
import {debugHttpServer} from '../utils/Api';
import {px} from '../utils/ScreenUtils';

/**
 * OpenLayers 地图替换验证页 —— 临时测试用，验证通过后再决定是否替换 index_taskDetail.html
 *
 * 页面全局函数签名与 index_taskDetail.html 完全一致，这里的注入方式也照抄
 * HomeWebView.js 的写法，所以这里跑通 = 现有七个 WebView 宿主可零改动切换。
 */

// 潍坊测试点位，与 index_taskDetail.html 的默认中心一致（GCJ-02）
const CENTER = [119.2751396, 36.6937505];

// 造一条绕中心点的折线，模拟规划路径
const PLAN_PATH = Array.from({length: 20}, (_, i) => [CENTER[0] + i * 0.0006, CENTER[1] + Math.sin(i / 3) * 0.0008]);

// 已行走路径取前 8 个点
const WALKED_PATH = PLAN_PATH.slice(0, 8);

// 以 CENTER 为原点按米偏移造矩形，省得手写一堆经纬度
// 1 度纬度 ≈ 110540m，1 度经度 ≈ 111320m * cos(纬度)
const M_PER_LNG = 111320 * Math.cos((CENTER[1] * Math.PI) / 180);
const M_PER_LAT = 110540;

function rect(offsetEastM, offsetNorthM, widthM, heightM) {
  const lng = CENTER[0] + offsetEastM / M_PER_LNG;
  const lat = CENTER[1] + offsetNorthM / M_PER_LAT;
  const dLng = widthM / 2 / M_PER_LNG;
  const dLat = heightM / 2 / M_PER_LAT;
  return [
    [
      [lng - dLng, lat - dLat],
      [lng + dLng, lat - dLat],
      [lng + dLng, lat + dLat],
      [lng - dLng, lat + dLat],
      [lng - dLng, lat - dLat], // GeoJSON Polygon 外环必须闭合
    ],
  ];
}

// 模拟厂区布局。真实数据应由后端下发或测绘提供，形状同为 GeoJSON Polygon。
const BUILDINGS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {name: '物流中心A'},
      geometry: {type: 'Polygon', coordinates: rect(-60, 90, 160, 70)},
    },
    {
      type: 'Feature',
      properties: {name: '装载区', fillColor: 'rgba(19,206,102,0.12)', strokeColor: '#13CE66'},
      geometry: {type: 'Polygon', coordinates: rect(-180, -40, 90, 60)},
    },
    {
      type: 'Feature',
      properties: {name: '卸载区', fillColor: 'rgba(255,156,64,0.12)', strokeColor: '#FF9C40'},
      geometry: {type: 'Polygon', coordinates: rect(520, -60, 90, 60)},
    },
    {
      type: 'Feature',
      properties: {name: '成品库'},
      geometry: {type: 'Polygon', coordinates: rect(220, 100, 140, 60)},
    },
    {
      type: 'Feature',
      properties: {name: '办公楼'},
      geometry: {type: 'Polygon', coordinates: rect(300, -140, 70, 45)},
    },
  ],
};

const OLMapTestScreen = () => {
  const webviewRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const [carIndex, setCarIndex] = useState(0);

  function log(msg) {
    setLogs(prev => [`${new Date().toLocaleTimeString()} ${msg}`, ...prev].slice(0, 20));
  }

  function inject(js) {
    webviewRef.current && webviewRef.current.injectJavaScript(`${js}; true;`);
  }

  // 厂房。真实数据应由后端下发；若是 WGS84 测绘的，第二个参数传 'wgs84'
  function loadBuildings() {
    inject(`
      setBuildings(${JSON.stringify(BUILDINGS)}, 'gcj02');
      fitBuildings(0.15);
    `);
    log(`注入厂房 ${BUILDINGS.features.length} 个`);
  }

  // 路径 + 起终点，对应 HomeWebView.toInjectedPathJS
  function loadPath() {
    inject(`
      addRoute(${JSON.stringify(PLAN_PATH)}, 'testSource', 'testLayer', '#96A7BC');
      addRoute(${JSON.stringify(WALKED_PATH)}, 'testWalkSource', 'testWalkLayer', '#2D7EF8');
      addStartMarker(${JSON.stringify(PLAN_PATH[0])}, null, '装载站A', 'testStart');
      addEndMarker(${JSON.stringify(PLAN_PATH[PLAN_PATH.length - 1])}, null, '卸载站B', '3.2', '12', 'testEnd');
    `);
    log('注入路径 + 起终点');
  }

  // 车辆，对应 HomeWebView.toInjectedVehJS
  function loadCar() {
    inject(`
      if (findMarker('testCar')) {
        moveMakersAndUpdate('testCar', ${JSON.stringify(PLAN_PATH[0])}, 2, 45);
      } else {
        addCurrentMarker(${JSON.stringify(PLAN_PATH[0])}, 'testCar', 2, 45);
      }
    `);
    setCarIndex(0);
    log('注入车辆 marker');
  }

  // 沿路径走一步，验证 marker 移动 + 朝向 + 弹窗跟随
  function moveCar() {
    const next = (carIndex + 1) % PLAN_PATH.length;
    const from = PLAN_PATH[carIndex];
    const to = PLAN_PATH[next];
    const heading = (Math.atan2(to[0] - from[0], to[1] - from[1]) * 180) / Math.PI;

    inject(`
      moveMakersAndUpdate('testCar', ${JSON.stringify(to)}, 2, ${heading.toFixed(1)});
      if (findPopup('testCar')) {
        movePopupAndUpdate('testCar', ${JSON.stringify(to)}, ${JSON.stringify(popupValue(next))});
      }
    `);
    setCarIndex(next);
    log(`车辆移动到第 ${next} 点, heading ${heading.toFixed(1)}`);
  }

  // data 的字段名必须与 alarm-card.js:361-377 一致，否则卡片里显示 undefined
  function popupValue(index) {
    const remain = (3.2 - index * 0.15).toFixed(1);
    return {
      haveJob: 'true',
      vin: 'TEST0000000000001',
      speed: (20 + index).toString(),
      drivemodetext: '自动驾驶',
      workstatus: '执行中',
      runstatus: '行驶中',
      currentindex: 0,
      fault: '',
      data: [
        {
          status: 1, // 1/2 => 卡片显示“剩余”，其余显示“全程”
          dataEndPoint: '卸载站B',
          dataDistance: `${remain}公里`,
          dataTime: `${Math.max(1, 12 - index)}分钟`,
          dataStatus: '进行中',
        },
        {
          status: 0,
          dataEndPoint: '装载站A',
          dataDistance: '3.2公里',
          dataTime: '12分钟',
          dataStatus: '已完成',
        },
      ],
    };
  }

  function loadPopup() {
    inject(`
      if (!findPopup('testCar')) {
        addCurrentPopup(${JSON.stringify(PLAN_PATH[carIndex])}, 'testCar', ${JSON.stringify(popupValue(carIndex))});
      }
    `);
    log('注入车辆弹窗 alarm-card');
  }

  function loadAlert() {
    inject(`
      if (!findMarker('testAlert')) {
        addAlertMarker(${JSON.stringify(PLAN_PATH[12])}, '前方有障碍物', 1, 'testAlert');
      }
    `);
    log('注入告警 marker');
  }

  function reCenter() {
    inject(`reSetCenter(${JSON.stringify(CENTER)});`);
    log('回到中心点');
  }

  function doFitBounds() {
    inject(`fitBounds(${JSON.stringify(PLAN_PATH)}, 0.2);`);
    log('fitBounds 到整条路径');
  }

  function clearAll() {
    inject('clearAll();');
    setCarIndex(0);
    log('清除全部');
  }

  function loadAll() {
    loadBuildings();
    loadPath();
    loadCar();
    loadPopup();
    loadAlert();
  }

  const handleMessage = event => {
    const message = JSON.parse(event.nativeEvent.data);

    if (message?.messageType === 'mapOnload') {
      log('收到 mapOnload，地图就绪');
      loadAll();
    } else if (message?.messageType === 'Console') {
      log(`webview console: ${JSON.stringify(message?.data?.log)}`);
    } else if (message?.messageType === 'mapClick') {
      log(`点击车辆: ${message.markerKey}`);
    } else if (message?.messageType === 'mapDrag') {
      log('地图拖动');
    } else if (message?.messageType === 'tileError') {
      // 底图瓦片拉不到 ≠ 页面挂了，白屏时用这条区分
      log(`底图[${message.basemap}]瓦片不可达: ${message.url}`);
    }
  };

  const uri = useMemo(() => {
    if (__DEV__) {
      return `${debugHttpServer}/index_ol_test.html?v=2`;
    }
    return 'file:///android_asset/index_ol_test.html';
  }, []);

  const buttons = [
    {label: '全部加载', onPress: loadAll},
    {label: '厂房', onPress: loadBuildings},
    {label: '路径+起终点', onPress: loadPath},
    {label: '车辆', onPress: loadCar},
    {label: '走一步', onPress: moveCar},
    {label: '弹窗', onPress: loadPopup},
    {label: '告警', onPress: loadAlert},
    {label: 'fitBounds', onPress: doFitBounds},
    {label: '回中心', onPress: reCenter},
    {label: '清除', onPress: clearAll},
  ];

  return (
    <View style={styles.root}>
      <View style={styles.mapBox}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{uri: uri, headers: {'Cache-Control': 'no-cache'}}}
          style={styles.webview}
          javaScriptEnabled={true}
          onMessage={handleMessage}
          onError={e => log(`WebView error: ${e.nativeEvent.description}`)}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
          useWebKit={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowingReadAccessToURL="*"
          mixedContentMode="always"
          injectedJavaScript={debugging}
          cacheEnabled={false}
        />
      </View>

      <View style={styles.side}>
        <Text style={styles.title}>OL 地图测试</Text>

        <View style={styles.btnWrap}>
          {buttons.map(b => (
            <TouchableOpacity key={b.label} style={styles.btn} onPress={b.onPress}>
              <Text style={styles.btnText}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>日志</Text>
        <ScrollView style={styles.logBox}>
          {logs.map((l, i) => (
            <Text key={i} style={styles.logText}>
              {l}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default OLMapTestScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F4F7',
  },
  mapBox: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  side: {
    width: px(420),
    padding: px(16),
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: px(24),
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: px(10),
  },
  btnWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: px(16),
  },
  btn: {
    paddingHorizontal: px(16),
    paddingVertical: px(10),
    backgroundColor: '#2D7EF8',
    borderRadius: px(6),
    marginRight: px(8),
    marginBottom: px(8),
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: px(20),
  },
  logBox: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    borderRadius: px(6),
    padding: px(8),
  },
  logText: {
    fontSize: px(16),
    color: '#5B5B5B',
    marginBottom: px(4),
  },
});
