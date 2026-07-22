import vehS from "../services/vehS";
import { action } from "../utils";
import { pubSub } from "../utils/pubsub";

const initState = {
  vehDetail: undefined,
};

export default {
  namespace: 'driveDetailScreenAppModal',
  state: initState,
  reducers: {
    save (state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * getVehDetail ({ payload: { vin } }, { call, put, select }) {
      try {
        const res = yield call(vehS.getVehDetail, vin)
        yield put(action('save', { vehDetail: res.data }))
      } catch (e) {
        console.error("getVehDetail", e);
      }
    },
    * postVehRecycle ({ payload: { vin } }, { call, put, select }) {
      try {
        const res = yield call(vehS.postVehRecycle, vin)
      } catch (e) {
        console.error("postVehRecycle", e);
      }
    },
    * postVehRecharge ({ payload: { vin } }, { call, put, select }) {
      try {
        const res = yield call(vehS.postVehRecharge, vin)
      } catch (e) {
        console.error("postVehRecharge", e);
      }
    },

    //  to do 根据站点查询路径规划路线
    * postVehPathPlan ({ payload: { vin, stationIdList } }, { call, put, select }) {
      try {
        const res = yield call(vehS.postVehPathPlan, vin, { stationIdList: stationIdList })
      } catch (e) {
        console.error("postVehPathPlan", e);
      }
    },
  }
};