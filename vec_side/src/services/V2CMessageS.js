import { DeviceEventEmitter, NativeModules } from 'react-native';
import { useEffect } from 'react';
import { getConfig } from '../utils/Api';


export const useNativeMessageListener = (callBack) => {
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'V2CMessage',
      (message) => {

        callBack(JSON.parse(message));

        // console.log('JSON.parse(message)', JSON.parse(message))
      }
    );
    return () => {
      subscription && subscription.remove();
    };
  }, []);
};


const { TcpNativeModule } = NativeModules;





/**

 */
export const connectToServer = () => {
  if (__DEV__) {
    //TcpNativeModule.connectToServer('3.tcp.cpolar.top', 12391);
    TcpNativeModule.connectToServer(getConfig().vcTcp, getConfig().vcTcpPort);
  } else {
    // TcpNativeModule.connectToServer('61721pi2ip51.vicp.fun', 45046);
    TcpNativeModule.connectToServer(getConfig().vcTcp, getConfig().vcTcpPort);
  }
}


export const sendCommand = (vehicleId, command) => {
  TcpNativeModule.sendCommand(vehicleId, command);
}


