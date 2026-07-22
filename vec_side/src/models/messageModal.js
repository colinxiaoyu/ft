import commonS from "../services/commonS";
import { action } from "../utils";



import { fromJS, List } from 'immutable';
import { CURRENT } from "./configModal";
import isEqual from 'lodash/isEqual';

const initState = {

  vinObj: fromJS({
    // "LTFKEVS7XX08261": {
    // "timestamp": null,
    // "projectId": "1865994966275584002",
    // "jobId": "1875452899104456705",
    // "taskId": "1875452899146399746",
    // "actionStatus": "GO_WORKING",
    // "taskStatus": 1,
    // "vehStatus": 2,
    // "actionCode": "loadCargo",
    // "vehInstanceId": "vehicle1869635328737357824",
    // "deviceId": "XXHPT1D2022101801",
    // "vin": "XXHPT1D2022101801",
    // "license": "XX101801",
    // "longitude": "119.27624325147629",
    // "latitude": "36.692823846227924",
    // "elevation": "null",
    // "velocity": 1,
    // "speed": 3,
    // "heading": 90.0359,
    // "soc": 6400,
    // "pathPogress": 6,
    // "tapPos": 31,
    // "remMileage": 861,
    // "remGoTime": 0,
    // "driveMode": 4,
    // "endurance": 4294967295,
    // "scramFlag": 0
    // },
  }), // 车载APP 使用 只获取当前车的数据
  faultObj: {}
};

export default {
  namespace: 'messageModal',
  state: initState,
  reducers: {
    updateVinObj (state, { payload }) {
      return {
        vinObj: state.vinObj.set(payload.key, payload.value),
        faultObj: state.faultObj
      };
    },

    updatefaultObj (state, { payload }) {
      return {
        vinObj: state.vinObj,
        faultObj: payload.faultObj,
      };
    },

    // 初始化的时候会调用
    save (state, { payload }) {
      return { ...state, ...payload };
    },

  },

  effects: {


    *vehMessage ({ payload }, { call, put, select }) {
      try {
        const key = payload.vin;
        const value = fromJS(payload);
        const { vinObj } = yield select(({ messageModal }) => messageModal);

        if (vinObj?.get(key)?.equals(value)) {
          return
        }
        yield put(action('updateVinObj', { key: key, value: value }));

        // 当 jobId 由 null 变更为有数据时，获取当前车的窗体信息
        const { currentApp } = yield select(({ configModal }) => configModal);

        if (currentApp === CURRENT.APP) {
          // console.log('payload.vehStatus', payload?.vehStatus)

          // console.log('payload', payload)

          // console.log('payload', payload?.jobId)
          // console.log(`vinObj?.getIn([key, 'jobId'])`, vinObj?.getIn([key, 'jobId']))
          // console.log(`!vinObj?.getIn([key, 'jobId'])`, !vinObj?.getIn([key, 'jobId']))

          if (!vinObj?.getIn([key, 'jobId']) && payload?.jobId) {
            yield put(action('homeScreenAppModal/getJobBeforeAfterList', { vin: key, jobId: payload?.jobId }));
          }
        }

      } catch (e) {
        console.error("vehMessage", e);
      }
    },

    *faultMessage ({ payload }, { call, put, select }) {
      try {
        const fault = falutGroupByVin(payload)
        const { faultObj } = yield select(({ messageModal }) => messageModal);

        if (isEqual(faultObj, fault)) {
          return
        }

        yield put(action('updatefaultObj', { faultObj: fault }));

      } catch (e) {
        console.error("vehMessage", e);
      }
    },
  }
};



export function falutGroupByVin (data) {
  return data.reduce((result, item) => {
    item.ext = null // 不需要 ext 数据
    const vin = item.vin;
    if (!result[vin]) {
      result[vin] = [];
    }
    result[vin].push(item);
    return result;
  }, {});
}
