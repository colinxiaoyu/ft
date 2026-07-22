import faultS from "../services/faultS";
import { action, isEmptyObject } from "../utils";
import { pubSub } from "../utils/pubsub";






const initState = {
  status: undefined,
  faultCode: undefined,
  faultList: [],
  faultListRecord: [],
  selectFaultCard: {},
  faultListFrist: {},
  loadingFaultList: false,
  page: 1,
  faultDetail: {},
};

const size = 10


export default {
  namespace: 'faultListScreenModal',
  state: initState,
  reducers: {
    save (state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    * postFaultlistFirst ({ payload }, { call, put, select }) {
      try {
        const { currentVin } = yield select(({ configModal }) => configModal);

        const res = yield call(faultS.postFaultlist, { size: 1, status: 0, vin: currentVin })
        yield put(action('save', { faultListFrist: res.data?.[0] || {}, }))
      } catch (e) {
        console.error("postFaultlistFirst", e);
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

    * postFaultlist ({ payload }, { call, put, select }) {
      try {

        const status = payload?.status;
        const faultCode = payload?.faultCode;

        const { currentVin } = yield select(({ configModal }) => configModal);

        const { loadingFaultList, page } = yield select(({ faultListScreenModal }) => faultListScreenModal);
        if (loadingFaultList) {
          return
        }
        yield put(action('save', { loadingFaultList: true, }))


        const res = yield call(faultS.postFaultlist, { status: status, faultCode: faultCode, vin: currentVin, size: size * page })
        yield put(action('save', { faultList: res.data, selectFaultCard: res.data?.[0], loadingFaultList: false, page: page + 1 }))



        if (!status && !faultCode) {
          yield put(action('save', { faultListRecord: res.data }))
        }
      } catch (e) {
        console.error("postFaultlist", e);
      }
    },

    * putFaultId ({ payload }, { call, put, select }) {
      try {

        const { faultData } = payload;

        const res = yield call(faultS.putFaultId, faultData.id)
        if (res.data) {
          if (payload?.id) {
            yield put(action('getFaultDetail', { id: payload?.id }))
          } else {
            yield put(action('postFaultlist'))
          }
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