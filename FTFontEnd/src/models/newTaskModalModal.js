import commonS from "../services/commonS";
import jobS from "../services/jobS";
import vehS from "../services/vehS";
import { action, makeid } from "../utils";
import { pubSub } from "../utils/pubsub";
import { CURRENT } from "./configModal";






const initState = {
  stationList: [],
  vehList: [],
  vin: undefined,

  deviveryList: [],

  vehPath: undefined,

  vehPathData: undefined, // 车载端返回的路径
};




export default {
  namespace: 'newTaskModalModal',
  state: initState,
  reducers: {
    save (state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *init ({ payload }, { call, put, select }) {
      try {

        const { currentApp } = yield select(({ configModal }) => configModal);
        if (currentApp === CURRENT.APP) { // 手持 App

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

          const veh = yield call(vehS.getVehList)

          yield put(action('save', {
            vehList: veh?.data?.map(item => {
              return {
                ...item,
                id: item.vin,
                value: item.vin
              }
            })
          }))

        } else if (currentApp === CURRENT.VEH) {  // 车载 App

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
        }


      } catch (e) {
        console.error("init", e);
      }
    },


    *clear ({ payload }, { call, put, select }) {
      try {
        yield put(action('save', { deviveryList: [], vin: null, vehPath: undefined, vehPathData: null }))

      } catch (e) {
        console.error("clear", e);
      }
    },



    *onAdd ({ payload }, { call, put, select }) {
      try {
        const { deviveryList } = yield select(({ newTaskModalModal }) => newTaskModalModal);

        const emptyObj = {
          id: makeid(10),
          goodsCode: undefined,
          goodsMame: undefined,
          startPointId: undefined,
          startPointName: undefined,
          endPointId: undefined,
          endPointName: undefined,
        }

        const newdeviveryList = deviveryList.concat([emptyObj])

        yield put(action('save', { deviveryList: newdeviveryList }))

      } catch (e) {
        console.error("onAdd", e);
      }
    },




    *onSelect ({ payload: { obj, i } }, { call, put, select }) {
      try {
        const { deviveryList } = yield select(({ newTaskModalModal }) => newTaskModalModal);

        const newdeviveryList = deviveryList.map((a, index) => {
          if (i === index) {
            return { ...a, ...obj }
          }
          return a
        })

        yield put(action('save', { deviveryList: newdeviveryList }))

      } catch (e) {
        console.error("onSelect", e);
      }
    },

    // 需求变更 onSelect onAdd  onDelete  弃用
    *onSelectVin ({ payload }, { call, put, select }) {
      try {

        console.log('onSelectVin')
        const emptyObj = {
          id: makeid(10),
          goodsCode: undefined,
          goodsMame: undefined,
          startPointId: undefined,
          startPointName: undefined,
          endPointId: undefined,
          endPointName: undefined,
        }

        yield put(action('save', { deviveryList: [emptyObj] }))

      } catch (e) {
        console.error("onSelect", e);
      }
    },


    *onGoddsdDesChange ({ payload: { i, value } }, { call, put, select }) {
      try {
        const { deviveryList } = yield select(({ newTaskModalModal }) => newTaskModalModal)

        const newdeviveryList = deviveryList.map((a, index) => {
          if (i === index) {
            return { ...a, goodsDes: value }
          }
          return a
        })

        yield put(action('save', { deviveryList: newdeviveryList }))

      } catch (e) {
        console.error("onGoddsdDesChange", e);
      }
    },

    *pathPlan ({ payload }, { call, put, select }) {
      try {
        const { vin } = yield select(({ newTaskModalModal }) => newTaskModalModal);
        const { stationIdList } = payload

        const res = yield call(vehS.postVehPathPlan, vin, { stationIdList: stationIdList })
        yield put(action('save', { vehPath: res.data }))

      } catch (e) {
        console.error("pathPlan", e);
      }
    },

    // 车载端 计算 路径 
    *pathPlanPoint ({ payload }, { call, put, select }) {
      try {
        const { currentVin } = yield select(({ configModal }) => configModal);
        const { stationIdList } = payload

        const res = yield call(vehS.postPathPlanPoint, currentVin, { stationIdList: stationIdList })
        yield put(action('save', { vehPathData: res.data }))

      } catch (e) {
        console.error("pathPlan", e);
      }
    },

    *onDelete ({ payload: { i } }, { call, put, select }) {
      try {
        const { deviveryList } = yield select(({ newTaskModalModal }) => newTaskModalModal);

        const newdeviveryList = deviveryList.filter((item, index) => index !== i)


        yield put(action('save', { deviveryList: newdeviveryList }))

      } catch (e) {
        console.error("onDelete", e);
      }
    },


    *postJobCreate ({ payload }, { call, put, select }) {
      try {

        const { currentApp } = yield select(({ configModal }) => configModal);

        if (currentApp === CURRENT.VEH) {

          const { vehPathData } = yield select(({ newTaskModalModal }) => newTaskModalModal);

          const params = {
            vin: vehPathData.vin,
            goodsList: [
              {

                "startPointId": vehPathData?.startPoint?.id,
                "startPointName": vehPathData?.startPoint?.name,
                "endPointId": vehPathData?.endPoint?.id,
                "endPointName": vehPathData?.endPoint?.name,
              }
            ]
          }

          const res = yield call(jobS.postJobCreate, params)

          if (res.success) {
            yield put(action('save', { ...initState }))
            yield put(action('configModal/refesh'))
          } else {
            pubSub.publish('showAlert', '创建任务失败');

          }


        } else {
          const { deviveryList, vin } = yield select(({ newTaskModalModal }) => newTaskModalModal);

          if (!vin) {
            pubSub.publish('showAlert', '请选择执行车辆VIN码');
            return
          }
          const params = {
            vin: vin,
            goodsList: deviveryList.map(item => {
              console.log('item', item)
              return {
                ...item,
                goodsMame: `${item.goodsMame}${item.goodsDes ? `(${item.goodsDes})` : ''}`
              }
            })
          }
          const res = yield call(jobS.postJobCreate, params)

          if (res.success) {
            yield put(action('save', { ...initState }))
            yield put(action('configModal/refesh'))

          } else {
            pubSub.publish('showAlert', '创建任务失败');

          }
        }
      } catch (e) {
        console.error("postJobCreate", e);
      }
    },





  }
};