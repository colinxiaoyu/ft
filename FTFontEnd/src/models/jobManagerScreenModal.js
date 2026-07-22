import commonS from "../services/commonS";
import jobS from "../services/jobS";
import vehS from "../services/vehS";
import { action, isEmptyObject } from "../utils";



const initState = {
  jobList: [],
  jobNo: undefined,
  workNo: undefined,
  goods: undefined,
  startPointId: undefined,
  endPointId: undefined,

  selectedJob: undefined,
  selectedJobDetail: undefined,

  stationList: [],
  recordsList: [],

  // 公用 jobManagerScreenAppModal 中的数据
  // historyList: [],
  // speed: 1,
  // progress: 0,
  // isplay: false,

};




export default {
  namespace: 'jobManagerScreenModal',
  state: initState,
  reducers: {
    save (state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {

    *init ({ payload }, { call, put, select }) {
      try {
        const stationList = yield call(commonS.getCommonStationList)
        yield put(action('save', {
          stationList: stationList.data?.map(item => {
            return {
              ...item,
              id: item.id,
              value: item.name
            }
          })
        }))
      } catch (e) {
        console.error("init", e);
      }
    },

    *clear ({ payload }, { call, put, select }) {
      try {
        yield put(action('save', { ...initState }))
      } catch (e) {
        console.error("clear", e);
      }
    },

    * postJobList ({ payload }, { call, put, select }) {
      try {
        const res = yield call(jobS.postJobList, { condition: { ...payload } })
        yield put(action('save', { jobList: res.data }))

        const { recordsList } = yield select(({ jobManagerScreenModal }) => jobManagerScreenModal);


        if (isEmptyObject(recordsList)) {
          yield put(action('save', { recordsList: res?.data?.records }))
          yield put(action('onSelectJob', { selectedJob: res?.data?.records?.[0] }))

        }

      } catch (e) {
        console.error("postJobList", e);
      }
    },

    * getJobDetail ({ payload }, { call, put, select }) {
      try {
        const { selectedJobDetail } = yield select(({ jobManagerScreenModal }) => jobManagerScreenModal);

        if (selectedJobDetail) {
          const res = yield call(jobS.getJobDetail, selectedJobDetail.id)
          yield put(action('save', { selectedJobDetail: res.data }))

          if (res.data.status === 9) {
            yield put(action('jobManagerScreenAppModal/clearHistoryTrack'))

            const r = yield call(vehS.postJobHistoryTrack, res.data.vin, {
              "startTime": res.data.startTime,
              "endTime": res.data.endTime
            })
            yield put(action('jobManagerScreenAppModal/save', { historyList: r.data?.list, speed: 1, progress: 0, isplay: false, }))
          }
        }
      } catch (e) {
        console.error("getJobDetail", e);
      }
    },


    *onSelectJob ({ payload: { selectedJob } }, { call, put, select }) {
      try {
        const res = yield call(jobS.getJobDetail, selectedJob.id)

        yield put(action('save', { selectedJob: selectedJob, selectedJobDetail: res.data }))

        if (res.data.status === 9) {
          yield put(action('jobManagerScreenAppModal/clearHistoryTrack'))
          const r = yield call(vehS.postJobHistoryTrack, res.data.vin, {
            "startTime": res.data.startTime,
            "endTime": res.data.endTime
          })
          yield put(action('jobManagerScreenAppModal/save', { historyList: r.data?.list, speed: 1, progress: 0, isplay: false, }))

        }

      } catch (e) {
        console.error("onSelectJob", e);
      }
    },

    *reset ({ payload }, { call, put, select }) {
      try {
        yield put(action('save', {
          jobNo: undefined,
          workNo: undefined,
          goods: undefined,
          startPointId: undefined,
          endPointId: undefined,
        }))
        const { currentVin } = yield select(({ configModal }) => configModal);

        yield put(action('postJobList', { condition: { vin: currentVin } }))

      } catch (e) {
        console.error("reset", e);
      }
    },


  }
};