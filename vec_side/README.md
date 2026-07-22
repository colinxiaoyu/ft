adb shell input keyevent 82

adb kill-server
adb start-server

scrcpy

http-server ./ -p 8080 --cors

#### 启动项目
1. yarn start
2. cd android/app/src/main/assets  http-server  修改 src/utils/Api.js  debugHttpServer
3. usb 连接 电脑， 输入 adb reverse tcp:8081 tcp:8081 ,在 yarn start 控制台输入 a 或者 r


#### 驾驶模式 
1人工接管（人工驾驶）；2：单车自控（自动驾驶）；3：云端支持下的人工驾驶；\n * 4：云端支持下的自动驾驶；\n * 5：非主驾位置人工驾驶（不启用）；6：脱离（非自动驾驶行程自动结束下的接管）；\n * 7：远程驾驶（非现场人工驾驶）；8：未处于任何驾驶模式；\n * 9：其他未定义状态；0xFF表示缺省


#### 任务状态 
0:未分配 1:执行中 2:已暂停 3:已分配（未分配）9:已完成 -1:已取消 -2:作业失败,可用值:0,3,1,9,-2,2,-1


### 车辆状态
0:离线 1:空闲 2:执行中

### taskList
状态 0:未分配 1:执行中 2:已暂停 3:已分配 5:路由不可达 9:已完成 -1:已取消 -2:任务失败,可用值:0,3,1,2,5,9,-1,-2


15558095832    Cicvcicv2024.


### tcp 相关
tapPos 档位信号 31:D档(前进档);32:R档(倒档);33:P档(驻车档);
scramFlag 0 取消紧急制动  1紧急制动
driveMode  4 自动驾驶  1 人工驾驶 
电量百分比：  soc 单位0.01%
速度 ：  velocity  单位 0.01m/s

第一个 停车的时候亮 ，第二个是紧急急停的时候亮  第三个是有任何故障信息的时候亮


tapPos  scramFlag  remoteScramFlag driveMode  soc velocity 

{
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
        "latitude": 0,
        "longitude": 0
    },
    "detectionData": [],
    "detectionLen": 0,
    "dmsFlag": 255,
    "doors": 65535,
    "driveMode": 4,
    "endurance": 4294967295,
    "engineSpeed": 65535,
    "engineTorque": 4294967295,
    "epbFlag": 255,
    "espFlag": 255,
    "fcwFlag": 255,
    "fuelConsumption": 65535,
    "fuelGauge": 65535,
    "heading": 270.7389,
    "hornState": 255,
    "jobId": 1,
    "lcaFlag": 255,
    "ldwFlag": 255,
    "lights": 65535,
    "lkaFlag": 255,
    "messageId": 5362,
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
        "elevation": 4294967295,
        "latitude": 36.6937529,
        "longitude": 119.2741997
    },
    "remoteScramFlag": 0,
    "scramFlag": 0,
    "signalStrength": 0,
    "soc": 6200,
    "steeringAngle": 10000000,
    "tapPos": 31,
    "tcsFlag": 255,
    "temperature": 255,
    "timestampGNSS": 1736388720089,
    "tirePressure": [],
    "torqueCmd": 4294967295,
    "userdefinedData": "",
    "userdefinedData1": "",
    "userdefinedData2": "",
    "userdefinedDataLength": 0,
    "userdefinedDataLength1": 0,
    "userdefinedDataLength2": 0,
    "vehFault": 4194304,
    "vehMode": 255,
    "velocity": 3.9960000000000004,
    "velocityCmd": 65535,
    "velocityGNSS": 1.044,
    "wheelNum": 0,
    "wheelVelocity": [],
    "yawRate": 65535,
    "bodyLen": 180,
    "controlContent": 0,
    "identifier": 242,
    "timestamp": 1736388720150,
    "type": 21,
    "vehicleId": "XXHPT1D2022101869",
    "version": 3
}

1. 个人信息

appcenter codepush deployment add -a yuheng_0710-outlook.com/FTZJ Staging


appcenter codepush release-react -a yuheng_0710-outlook.com/FTZJ -m --description "测试"


appcenter codepush deployment list -a  yuheng_0710-outlook.com/FTZJ

appcenter codepush deployment list -a  yuheng_0710-outlook.com/FTZJ -k

appcenter apps delete -a yuheng_0710-outlook.com/

appcenter apps create -d FTZJ -o Android -p React-Native


appcenter codepush deployment add -a yuheng_0710-outlook.com/FTZJ Staging

appcenter codepush deployment add -a yuheng_0710-outlook.com/FTZJ Production


appcenter codepush deployment history -a  yuheng_0710-outlook.com/FTZJ Staging

 Staging    │ Jvs-3-_WGYRzY8gHERiYMEOueG8AKxdYJ98GYm │
├────────────┼────────────────────────────────────────┤
│ Production │ 2TWae7ZmGJhZUylD_EQqnc-PHUzThqL-p7tcZ7 
