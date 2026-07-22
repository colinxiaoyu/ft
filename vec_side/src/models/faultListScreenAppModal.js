import faultS from "../services/faultS";
import { action } from "../utils";
import { pubSub } from "../utils/pubsub";






const initState = {
  faultList: [],
  faultListFrist: {},
  loadingFaultList: false,
  page: 1,
  faultDetail: {}
};

const size = 10


export default {
  namespace: 'faultListScreenAppModal',
  state: initState,
  reducers: {
    save (state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * postFaultlistFirst ({ payload }, { call, put, select }) {
      try {
        const res = yield call(faultS.postFaultlist, { size: 1, status: 0 })
        yield put(action('save', { faultListFrist: res.data?.[0] || {}, }))
      } catch (e) {
        console.error("postFaultlistFirst", e);
      }
    },
    * postFaultlist ({ payload }, { call, put, select }) {
      try {
        const { loadingFaultList, page } = yield select(({ faultListScreenAppModal }) => faultListScreenAppModal);
        if (loadingFaultList) {
          return
        }
        yield put(action('save', { loadingFaultList: true, }))

        const res = yield call(faultS.postFaultlist, { size: size * page })
        yield put(action('save', { faultList: res.data, loadingFaultList: false, page: page + 1 }))
      } catch (e) {
        console.error("postFaultlist", e);
      }
    },

    * getFaultDetail ({ payload }, { call, put, select }) {
      try {

        const res = yield call(faultS.getFaultId, payload?.id)
        yield put(action('save', { faultDetail: res.data, }))

      } catch (e) {
        console.error("getFaultDetail", e);
      }
    },

    // 忽略故障
    * putFaultId ({ payload }, { call, put, select }) {
      try {
        const { faultData } = payload;
        const res = yield call(faultS.putFaultId, faultData.id)
        if (res.data) {
          yield put(action('postFaultlist'))

        } else {
          pubSub.publish('showAlert', "该故障并未忽略，请检查车辆故障后重试");

        }
      } catch (e) {
        console.error("putFaultId", e);
      }
    },

    *clear ({ payload }, { call, put, select }) {
      try {
        yield put(action('save', { ...initState }))
      } catch (e) {
        console.error("postFaultlist", e);
      }
    },

  }
};