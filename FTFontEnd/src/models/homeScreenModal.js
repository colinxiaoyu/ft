import { fromJS } from "immutable";
import commonS from "../services/commonS";
import faultS from "../services/faultS";
import jobS from "../services/jobS";
import vehS from "../services/vehS";
import { action, makeid } from "../utils";
import { falutGroupByVin } from "./messageModal";
import { testVinMessage } from "./nativeMessageModal";






const initState = {
  vehDetail: {},
  jobDetail: {},
  homeRefreshFalg: 0,

};




export default {
  namespace: 'homeScreenModal',
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
        const result = res.data
        yield put(action('save', { vehDetail: { ...result, vehStatus: result.status } }))

        const workId = res?.data?.workId
        if (__DEV__) {
          yield put(action('nativeMessageModal/save', { VinMessage: testVinMessage }))
        }

        if (workId) {
          yield put(action('getJobDetail', { id: workId }))


        } else {
          yield put(action('updateHomeRefreshFalg'))

        }


        const postFaultlistRes = yield call(faultS.postFaultlist, { status: 0, vin: vin })

        const faultObj = falutGroupByVin(postFaultlistRes.data)
        yield put(action('messageModal/save', { faultObj: faultObj }))

      } catch (e) {
        console.error("getVehDetail", e);
      }
    },

    * getJobDetail ({ payload: { id } }, { call, put, select }) {
      try {
        const res = yield call(jobS.getJobDetail, id)
        yield put(action('updateHomeRefreshFalg'))
        yield put(action('save', { jobDetail: res.data }))
      } catch (e) {
        console.error("getJobDetail", e);
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

    // driveMode	驾驶模式 1：手动驾驶 2：人工驾驶   无用
    * postVehDriveMode ({ payload: { vin, value } }, { call, put, select }) {
      try {
        let driveMode = 0
        if (value) {
          driveMode = value
        } else {
          const { vehDetail } = yield select(({ homeScreenModal }) => homeScreenModal);

          driveMode = vehDetail?.driveMode === 1 ? 2 : 1
        }

        const res = yield call(vehS.postVehDriveMode, vin, { driveMode: driveMode })
        if (res.success) {
          yield call(vehS.getVehDetail, vin)

        }
      } catch (e) {
        console.error("postVehDriveMode", e);
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

    *updateHomeRefreshFalg ({ payload }, { call, put, select }) {
      try {

        const { homeRefreshFalg } = yield select(({ homeScreenModal }) => homeScreenModal);
        yield put(action('save', { homeRefreshFalg: homeRefreshFalg + 1 }))
      } catch (e) {
        console.error("updateHomeRefreshFalg", e);
      }
    },
  }
};