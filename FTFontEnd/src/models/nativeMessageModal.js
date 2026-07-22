import { sendCommand } from "../services/V2CMessageS";
import { action } from "../utils";
import isEqual from 'lodash/isEqual';
import { pubSub } from "../utils/pubsub";

const initState = {
  VinMessage: __DEV__ ? testVinMessage : null

};

export default {
  namespace: 'nativeMessageModal',
  state: initState,
  reducers: {
    updateVinMessage (state, { payload }) {
      return { VinMessage: payload };
    },
    save (state, { payload }) {
      return { ...state, ...payload };
    },

  },

  effects: {


    *vehNativeMessage ({ payload }, { call, put, select }) {
      try {


        const { VinMessage } = yield select(({ nativeMessageModal }) => nativeMessageModal);
        if (compareObjects(VinMessage, payload, ['tapPos', 'scramFlag', 'remoteScramFlag', 'driveMode', 'soc', 'velocity', 'position', 'vehicleId'])) {
          yield put(action('save', { VinMessage: payload }));
        }


        if (compareObjects(VinMessage, payload, ['vehicleId'])) {
          yield put(action('configModal/save', { currentVin: payload.vehicleId }));
          pubSub.publish('showAlert', "变更当前 vin 为 " + payload.vehicleId);

        }

      } catch (e) {
        console.error("vehNativeMessage", e);
      }
    },

    // props.dispatch(action('nativeMessageModal/sendComandToNative',{command:"sendScramCommand"}));
    *sendComandToNative ({ payload: { command } }, { call, put, select }) {
      const { currentVin } = yield select(({ configModal }) => configModal);
      try {

        sendCommand(currentVin, command)
      } catch (e) {
        console.error("sendEmergencyComand", e);
      }
    },
  }
};


function compareObjects (obj1, obj2, keys) {
  if (obj1) {
    for (let field of keys) {
      if (!isEqual(obj1[field], obj2[field])) {
        // console.log(field, obj1[field])
        return true;
      }
    }
  } else {
    return true
  }



  return false;  // 如果所有字段都没有变化，返回 false
}


export const testVinMessage = {
  "absFlag": 255,
  "accMode": 255,
  "accelCmd": 65535,
  "accelPos": 65535,
  "accelerationLat": 65535,
  "accelerationLon": 65535,
  "accelerationVer": 65535,
  "actionCode": "",
  "actionLen": 0,
  "actionValue": 0,
  "aebFlag": 255,
  "autoDrivingSysFault": 65535,
  "battCur": 65535,
  "battVol": 65535,
  "brakeFlag": 255,
  "brakePos": 65535,
  "brakePressure": 65535,
  "chargeState": 255,
  "cloudMessageId": 4294967295,
  "decisionAccel": 255,
  "decisionLaneChange": 255,
  "decisionTurnSignal": 255,
  "decisionVehicleStatus": 255,
  "destLocation": {
    "latitude": 900000000,
    "longitude": 1800000000
  },
  "detectionData": [],
  "detectionLen": 0,
  "dmsFlag": 255,
  "doors": 65535,
  "driveMode": 1,
  "endurance": 4294967295,
  "engineSpeed": 65535,
  "engineTorque": 4294967295,
  "epbFlag": 255,
  "espFlag": 255,
  "fcwFlag": 255,
  "fuelConsumption": 65535,
  "fuelGauge": 65535,
  "heading": 2728373,
  "hornState": 255,
  "jobId": 1,
  "lcaFlag": 255,
  "ldwFlag": 255,
  "lights": 65535,
  "lkaFlag": 255,
  "messageId": 849,
  "mileage": 4294967295,
  "motorspeed": 65535,
  "motortorque": 4294967295,
  "networkState": 0,
  "passPoints": [],
  "passPointsNum": 0,
  "pathId": 65535,
  "pathPogress": 255,
  "planningLocNum": 0,
  "planningLocs": [],
  "position": {
    "elevation": 2,
    "latitude": 36.69415624331618,
    "longitude": 119.28086753886151
  },
  "signalStrength": 0,
  "soc": 1800,
  "steeringAngle": 10000000,
  "tapPos": 33,
  "tcsFlag": 255,
  "temperature": 255,
  "timestampGNSS": 1735270270958,
  "tirePressure": [],
  "torqueCmd": 4294967295,
  "userdefinedData": "",
  "userdefinedData1": "",
  "userdefinedData2": "\u0000",
  "userdefinedDataLength": 0,
  "userdefinedDataLength1": 0,
  "userdefinedDataLength2": 1,
  "vehFault": 5234815,
  "vehMode": 255,
  "velocity": 0,
  "velocityCmd": 65535,
  "velocityGNSS": 37,
  "wheelNum": 0,
  "wheelVelocity": [],
  "yawRate": 65535,
  "bodyLen": 180,
  "controlContent": 0,
  "identifier": 242,
  "timestamp": 1735270270975,
  "type": 21,
  "vehicleId": "XXHPT1D2022101801",
  "version": 3
}