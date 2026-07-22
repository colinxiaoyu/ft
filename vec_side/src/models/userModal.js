import commonS from "../services/commonS";
import { action } from "../utils";






const initState = {
  user: null,
  goodsLists: [],
  timestamp: '11',
};




export default {
  namespace: 'userModal',
  state: initState,
  reducers: {
    save (state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {

    *toLogin ({ payload: { user, callBack } }, { call, put, select }) {
      try {



        yield put(action('save', { user: user }))
        callBack && callBack()

      } catch (e) {
        console.error("toLogin", e);
      }
    },

    *getCommonGoodList ({ payload }, { call, put, select }) {
      try {
        const { timestamp } = yield select(({ userModal }) => userModal);

        const goods = yield call(commonS.getCommonGoodList, { timestamp: timestamp })
        if (goods.data?.list?.length >= 1) {
          yield put(action('save', {
            goodsLists: goods.data?.list?.map(item => {
              return {
                id: item.goodsCode,
                value: item.goodsName,
                goodsNamePy: item.goodsNamePy
              }
            }),
            timestamp: goods.data?.timestamp
          }))
        }

      } catch (e) {
        console.error("getCommonConfigInfo", e);
      }

    },

  }
};