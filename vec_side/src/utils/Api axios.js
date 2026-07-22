import axios from 'axios';
import { action, makeuuid } from '.';
import { pubSub } from './pubsub';  // 导入 pubSub 实例

const devConfig = {
  web3DUrl: 'https://icv.foton.com.cn/cross/app/3dmap/',
  BASE_URL: 'http://36.110.35.26:18080/foton/job/les',
  BASE_URL1: 'http://36.110.35.26:18080/foton', // 登录相关使用 
  socketUrl: `ws://36.110.35.26:18080/foton/job/jobScheduling/realtime/`, // socket 使用
  vcTcp: '192.168.2.101',
  vcTcpPort: 5000,
};

const proConfig = {
  web3DUrl: 'https://icv.foton.com.cn/cross/app/3dmap/',
  BASE_URL: 'https://icv.foton.com.cn/foton/job/les',
  BASE_URL1: 'https://icv.foton.com.cn/foton',
  socketUrl: `wss://icv.foton.com.cn/foton/job/jobScheduling/realtime/`,
  vcTcp: '192.168.2.101',
  vcTcpPort: 5000,
};

if (!__DEV__) {
  console.log = () => { }
}

const TIMEOUT = 300000; // 请求超时限制

let env = 'pro'; // pro  dev
let vcTcp = '192.168.2.101';
let vcTcpPort = 5000;

export function setCurrentEnv (e, vcTcpData, vcTcpPortData) {
  env = e;
  vcTcp = vcTcpData;
  vcTcpPort = vcTcpPortData;
}

export function getConfig () {
  if (env === 'dev') {
    devConfig.vcTcp = vcTcp;
    devConfig.vcTcpPort = vcTcpPort;
    return devConfig;
  } else if (env === 'pro') {
    proConfig.vcTcp = vcTcp;
    proConfig.vcTcpPort = vcTcpPort;
    return proConfig;
  }
}

const whiteUrl = ['/admin/sso/getGraphic', '/admin/sso/login', '/admin/sso/sendSmsCode'];

// 默认的请求头
const defaultHeaders = (url) => {
  const header = {
    'Content-Type': 'application/json',
  };

  if (!whiteUrl.includes(url)) {
    header['X-Token'] = window.token;
  }

  return header;
};

// 设置默认响应拦截器
const defaultResponseInterceptor = async (response) => {
  // 统一处理 401 错误
  if (response.status === 401) {
    console.log('Unauthorized - redirecting to login');

    // 在这里直接跳转到登录页面
    try {
      const navigation = await getNavigation(); // 获取 navigation 对象
      navigation.navigate('Login'); // 执行跳转
    } catch (error) {
      console.error('Error getting navigation:', error);
    }
  }

  return response; // 返回修改后的响应
};

// 获取 navigation 对象 (只能在组件生命周期内调用)
let navigation = null;
const setNavigation = (nav) => {
  navigation = nav;
};
const getNavigation = () => {
  if (!navigation) {
    throw new Error('Navigation is not set');
  }
  return navigation;
};

// 执行默认响应拦截器
const executeDefaultResponseInterceptor = async (response) => {
  return await defaultResponseInterceptor(response);
};

function getQueryParamsWithDefault (params = {}) {
  const result = {};

  // Overwrite with params if available
  for (let key in params) {
    if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
      result[key] = params[key];
    }
  }

  return result;
}

// 封装 GET 请求
const get = async (url, params = {}, headers = {}, baseUrl = getConfig().BASE_URL) => {
  pubSub.publish('SHOW_LOADING');

  const fullUrl = `${baseUrl}${url}`;

  console.log('window.token', window.token);
  const header = { ...defaultHeaders(url), ...headers };

  // 如果有 query 参数，附加到 URL
  const queryParams = new URLSearchParams(getQueryParamsWithDefault(params)).toString();
  const requestUrl = queryParams ? `${fullUrl}?${queryParams}` : fullUrl;

  try {
    const response = await axios.get(requestUrl, { headers: header, timeout: TIMEOUT });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Network error: ' + error.message);
  }
};

// 封装 POST 请求
const post = async (url, body = {}, headers = {}, baseUrl = getConfig().BASE_URL) => {
  pubSub.publish('SHOW_LOADING');

  const fullUrl = `${baseUrl}${url}`;

  const header = { ...defaultHeaders(url), ...headers };

  try {
    const response = await axios.post(fullUrl, body, { headers: header, timeout: TIMEOUT });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Network error: ' + error.message);
  }
};

// 封装 PUT 请求
const put = async (url, body = {}, headers = {}, baseUrl = getConfig().BASE_URL) => {
  pubSub.publish('SHOW_LOADING');

  const fullUrl = `${baseUrl}${url}`;

  const header = { ...defaultHeaders(url), ...headers };

  try {
    const response = await axios.put(fullUrl, body, { headers: header, timeout: TIMEOUT });

    return handleResponse(response);
  } catch (error) {
    throw new Error('Network error: ' + error.message);
  }
};

// 处理响应
const handleResponse = async (response) => {
  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // 执行默认的响应拦截器
  const modifiedResponse = await executeDefaultResponseInterceptor(response);

  const data = modifiedResponse.data;

  if (data.error) {
    throw new Error(`API error: ${data.error}`);
  }

  console.log('response url:', response.config.url, data);

  if (data.code === '200' || data.code === 0) {
    return data;
  } else {
    if (data.code.indexOf('401') > -1) {
      window.token = null;
      window.dvaStore.dispatch(action('userModal/save', { user: null }));

      const navigation = getNavigation();
      navigation.popToTop();
      navigation.replace('LoginScreen');
    }
    pubSub.publish('showAlert', data.msg);
    throw new Error(`HTTP error! status: ${data.msg}`);
  }
};

// 导出库中的方法
export default {
  get,
  post,
  put,
  setNavigation,
};
