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

  historyList: [],
  speed: 1,
  progress: 0,
  isplay: false,
};




export default {
  namespace: 'jobManagerScreenAppModal',
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

        const { recordsList } = yield select(({ jobManagerScreenAppModal }) => jobManagerScreenAppModal);

        if (isEmptyObject(recordsList)) {
          yield put(action('save', { recordsList: res?.data?.records }))

          yield put(action('onSelectJob', { selectedJob: res?.data?.records?.[0] }))

        }

      } catch (e) {
        console.error("postJobList", e);
      }
    },

    * postJobPause ({ payload: { id } }, { call, put, select }) {
      try {
        const res = yield call(jobS.postJobPause, id)

      } catch (e) {
        console.error("postJobPause", e);
      }
    },

    * postJobCancel ({ payload: { id } }, { call, put, select }) {
      try {
        const res = yield call(jobS.postJobCancel, id)

      } catch (e) {
        console.error("postJobCancel", e);
      }
    },

    * postJobContinue ({ payload: { id } }, { call, put, select }) {
      try {
        const res = yield call(jobS.postJobContinue, id)

      } catch (e) {
        console.error("postJobContinue", e);
      }
    },

    * getJobDetail ({ payload }, { call, put, select }) {
      try {
        const { selectedJobDetail } = yield select(({ jobManagerScreenAppModal }) => jobManagerScreenAppModal);

        if (selectedJobDetail) {
          const res = yield call(jobS.getJobDetail, selectedJobDetail.id)
          yield put(action('save', { selectedJobDetail: res.data }))

          if (res.data.status === 9) {
            yield put(action('clearHistoryTrack'))
            const r = yield call(vehS.postJobHistoryTrack, res.data.vin, {
              "startTime": res.data.startTime,
              "endTime": res.data.endTime
            })
            yield put(action('save', { historyList: r.data?.list, speed: 1, progress: 0, isplay: false, }))
          }

        }

      } catch (e) {
        console.error("getJobDetail", e);
      }
    },


    * postJobStartDelivery ({ payload: { id } }, { call, put, select }) {
      try {
        const res = yield call(jobS.postJobStartDelivery, id)

        const res1 = yield call(jobS.getJobDetail, id)

        yield put(action('save', { selectedJobDetail: res1.data }))

      } catch (e) {
        console.error("postJobStartDelivery", e);
      }
    },
    * postJobUnload ({ payload: { id } }, { call, put, select }) {
      try {
        const res = yield call(jobS.postJobUnload, id)
        const res1 = yield call(jobS.getJobDetail, id)

        yield put(action('save', { selectedJobDetail: res1.data }))
      } catch (e) {
        console.error("postJobUnload", e);
      }
    },

    *onSelectJob ({ payload: { selectedJob } }, { call, put, select }) {
      try {
        const res = yield call(jobS.getJobDetail, selectedJob.id)

        yield put(action('save', { selectedJob: selectedJob, selectedJobDetail: res.data }))


        if (selectedJob.status === 9) {
          yield put(action('clearHistoryTrack'))

          const r = yield call(vehS.postJobHistoryTrack, selectedJob.vin, {
            "startTime": selectedJob.startTime,
            "endTime": selectedJob.endTime
          })


          yield put(action('save', { historyList: r.data?.list, speed: 1, progress: 0, isplay: false, }))
        }


      } catch (e) {
        console.error("onSelectJob", e);
      }
    },

    *switchPlay ({ payload }, { call, put, select }) {
      try {
        const { isplay } = yield select(({ jobManagerScreenAppModal }) => jobManagerScreenAppModal);
        yield put(action('save', { isplay: !isplay }))
      } catch (e) {
        console.error("switchPlay", e);
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

        yield put(action('postJobList', { condition: {} }))

      } catch (e) {
        console.error("reset", e);
      }
    },

    *clearHistoryTrack ({ payload }, { call, put, select }) {
      try {
        yield put(action('save', {
          historyList: [],
          speed: 1,
          progress: 0,
          isplay: false,
        }))
      } catch (e) {
        console.error("switchPlay", e);
      }
    },

  }
};