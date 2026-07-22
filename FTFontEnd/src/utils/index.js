export const action = (type, payload) => ({ type, payload });
export function delay (timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function makeid (length = 10) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=[]{}|;:\'",.<>?/';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


export function makeuuid (length = 13) {
  let result = '';
  const characters = '1234567890';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


export function filterDataBybId (data, id) {
  const result = {};
  Object.keys(data).forEach(key => {
    if (key === id) {
      result[key] = data[key];
    }
  });

  return result;
}


export const isEmptyObject = (obj) => {
  return (
    !obj || // 如果 obj 是 null、undefined、false 等假值，直接返回 true
    (typeof obj === 'object' &&
      (Array.isArray(obj) ? obj.length === 0 : Object.keys(obj).length === 0))
  );
};




export const debugging = `
  const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'messageType': 'Console', 'data': {'type': type, 'log': log}}));
  console = {
      log: (log) => consoleLog('log', log),
      debug: (log) => consoleLog('debug', log),
      info: (log) => consoleLog('info', log),
      warn: (log) => consoleLog('warn', log),
      error: (log) => consoleLog('error', log),
    };
`;

export const getVehStatus = (status) => {
  switch (status) {
    case 1:
      return '空闲'
    case 2:
      return '执行中'
    case 0:
      return '离线'
    default:
      return null
  }
}


export function getWalkedPath (path, currentLocation) {
  if (!path.length) return [];

  const [currentLng, currentLat] = currentLocation.map(parseFloat);

  let closestPointIndex = -1;
  let minDistance = Infinity;

  // 算出来的最后一个点
  let lastPoint = [0,0]
  // 算出来的倒数第二个点
  let secondLastPoint = [0,0]

  for (let i = 0; i < path.length; i++) {
    const [lng, lat] = path[i].map(parseFloat);
    const distance = calculateDistance([currentLng, currentLat], [lng, lat]);

    if (distance < minDistance) {
      minDistance = distance;
      closestPointIndex = i;
      secondLastPoint = lastPoint
      lastPoint = [lng, lat]
    }
  }

  // 最后两个点和当前点做对比，如果能当前点的经度在最后两个点的经度中间，且纬度也在最后两个点的纬度中间，说明轨迹跑前面去了，可以去掉最后一个点
  if (( currentLng > secondLastPoint[0] && currentLng < lastPoint[0]) 
    || ( currentLat > secondLastPoint[1] && currentLng < lastPoint[1])){
    closestPointIndex = closestPointIndex - 1
  }

  let walkedPath = [];
  for (let i = 0; i <= closestPointIndex; i++) {
    walkedPath.push(path[i]);
  }

  walkedPath.push([currentLng, currentLat]);

  return walkedPath;
}

function calculateDistance ([lng1, lat1], [lng2, lat2]) {
  const R = 6371e3;
  const rad = Math.PI / 180;
  const φ1 = lat1 * rad, φ2 = lat2 * rad;
  const Δφ = (lat2 - lat1) * rad;
  const Δλ = (lng2 - lng1) * rad;

  const a = Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

