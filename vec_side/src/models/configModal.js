import commonS from '../services/commonS';
import {action, delay} from '../utils';

export const CURRENT = {
  APP: 'app',
  VEH: 'veh',
};

const initState = {
  currentApp: CURRENT.APP,
  currentVin: __DEV__ ? 'XXHPT1D2022101801' : 'XXHPT1D2022101869', // LTFKEVS7XX08261   XXHPT1D2022101801  XXHPT1D2022101869
  projectId: undefined,
  refreshCount: 0,
  devMode: false,
};

export default {
  namespace: 'configModal',
  state: initState,
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    },
  },
  // subscriptions: {
  //   setup ({ dispatch }) {
  //     dispatch(action('getCommonConfigInfo'));
  //   },
  // },

  effects: {
    *switchApp({payload}, {call, put, select}) {
      try {
        const {currentApp} = yield select(({configModal}) => configModal);
        if (currentApp === CURRENT.APP) {
          yield put(
            action('save', {
              currentApp: CURRENT.VEH,
            }),
          );
        } else {
          yield put(
            action('save', {
              currentApp: CURRENT.APP,
            }),
          );
        }
      } catch (e) {
        console.error('switchApp', e);
      }
    },

    *getCommonConfigInfo({payload}, {call, put, select}) {
      try {
        const res = yield call(commonS.getCommonConfigInfo);
        if (res.success) {
          yield put(action('save', {projectId: res.data.projectId}));
        }
      } catch (e) {
        console.error('getCommonConfigInfo', e);
      }
    },

    // 用于刷新页面 ，主要刷新 webview home homeapp  driveDetail
    refesh: [
      function* ({payload}, {call, put, select}) {
        try {
          yield call(delay, 500);

          const {refreshCount} = yield select(({configModal}) => configModal);
          console.log('refreshCount', refreshCount);
          yield put(action('save', {refreshCount: refreshCount + 1}));
        } catch (e) {
          console.error('refesh', e);
        }
      },
      {type: 'takeLatest'},
    ],
  },
};
