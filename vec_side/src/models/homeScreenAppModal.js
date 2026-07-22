import { fromJS } from "immutable";
import jobS from "../services/jobS";
import vehS from "../services/vehS";
import { action } from "../utils";
import faultS from "../services/faultS";
import { falutGroupByVin } from "./messageModal";


const initState = {
  vehList: [],
  jobPath: {},
  currentVin: null,
  jobBeforeAfterList: {},
  homeRefreshFalg: 0,
};


export default {
  namespace: 'homeScreenAppModal',
  state: initState,
  reducers: {
    save (state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * getVehList ({ payload }, { call, put, select }) {
      try {
        const res = yield call(vehS.getVehList)
        const vehList = res.data;

        yield put(action('save', {
          vehList: vehList.map(item => {
            return { ...item, vehStatus: item.status }
          })
        }))

        const jobPath = {}
        for (let veh of vehList) {
          const workId = veh.workId;
          if (workId) {
            const res = yield call(jobS.getJobDetail, workId)
            jobPath[veh.vin] = res.data
          }

        }

        const jobBeforeAfterList = {}

        Object.values(jobPath).map(item => {

        })

        const array = Object.values(jobPath)
        for (let index = 0; index < array.length; index++) {
          const element = array[index]
          const vin = element.vin;
          if (vin) {
            // if (vin && element.status === 1) {
            const res = yield call(jobS.getJobBeforeAfterList, { vin: vin })
            jobBeforeAfterList[vin] = res.data
          }

        }


        const fomatdata = {}
        vehList.map(item => {
          const key = item.vin;
          const value = {
            ...item,
            vehStatus: item.status,
            "longitude": item.position.lon,
            "latitude": item.position.lat,
          }
          fomatdata[key] = value
        })

        // 初始化 vin 状态
        const postFaultlistRes = yield call(faultS.postFaultlist, { status: 0 })
        const faultObj = falutGroupByVin(postFaultlistRes.data)
        yield put(action('messageModal/save', { vinObj: fromJS(fomatdata), faultObj: faultObj }))

        yield put(action('updateHomeRefreshFalg'))

        yield put(action('save', { jobPath: jobPath, jobBeforeAfterList: jobBeforeAfterList }))

      } catch (e) {
        console.error("getVehList", e);
      }
    },

    * getJobBeforeAfterList ({ payload: { vin, jobId } }, { call, put, select }) {
      try {

        const { jobBeforeAfterList } = yield select(({ homeScreenAppModal }) => homeScreenAppModal);

        const res = yield call(jobS.getJobBeforeAfterList, { vin: vin })

        const newjobBeforeAfterList = { ...jobBeforeAfterList }
        newjobBeforeAfterList[vin] = res.data.map(item => {
          return {
            ...item,
            isCurrentJob: item.id === jobId
          }
        })
        yield put(action('save', { jobBeforeAfterList: newjobBeforeAfterList }))
      } catch (e) {
        console.error("getJobBeforeAfterList", e);
      }
    },

    *updateHomeRefreshFalg ({ payload }, { call, put, select }) {
      try {

        const { homeRefreshFalg } = yield select(({ homeScreenAppModal }) => homeScreenAppModal);
        yield put(action('save', { homeRefreshFalg: homeRefreshFalg + 1 }))
      } catch (e) {
        console.error("updateHomeRefreshFalg", e);
      }
    },
  }
};