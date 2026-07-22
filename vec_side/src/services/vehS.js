import Api from "../utils/Api";

// 车辆信息

// 回库
const postVehRecycle = (vin) => {
  return Api.post(`/veh/${vin}/recycle`)
};

// 充电
const postVehRecharge = (vin) => {
  return Api.post(`/veh/${vin}/recharge`)
};


// 根据站点查询路径规划路线
const postVehPathPlan = (vin, query) => {
  return Api.post(`/veh/${vin}/path-plan`, query)
};

// driveMode	驾驶模式 1：手动驾驶 2：人工驾驶
const postVehDriveMode = (vin, query) => {
  return Api.post(`/veh/${vin}/drive-mode`, query)
};

// 车辆列表
const getVehList = (query) => {
  return Api.get(`/veh/list`, query)
};

// 车辆详情
const getVehDetail = (vin) => {
  return Api.get(`/veh/${vin}/detail`.replace(/"/g, ''))
};


// 历史轨迹
/**
{
  "startTime": "",
  "endTime": ""
}
 */
const postJobHistoryTrack = (id, query) => {
  return Api.post(`/veh/${id}/history-track`, query)
}

const postPathPlanPoint = (vin, query) => {
  return Api.post(`/veh/${vin}/path-plan-point`, query)
}

export default {
  postVehRecycle, postVehRecharge, postVehPathPlan, postVehDriveMode,
  getVehList, getVehDetail,
  postJobHistoryTrack, postPathPlanPoint,
}
