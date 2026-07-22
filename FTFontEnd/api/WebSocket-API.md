# WebSocket API

## API

**接口地址**:`/realtime/{uuid}`

**接口描述**: 
通过websocket消息，接收小车上报的实时位置信息和Task步骤变更信息。
* 使用方式：
  1. 建立连接
  2. 保持心跳机制，每隔几秒发送一次心跳
  3. 订阅消息，需要接收实时信息进行消息订阅
  4. 取消订阅，在不需要接收消息后进行退订

**请求参数**:

| 参数名称      | 参数说明                           | 请求类型 | 是否必须 | 数据类型   | schema |
|-----------|--------------------------------|------|------|--------|--------|
| uuid      | 唯一消息会话ID                       | path | true | string |        |
| Request   |                                | body | true | object |
| type      | SUB, UNSUB, PING, PONG, RESULT |      | true | string |
| projectId | 项目ID                           |      | true | string |

**请求示例**

```shell
# 订阅消息
{"type": "SUB", "projectId": "1865994966275584002"}

# 退订，取消订阅
{"type": "UNSUB", "projectId": "1865994966275584002"}

# 心跳机制 解决WebSocket连接保持活跃，定时向服务器发送心跳消息。 如果不发送，客户端一段时间后会无法收到
{"type": "PING"}
```

**响应参数**:

| 参数名称         | 参数说明                                                                | 类型     | schema |
|--------------|---------------------------------------------------------------------|--------|--------| 
| type         | RESULT                                                              | string |        |
| businessType | 业务类型<br/> JOB_CHANGE: 任务变更<br/> VEH_REAL:小车实时位置<br/> VEH_ALARM:告警信息 | string |        |
| payload      | 具体信息                                                                | object |        |

**响应示例**:

```shell
# 心跳机制 应答
{"type": "PONG"}

# 小车实时位置信息
{
  "type": "RESULT",
  "businessType": "VEH_REAL",
  "payload": {
    # 所在位置时间
    "timestamp": 1734750252133,
    "projectId": "1865994966275584002",
    "jobId": "1870290801737117697",
    "taskId": "1870290802060079106",
    "actionStatus": "GO_WORKING",
    "taskStatus": 1,
    "actionCode": "loadCargo",
    "vehInstanceId": "vehicle1827975241448202240",
    "deviceId": "LTFKEVS7XX08261",
    # VIN
    "vin": "LTFKEVS7XX08261",
    "license": "京A8261",
    # 经度
    "longitude": "116.2539247818902",
    # 纬度
    "latitude": "40.1238781834856",
    "elevation": "null",
    # 速度 单位：km/h
    "speed": 180,
    # 航向角 单位：度
    "heading": 358.6605,
    "pathPogress": 100,
    # 剩余里程 单位：米
    "remMileage": 0,
    # 剩余时间 单位：分
    "remGoTime": 0
  }
}

# Task步骤变更信息
{
    "type": "RESULT",
    "businessType": "JOB_CHANGE",
    "payload": {
        # 任务ID
        "jobId": "1870290801737117697",
        # 项目ID
        "projectId": "1865994966275584002",
        # 步骤ID
        "taskId": "1870290802060079107"
    }
}
```