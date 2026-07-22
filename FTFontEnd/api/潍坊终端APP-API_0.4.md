# OpenAPI definition


**简介**:OpenAPI definition


**HOST**:http://localhost:8082


**联系人**:


**Version**:v0


**接口路径**:/v3/api-docs


[TOC]






# 车辆信息


## 车辆详情


**接口地址**:`/veh/{vin}/detail`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| vin      |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema           |
| ------ | --------------------- | ---------------- |
| 200    | OK                    | RVehDetailInfoVO |
| 500    | Internal Server Error | ReturnVOVoid     |


**响应状态码-200**:


**响应参数**:


| 参数名称                    | 参数说明                                     | 类型            | schema          |
| --------------------------- | -------------------------------------------- | --------------- | --------------- |
| code                        | 200：成功                                    | string          |                 |
| msg                         |                                              | string          |                 |
| data                        |                                              | VehDetailInfoVO | VehDetailInfoVO |
| &emsp;&emsp;vin             | VIN                                          | string          |                 |
| &emsp;&emsp;status          | 车辆状态 0:离线 1:空闲 2:执行中,可用值:0,1,2 | string          |                 |
| &emsp;&emsp;vehType         | 车辆类型                                     | string          |                 |
| &emsp;&emsp;workId          | 工单ID                                       | string          |                 |
| &emsp;&emsp;position        |                                              | PositionDTO     | PositionDTO     |
| &emsp;&emsp;&emsp;&emsp;lat | 纬度                                         | number(double)  |                 |
| &emsp;&emsp;&emsp;&emsp;lon | 纬度                                         | number(double)  |                 |
| &emsp;&emsp;velocity        | 速度 单位：m/s                               | integer(int32)  |                 |
| &emsp;&emsp;heading         | 航向角 正北向0 单位：°                       | integer(int32)  |                 |
| &emsp;&emsp;chargedState    | 充电状态 0:未充电 1:充电中                   | string(byte)    |                 |
| &emsp;&emsp;scramFlag       | 紧急制动状态 0：关，1：开                    | string(byte)    |                 |
| &emsp;&emsp;driveMode       | 车辆驾驶模式 1：人工 4：自动                 | string(byte)    |                 |
| &emsp;&emsp;tapPos          | 挡位                                         | string(byte)    |                 |
| &emsp;&emsp;vehFault        | 车辆故障状态 0：无故障；1：故障              | string(byte)    |                 |
| &emsp;&emsp;pointId         | 所在站点ID                                   | string          |                 |
| &emsp;&emsp;pointName       | 所在站点名称                                 | string          |                 |
| &emsp;&emsp;dayMileage      | 车辆当天行驶里程 单位：m                     | integer(int64)  |                 |
| &emsp;&emsp;remDrivingTime  | 本次充电行驶的时长 单位：分                  | integer(int32)  |                 |
| &emsp;&emsp;remSoc          | 车辆剩余电量 单位：%                         | integer(int32)  |                 |
| &emsp;&emsp;endurance       | 预计续航里程（km）                           | number(double)  |                 |
| success                     |                                              | boolean         |                 |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {
		"vin": "",
		"status": "",
		"vehType": "",
		"workId": "",
		"position": {
			"lat": 0,
			"lon": 0
		},
		"velocity": 0,
		"heading": 0,
		"chargedState": "",
		"scramFlag": "",
		"driveMode": "",
		"tapPos": "",
		"vehFault": "",
		"pointId": "",
		"pointName": "",
		"dayMileage": 0,
		"remDrivingTime": 0,
		"remSoc": 0,
		"endurance": 0
	},
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 历史轨迹查询


**接口地址**:`/veh/{vin}/history-track`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "startTime": "",
  "endTime": ""
}
```


**请求参数**:


| 参数名称                  | 参数说明                     | 请求类型 | 是否必须 | 数据类型                  | schema                    |
| ------------------------- | ---------------------------- | -------- | -------- | ------------------------- | ------------------------- |
| vin                       |                              | path     | true     | string                    |                           |
| historyTrackRealTimeQuery | 历史轨迹回放查询对象         | body     | true     | HistoryTrackRealTimeQuery | HistoryTrackRealTimeQuery |
| &emsp;&emsp;startTime     | 开始时间 yyyy-MM-dd HH:mm:ss |          | true     | string(date-time)         |                           |
| &emsp;&emsp;endTime       | 结束时间 yyyy-MM-dd HH:mm:ss |          | true     | string(date-time)         |                           |


**响应状态**:


| 状态码 | 说明                  | schema                 |
| ------ | --------------------- | ---------------------- |
| 200    | OK                    | RRealTimeVehHistoryDTO |
| 500    | Internal Server Error | ReturnVOVoid           |


**响应状态码-200**:


**响应参数**:


| 参数名称                               | 参数说明                                                                                                                                                                                                                                                                                                         | 类型                  | schema                |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------------------- |
| code                                   | 200：成功                                                                                                                                                                                                                                                                                                        | string                |                       |
| msg                                    |                                                                                                                                                                                                                                                                                                                  | string                |                       |
| data                                   |                                                                                                                                                                                                                                                                                                                  | RealTimeVehHistoryDTO | RealTimeVehHistoryDTO |
| &emsp;&emsp;vin                        | VIN码                                                                                                                                                                                                                                                                                                            | string                |                       |
| &emsp;&emsp;list                       | 事件                                                                                                                                                                                                                                                                                                             | array                 | RealTimeInfoAndTask   |
| &emsp;&emsp;&emsp;&emsp;deviceId       | 设备编号                                                                                                                                                                                                                                                                                                         | string                |                       |
| &emsp;&emsp;&emsp;&emsp;timestamp      | 时间戳                                                                                                                                                                                                                                                                                                           | integer(int64)        |                       |
| &emsp;&emsp;&emsp;&emsp;longitude      | 经度                                                                                                                                                                                                                                                                                                             | string                |                       |
| &emsp;&emsp;&emsp;&emsp;latitude       | 纬度                                                                                                                                                                                                                                                                                                             | string                |                       |
| &emsp;&emsp;&emsp;&emsp;driveMode      | 驾驶模式 1人工接管（人工驾驶）；2：单车自控（自动驾驶）；3：云端支持下的人工驾驶；\n     * 4：云端支持下的自动驾驶；\n     * 5：非主驾位置人工驾驶（不启用）；6：脱离（非自动驾驶行程自动结束下的接管）；\n     * 7：远程驾驶（非现场人工驾驶）；8：未处于任何驾驶模式；\n     * 9：其他未定义状态；0xFF表示缺省 | integer(int32)        |                       |
| &emsp;&emsp;&emsp;&emsp;heading        | 航向角                                                                                                                                                                                                                                                                                                           | number(double)        |                       |
| &emsp;&emsp;&emsp;&emsp;speed          | 速度（m/s）                                                                                                                                                                                                                                                                                                      | integer(int32)        |                       |
| &emsp;&emsp;&emsp;&emsp;actionStatus   |                                                                                                                                                                                                                                                                                                                  | string                |                       |
| &emsp;&emsp;&emsp;&emsp;durationOfStay | 停留时常（毫秒）                                                                                                                                                                                                                                                                                                 | integer(int64)        |                       |
| &emsp;&emsp;&emsp;&emsp;actionCode     |                                                                                                                                                                                                                                                                                                                  | string                |                       |
| &emsp;&emsp;vehType                    | 车辆类型                                                                                                                                                                                                                                                                                                         | string                |                       |
| &emsp;&emsp;issueDate                  | 下发时间                                                                                                                                                                                                                                                                                                         | string(date-time)     |                       |
| &emsp;&emsp;executeDate                | 执行时间                                                                                                                                                                                                                                                                                                         | string(date-time)     |                       |
| success                                |                                                                                                                                                                                                                                                                                                                  | boolean               |                       |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {
		"vin": "",
		"list": [
			{
				"deviceId": "",
				"timestamp": 0,
				"longitude": "",
				"latitude": "",
				"driveMode": 0,
				"heading": 0,
				"speed": 0,
				"actionStatus": "",
				"durationOfStay": 0,
				"actionCode": ""
			}
		],
		"vehType": "",
		"issueDate": "",
		"executeDate": ""
	},
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 根据站点查询路径规划路线


**接口地址**:`/veh/{vin}/path-plan`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "stationIdList": []
}
```


**请求参数**:


| 参数名称                  | 参数说明         | 请求类型 | 是否必须 | 数据类型         | schema           |
| ------------------------- | ---------------- | -------- | -------- | ---------------- | ---------------- |
| vin                       |                  | path     | true     | string           |                  |
| pathPlanQueryCmd          | 路径规划查询对象 | body     | true     | PathPlanQueryCmd | PathPlanQueryCmd |
| &emsp;&emsp;stationIdList | 站点ID集合       |          | false    | array            | string           |


**响应状态**:


| 状态码 | 说明                  | schema                   |
| ------ | --------------------- | ------------------------ |
| 200    | OK                    | RListPathPlanningItemDTO |
| 500    | Internal Server Error | ReturnVOVoid             |


**响应状态码-200**:


**响应参数**:


| 参数名称                    | 参数说明                   | 类型           | schema              |
| --------------------------- | -------------------------- | -------------- | ------------------- |
| code                        | 200：成功                  | string         |                     |
| msg                         |                            | string         |                     |
| data                        |                            | array          | PathPlanningItemDTO |
| &emsp;&emsp;id              | 唯一路段id                 | string         |                     |
| &emsp;&emsp;pointList       | 所有的点，包括起始点控制点 | array          | PositionDTO         |
| &emsp;&emsp;&emsp;&emsp;lat | 纬度                       | number(double) |                     |
| &emsp;&emsp;&emsp;&emsp;lon | 纬度                       | number(double) |                     |
| &emsp;&emsp;distance        | 距离                       | number(double) |                     |
| &emsp;&emsp;pathId          | 路段ID                     | integer(int32) |                     |
| success                     |                            | boolean        |                     |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": [
		{
			"id": "",
			"pointList": [
				{
					"lat": 0,
					"lon": 0
				}
			],
			"distance": 0,
			"pathId": 0
		}
	],
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 根据站点查询路径规划路线（返回起始点）


**接口地址**:`/veh/{vin}/path-plan-point`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "stationIdList": []
}
```


**请求参数**:


| 参数名称                  | 参数说明         | 请求类型 | 是否必须 | 数据类型         | schema           |
| ------------------------- | ---------------- | -------- | -------- | ---------------- | ---------------- |
| vin                       |                  | path     | true     | string           |                  |
| pathPlanQueryCmd          | 路径规划查询对象 | body     | true     | PathPlanQueryCmd | PathPlanQueryCmd |
| &emsp;&emsp;stationIdList | 站点ID集合       |          | false    | array            | string           |


**响应状态**:


| 状态码 | 说明                  | schema           |
| ------ | --------------------- | ---------------- |
| 200    | OK                    | RPathPlanningDTO |
| 500    | Internal Server Error | ReturnVOVoid     |


**响应状态码-200**:


**响应参数**:


| 参数名称                                | 参数说明                   | 类型            | schema              |
| --------------------------------------- | -------------------------- | --------------- | ------------------- |
| code                                    | 200：成功                  | string          |                     |
| msg                                     |                            | string          |                     |
| data                                    |                            | PathPlanningDTO | PathPlanningDTO     |
| &emsp;&emsp;vin                         |                            | string          |                     |
| &emsp;&emsp;startPoint                  |                            | StationDTO      | StationDTO          |
| &emsp;&emsp;&emsp;&emsp;id              | 主键                       | string          |                     |
| &emsp;&emsp;&emsp;&emsp;serial          | 站点编号                   | string          |                     |
| &emsp;&emsp;&emsp;&emsp;type            | 站点类型                   | string          |                     |
| &emsp;&emsp;&emsp;&emsp;name            | 站点名称                   | string          |                     |
| &emsp;&emsp;&emsp;&emsp;positionDTO     |                            | PositionDTO     | PositionDTO         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lat | 纬度                       | number(double)  |                     |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lon | 纬度                       | number(double)  |                     |
| &emsp;&emsp;endPoint                    |                            | StationDTO      | StationDTO          |
| &emsp;&emsp;&emsp;&emsp;id              | 主键                       | string          |                     |
| &emsp;&emsp;&emsp;&emsp;serial          | 站点编号                   | string          |                     |
| &emsp;&emsp;&emsp;&emsp;type            | 站点类型                   | string          |                     |
| &emsp;&emsp;&emsp;&emsp;name            | 站点名称                   | string          |                     |
| &emsp;&emsp;&emsp;&emsp;positionDTO     |                            | PositionDTO     | PositionDTO         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lat | 纬度                       | number(double)  |                     |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lon | 纬度                       | number(double)  |                     |
| &emsp;&emsp;estMileage                  | 预计行驶里程 单位：m       | integer(int64)  |                     |
| &emsp;&emsp;estGoTime                   | 预计行驶时长 单位：分      | integer(int32)  |                     |
| &emsp;&emsp;pathPlanList                |                            | array           | PathPlanningItemDTO |
| &emsp;&emsp;&emsp;&emsp;id              | 唯一路段id                 | string          |                     |
| &emsp;&emsp;&emsp;&emsp;pointList       | 所有的点，包括起始点控制点 | array           | PositionDTO         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lat | 纬度                       | number(double)  |                     |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lon | 纬度                       | number(double)  |                     |
| &emsp;&emsp;&emsp;&emsp;distance        | 距离                       | number(double)  |                     |
| &emsp;&emsp;&emsp;&emsp;pathId          | 路段ID                     | integer(int32)  |                     |
| success                                 |                            | boolean         |                     |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {
		"vin": "",
		"startPoint": {
			"id": "",
			"serial": "",
			"type": "",
			"name": "",
			"positionDTO": {
				"lat": 0,
				"lon": 0
			}
		},
		"endPoint": {},
		"estMileage": 0,
		"estGoTime": 0,
		"pathPlanList": [
			{
				"id": "",
				"pointList": [
					{
						"lat": 0,
						"lon": 0
					}
				],
				"distance": 0,
				"pathId": 0
			}
		]
	},
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 充电


**接口地址**:`/veh/{vin}/recharge`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| vin      |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RBoolean     |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明  | 类型    | schema |
| -------- | --------- | ------- | ------ |
| code     | 200：成功 | string  |        |
| msg      |           | string  |        |
| data     |           | boolean |        |
| success  |           | boolean |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": true,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 回库


**接口地址**:`/veh/{vin}/recycle`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| vin      |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RBoolean     |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明  | 类型    | schema |
| -------- | --------- | ------- | ------ |
| code     | 200：成功 | string  |        |
| msg      |           | string  |        |
| data     |           | boolean |        |
| success  |           | boolean |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": true,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 车辆列表


**接口地址**:`/veh/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| vin      |          | query    | false    | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema             |
| ------ | --------------------- | ------------------ |
| 200    | OK                    | RListVehBaseInfoVO |
| 500    | Internal Server Error | ReturnVOVoid       |


**响应状态码-200**:


**响应参数**:


| 参数名称                    | 参数说明                                     | 类型           | schema        |
| --------------------------- | -------------------------------------------- | -------------- | ------------- |
| code                        | 200：成功                                    | string         |               |
| msg                         |                                              | string         |               |
| data                        |                                              | array          | VehBaseInfoVO |
| &emsp;&emsp;vin             | VIN                                          | string         |               |
| &emsp;&emsp;status          | 车辆状态 0:离线 1:空闲 2:执行中,可用值:0,1,2 | string         |               |
| &emsp;&emsp;vehType         | 车辆类型                                     | string         |               |
| &emsp;&emsp;workId          | 工单ID                                       | string         |               |
| &emsp;&emsp;position        |                                              | PositionDTO    | PositionDTO   |
| &emsp;&emsp;&emsp;&emsp;lat | 纬度                                         | number(double) |               |
| &emsp;&emsp;&emsp;&emsp;lon | 纬度                                         | number(double) |               |
| success                     |                                              | boolean        |               |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": [
		{
			"vin": "",
			"status": "",
			"vehType": "",
			"workId": "",
			"position": {
				"lat": 0,
				"lon": 0
			}
		}
	],
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


# 公共接口管理


## 配置信息


**接口地址**:`/common/config-info`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RConfigInfo  |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称              | 参数说明  | 类型       | schema     |
| --------------------- | --------- | ---------- | ---------- |
| code                  | 200：成功 | string     |            |
| msg                   |           | string     |            |
| data                  |           | ConfigInfo | ConfigInfo |
| &emsp;&emsp;projectId |           | string     |            |
| success               |           | boolean    |            |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {
		"projectId": ""
	},
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 货物名称列表


**接口地址**:`/common/goods-list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称  | 参数说明                           | 请求类型 | 是否必须 | 数据类型       | schema |
| --------- | ---------------------------------- | -------- | -------- | -------------- | ------ |
| timestamp | 时间戳（毫秒）指定时间更新后的数据 | query    | false    | integer(int64) |        |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RGoodsObjDTO |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称                            | 参数说明           | 类型           | schema      |
| ----------------------------------- | ------------------ | -------------- | ----------- |
| code                                | 200：成功          | string         |             |
| msg                                 |                    | string         |             |
| data                                |                    | GoodsObjDTO    | GoodsObjDTO |
| &emsp;&emsp;list                    |                    | array          | GoodsDTO    |
| &emsp;&emsp;&emsp;&emsp;goodsCode   | 货物编码           | string         |             |
| &emsp;&emsp;&emsp;&emsp;goodsName   | 货物名称           | string         |             |
| &emsp;&emsp;&emsp;&emsp;goodsNamePy | 货物名称拼音首字母 | string         |             |
| &emsp;&emsp;timestamp               |                    | integer(int64) |             |
| success                             |                    | boolean        |             |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {
		"list": [
			{
				"goodsCode": "",
				"goodsName": "",
				"goodsNamePy": ""
			}
		],
		"timestamp": 0
	},
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 站点列表


**接口地址**:`/common/station-list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| type     | 站点类型 | query    | false    | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema          |
| ------ | --------------------- | --------------- |
| 200    | OK                    | RListStationDTO |
| 500    | Internal Server Error | ReturnVOVoid    |


**响应状态码-200**:


**响应参数**:


| 参数名称                    | 参数说明  | 类型           | schema      |
| --------------------------- | --------- | -------------- | ----------- |
| code                        | 200：成功 | string         |             |
| msg                         |           | string         |             |
| data                        |           | array          | StationDTO  |
| &emsp;&emsp;id              | 主键      | string         |             |
| &emsp;&emsp;serial          | 站点编号  | string         |             |
| &emsp;&emsp;type            | 站点类型  | string         |             |
| &emsp;&emsp;name            | 站点名称  | string         |             |
| &emsp;&emsp;positionDTO     |           | PositionDTO    | PositionDTO |
| &emsp;&emsp;&emsp;&emsp;lat | 纬度      | number(double) |             |
| &emsp;&emsp;&emsp;&emsp;lon | 纬度      | number(double) |             |
| success                     |           | boolean        |             |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": [
		{
			"id": "",
			"serial": "",
			"type": "",
			"name": "",
			"positionDTO": {
				"lat": 0,
				"lon": 0
			}
		}
	],
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


# 故障管理


## 根据id查询故障详情


**接口地址**:`/fault/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| id       |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RVehFaultDTO |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称                    | 参数说明     | 类型              | schema      |
| --------------------------- | ------------ | ----------------- | ----------- |
| code                        | 200：成功    | string            |             |
| msg                         |              | string            |             |
| data                        |              | VehFaultDTO       | VehFaultDTO |
| &emsp;&emsp;id              | 故障ID       | string            |             |
| &emsp;&emsp;faultType       | 故障类型     | string            |             |
| &emsp;&emsp;faultDesc       | 故障原因     | string            |             |
| &emsp;&emsp;faultCode       | 故障状态码   | string            |             |
| &emsp;&emsp;status          | 故障状态     | integer(int32)    |             |
| &emsp;&emsp;startTime       | 故障报警时间 | string(date-time) |             |
| &emsp;&emsp;endTime         | 解除故障时间 | string(date-time) |             |
| &emsp;&emsp;location        |              | PositionDTO       | PositionDTO |
| &emsp;&emsp;&emsp;&emsp;lat | 纬度         | number(double)    |             |
| &emsp;&emsp;&emsp;&emsp;lon | 纬度         | number(double)    |             |
| &emsp;&emsp;vin             |              | string            |             |
| &emsp;&emsp;deviceId        |              | string            |             |
| success                     |              | boolean           |             |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {
		"id": "",
		"faultType": "",
		"faultDesc": "",
		"faultCode": "",
		"status": 0,
		"startTime": "",
		"endTime": "",
		"location": {
			"lat": 0,
			"lon": 0
		},
		"vin": "",
		"deviceId": ""
	},
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 忽略故障


**接口地址**:`/fault/{id}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| id       |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RBoolean     |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明  | 类型    | schema |
| -------- | --------- | ------- | ------ |
| code     | 200：成功 | string  |        |
| msg      |           | string  |        |
| data     |           | boolean |        |
| success  |           | boolean |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": true,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 根据故障列表


**接口地址**:`/fault/list`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "size": 0,
  "orderBy": "",
  "faultCode": "",
  "status": 0,
  "vin": ""
}
```


**请求参数**:


| 参数名称              | 参数说明     | 请求类型 | 是否必须 | 数据类型         | schema           |
| --------------------- | ------------ | -------- | -------- | ---------------- | ---------------- |
| vehFaultQueryCmd      | 故障查询对象 | body     | true     | VehFaultQueryCmd | VehFaultQueryCmd |
| &emsp;&emsp;size      | 查询数量     |          | false    | integer(int32)   |                  |
| &emsp;&emsp;orderBy   | 排序         |          | false    | string           |                  |
| &emsp;&emsp;faultCode | 故障状态码   |          | false    | string           |                  |
| &emsp;&emsp;status    | 故障状态     |          | false    | integer(int32)   |                  |
| &emsp;&emsp;vin       | VIN          |          | false    | string           |                  |


**响应状态**:


| 状态码 | 说明                  | schema           |
| ------ | --------------------- | ---------------- |
| 200    | OK                    | RListVehFaultDTO |
| 500    | Internal Server Error | ReturnVOVoid     |


**响应状态码-200**:


**响应参数**:


| 参数名称                    | 参数说明     | 类型              | schema      |
| --------------------------- | ------------ | ----------------- | ----------- |
| code                        | 200：成功    | string            |             |
| msg                         |              | string            |             |
| data                        |              | array             | VehFaultDTO |
| &emsp;&emsp;id              | 故障ID       | string            |             |
| &emsp;&emsp;faultType       | 故障类型     | string            |             |
| &emsp;&emsp;faultDesc       | 故障原因     | string            |             |
| &emsp;&emsp;faultCode       | 故障状态码   | string            |             |
| &emsp;&emsp;status          | 故障状态     | integer(int32)    |             |
| &emsp;&emsp;startTime       | 故障报警时间 | string(date-time) |             |
| &emsp;&emsp;endTime         | 解除故障时间 | string(date-time) |             |
| &emsp;&emsp;location        |              | PositionDTO       | PositionDTO |
| &emsp;&emsp;&emsp;&emsp;lat | 纬度         | number(double)    |             |
| &emsp;&emsp;&emsp;&emsp;lon | 纬度         | number(double)    |             |
| &emsp;&emsp;vin             |              | string            |             |
| &emsp;&emsp;deviceId        |              | string            |             |
| success                     |              | boolean           |             |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": [
		{
			"id": "",
			"faultType": "",
			"faultDesc": "",
			"faultCode": "",
			"status": 0,
			"startTime": "",
			"endTime": "",
			"location": {
				"lat": 0,
				"lon": 0
			},
			"vin": "",
			"deviceId": ""
		}
	],
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


# 任务管理


## 取消


**接口地址**:`/job/{id}/cancel`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| id       |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RBoolean     |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明  | 类型    | schema |
| -------- | --------- | ------- | ------ |
| code     | 200：成功 | string  |        |
| msg      |           | string  |        |
| data     |           | boolean |        |
| success  |           | boolean |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": true,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 继续


**接口地址**:`/job/{id}/continue`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| id       |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RBoolean     |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明  | 类型    | schema |
| -------- | --------- | ------- | ------ |
| code     | 200：成功 | string  |        |
| msg      |           | string  |        |
| data     |           | boolean |        |
| success  |           | boolean |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": true,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 任务详情


**接口地址**:`/job/{id}/detail`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| id       |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema               |
| ------ | --------------------- | -------------------- |
| 200    | OK                    | RWorkJobDetailInfoVO |
| 500    | Internal Server Error | ReturnVOVoid         |


**响应状态码-200**:


**响应参数**:


| 参数名称                                     | 参数说明                                                                                                      | 类型                | schema              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------- |
| code                                         | 200：成功                                                                                                     | string              |                     |
| msg                                          |                                                                                                               | string              |                     |
| data                                         |                                                                                                               | WorkJobDetailInfoVO | WorkJobDetailInfoVO |
| &emsp;&emsp;id                               | 任务ID                                                                                                        | string              |                     |
| &emsp;&emsp;orderNo                          | 订单号                                                                                                        | string              |                     |
| &emsp;&emsp;jobId                            | 任务ID（任务ID）                                                                                              | string              |                     |
| &emsp;&emsp;jobNo                            | 任务单号（任务ID）                                                                                            | string              |                     |
| &emsp;&emsp;workNo                           | 工单编号                                                                                                      | string              |                     |
| &emsp;&emsp;status                           | 任务状态 1:执行中 2:已暂停 3:已分配（未分配）9:已完成 -1:已取消 -2:作业失败,可用值:0,3,1,9,-2,2,-1            | string              |                     |
| &emsp;&emsp;vin                              | VIN                                                                                                           | string              |                     |
| &emsp;&emsp;startTime                        | 任务开始时间                                                                                                  | string(date-time)   |                     |
| &emsp;&emsp;endTime                          | 任务结束时间                                                                                                  | string(date-time)   |                     |
| &emsp;&emsp;operations                       | 可操作按钮 START_DELIVERY:开始送货 UNLOADED:卸货完成 CANCEL:取消 PAUSE:暂停 CONTINUE:继续                     | array               | string              |
| &emsp;&emsp;goodsList                        | 货物信息                                                                                                      | array               | JobGoodsVO          |
| &emsp;&emsp;&emsp;&emsp;id                   | 货物集行ID                                                                                                    | string              |                     |
| &emsp;&emsp;&emsp;&emsp;goods                | 货物                                                                                                          | string              |                     |
| &emsp;&emsp;&emsp;&emsp;startPointId         | 起点ID                                                                                                        | string              |                     |
| &emsp;&emsp;&emsp;&emsp;startPointName       | 起点名称                                                                                                      | string              |                     |
| &emsp;&emsp;&emsp;&emsp;endPointId           | 终点ID                                                                                                        | string              |                     |
| &emsp;&emsp;&emsp;&emsp;endPointName         | 终点名称                                                                                                      | string              |                     |
| &emsp;&emsp;vehDetailVO                      |                                                                                                               | JobVehDetailVO      | JobVehDetailVO      |
| &emsp;&emsp;&emsp;&emsp;mileagePer           | 本次行驶里程AD占比                                                                                            | string(byte)        |                     |
| &emsp;&emsp;&emsp;&emsp;manualDrivingMileage | 本次人工驾驶里程 单位：m                                                                                      | integer(int64)      |                     |
| &emsp;&emsp;&emsp;&emsp;automaticMileage     | 本次自动驾驶里程 单位：m                                                                                      | integer(int64)      |                     |
| &emsp;&emsp;&emsp;&emsp;timePer              | 本次驾驶时长AD占比                                                                                            | string(byte)        |                     |
| &emsp;&emsp;&emsp;&emsp;manualDrivingTime    | 本次人工驾驶时长 单位：秒                                                                                     | integer(int32)      |                     |
| &emsp;&emsp;&emsp;&emsp;automaticTime        | 本次自动驾驶时长 单位：秒                                                                                     | integer(int32)      |                     |
| &emsp;&emsp;&emsp;&emsp;maxVelocity          | 最高车速 单位：h                                                                                              | integer(int32)      |                     |
| &emsp;&emsp;&emsp;&emsp;minVelocity          | 最低车速 单位：h                                                                                              | integer(int32)      |                     |
| &emsp;&emsp;&emsp;&emsp;avgVelocity          | 平均车速 单位：h                                                                                              | integer(int32)      |                     |
| &emsp;&emsp;&emsp;&emsp;arrivalState         | 车辆到达状态 0：空 1：准时 2：超时 3：未到达                                                                  | string(byte)        |                     |
| &emsp;&emsp;&emsp;&emsp;estMileage           | 预计行驶里程 单位：m                                                                                          | integer(int64)      |                     |
| &emsp;&emsp;&emsp;&emsp;estGoTime            | 预计行驶时长 单位：分                                                                                         | integer(int32)      |                     |
| &emsp;&emsp;&emsp;&emsp;manualDrivingCount   | 人工接管次数                                                                                                  | integer(int32)      |                     |
| &emsp;&emsp;taskList                         | 任务状态信息                                                                                                  | array               | JobTaskVO           |
| &emsp;&emsp;&emsp;&emsp;taskId               | 步骤ID                                                                                                        | string              |                     |
| &emsp;&emsp;&emsp;&emsp;actionCode           | 行为编码                                                                                                      | string              |                     |
| &emsp;&emsp;&emsp;&emsp;actionName           | 行为名称                                                                                                      | string              |                     |
| &emsp;&emsp;&emsp;&emsp;status               | 状态 0:未分配 1:执行中 2:已暂停 3:已分配 5:路由不可达 9:已完成 -1:已取消 -2:任务失败,可用值:0,3,1,2,5,9,-1,-2 | string              |                     |
| &emsp;&emsp;&emsp;&emsp;goStartTime          | 任务去哪开始时间                                                                                              | string(date-time)   |                     |
| &emsp;&emsp;&emsp;&emsp;goEndTime            | 任务去哪结束时间                                                                                              | string(date-time)   |                     |
| &emsp;&emsp;&emsp;&emsp;doStartTime          | 任务做什么开始时间                                                                                            | string(date-time)   |                     |
| &emsp;&emsp;&emsp;&emsp;doEndTime            | 任务做什么结束时间                                                                                            | string(date-time)   |                     |
| &emsp;&emsp;&emsp;&emsp;planTrack            | 路径规划                                                                                                      | array               | PositionDTO         |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lat      | 纬度                                                                                                          | number(double)      |                     |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lon      | 纬度                                                                                                          | number(double)      |                     |
| &emsp;&emsp;&emsp;&emsp;endPointName         | 终点名称                                                                                                      | string              |                     |
| success                                      |                                                                                                               | boolean             |                     |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {
		"id": "",
		"orderNo": "",
		"jobId": "",
		"jobNo": "",
		"workNo": "",
		"status": "",
		"vin": "",
		"startTime": "",
		"endTime": "",
		"operations": [],
		"goodsList": [
			{
				"id": "",
				"goods": "",
				"startPointId": "",
				"startPointName": "",
				"endPointId": "",
				"endPointName": ""
			}
		],
		"vehDetailVO": {
			"mileagePer": "",
			"manualDrivingMileage": 0,
			"automaticMileage": 0,
			"timePer": "",
			"manualDrivingTime": 0,
			"automaticTime": 0,
			"maxVelocity": 0,
			"minVelocity": 0,
			"avgVelocity": 0,
			"arrivalState": "",
			"estMileage": 0,
			"estGoTime": 0,
			"manualDrivingCount": 0
		},
		"taskList": [
			{
				"taskId": "",
				"actionCode": "",
				"actionName": "",
				"status": "",
				"goStartTime": "",
				"goEndTime": "",
				"doStartTime": "",
				"doEndTime": "",
				"planTrack": [
					{
						"lat": 0,
						"lon": 0
					}
				],
				"endPointName": ""
			}
		]
	},
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 暂停


**接口地址**:`/job/{id}/pause`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| id       |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RBoolean     |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明  | 类型    | schema |
| -------- | --------- | ------- | ------ |
| code     | 200：成功 | string  |        |
| msg      |           | string  |        |
| data     |           | boolean |        |
| success  |           | boolean |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": true,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 开始送货


**接口地址**:`/job/{id}/start-delivery`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| id       |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RBoolean     |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明  | 类型    | schema |
| -------- | --------- | ------- | ------ |
| code     | 200：成功 | string  |        |
| msg      |           | string  |        |
| data     |           | boolean |        |
| success  |           | boolean |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": true,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 卸货完成


**接口地址**:`/job/{id}/unloaded`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| id       |          | path     | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RBoolean     |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明  | 类型    | schema |
| -------- | --------- | ------- | ------ |
| code     | 200：成功 | string  |        |
| msg      |           | string  |        |
| data     |           | boolean |        |
| success  |           | boolean |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": true,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 执行中前后任务列表


**接口地址**:`/job/before-after-list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| -------- | -------- | -------- | -------- | -------- | ------ |
| vin      |          | query    | true     | string   |        |


**响应状态**:


| 状态码 | 说明                  | schema            |
| ------ | --------------------- | ----------------- |
| 200    | OK                    | RListWorkJobTagVO |
| 500    | Internal Server Error | ReturnVOVoid      |


**响应状态码-200**:


**响应参数**:


| 参数名称                  | 参数说明                                                                                           | 类型           | schema       |
| ------------------------- | -------------------------------------------------------------------------------------------------- | -------------- | ------------ |
| code                      | 200：成功                                                                                          | string         |              |
| msg                       |                                                                                                    | string         |              |
| data                      |                                                                                                    | array          | WorkJobTagVO |
| &emsp;&emsp;id            | 任务ID                                                                                             | string         |              |
| &emsp;&emsp;orderNo       | 订单号                                                                                             | string         |              |
| &emsp;&emsp;jobId         | 任务ID（任务ID）                                                                                   | string         |              |
| &emsp;&emsp;jobNo         | 任务单号（任务ID）                                                                                 | string         |              |
| &emsp;&emsp;workNo        | 工单编号                                                                                           | string         |              |
| &emsp;&emsp;status        | 任务状态 1:执行中 2:已暂停 3:已分配（未分配）9:已完成 -1:已取消 -2:作业失败,可用值:0,3,1,9,-2,2,-1 | string         |              |
| &emsp;&emsp;vin           | VIN                                                                                                | string         |              |
| &emsp;&emsp;goodsNameList | 货物名称集合                                                                                       | array          | string       |
| &emsp;&emsp;endPointName  | 目的站点名称                                                                                       | string         |              |
| &emsp;&emsp;estMileage    | 预计行驶里程（米）                                                                                 | integer(int64) |              |
| &emsp;&emsp;estGoTime     | 预计行驶时长（分）                                                                                 | integer(int32) |              |
| &emsp;&emsp;actualGoTime  | 实际行驶时长（分）                                                                                 | integer(int32) |              |
| &emsp;&emsp;actualMileage | 实际行驶里程（米）                                                                                 | integer(int64) |              |
| success                   |                                                                                                    | boolean        |              |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": [
		{
			"id": "",
			"orderNo": "",
			"jobId": "",
			"jobNo": "",
			"workNo": "",
			"status": "",
			"vin": "",
			"goodsNameList": [],
			"endPointName": "",
			"estMileage": 0,
			"estGoTime": 0,
			"actualGoTime": 0,
			"actualMileage": 0
		}
	],
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 创建任务


**接口地址**:`/job/create`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "vin": "",
  "goodsList": [
    {
      "goodsCode": "",
      "goodsMame": "",
      "startPointId": "",
      "startPointName": "",
      "endPointId": "",
      "endPointName": ""
    }
  ]
}
```


**请求参数**:


| 参数名称                               | 参数说明  | 请求类型 | 是否必须 | 数据类型  | schema         |
| -------------------------------------- | --------- | -------- | -------- | --------- | -------------- |
| jobAddDTO                              | JobAddDTO | body     | true     | JobAddDTO | JobAddDTO      |
| &emsp;&emsp;vin                        | VIN码     |          | true     | string    |                |
| &emsp;&emsp;goodsList                  | 货物明细  |          | true     | array     | JobGoodsAddDTO |
| &emsp;&emsp;&emsp;&emsp;goodsCode      | 货物编码  |          | false    | string    |                |
| &emsp;&emsp;&emsp;&emsp;goodsMame      | 货物名称  |          | false    | string    |                |
| &emsp;&emsp;&emsp;&emsp;startPointId   | 起点ID    |          | false    | string    |                |
| &emsp;&emsp;&emsp;&emsp;startPointName | 起点名称  |          | false    | string    |                |
| &emsp;&emsp;&emsp;&emsp;endPointId     | 终点ID    |          | false    | string    |                |
| &emsp;&emsp;&emsp;&emsp;endPointName   | 终点名称  |          | false    | string    |                |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RBoolean     |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明  | 类型    | schema |
| -------- | --------- | ------- | ------ |
| code     | 200：成功 | string  |        |
| msg      |           | string  |        |
| data     |           | boolean |        |
| success  |           | boolean |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": true,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


## 任务列表


**接口地址**:`/job/list`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "condition": {
    "jobNo": "",
    "workNo": "",
    "vin": "",
    "goods": "",
    "startPointId": "",
    "endPointId": ""
  },
  "pageSize": 0,
  "pageIndex": 0
}
```


**请求参数**:


| 参数名称                             | 参数说明                   | 请求类型 | 是否必须 | 数据类型                   | schema                     |
| ------------------------------------ | -------------------------- | -------- | -------- | -------------------------- | -------------------------- |
| pageQueryConditionJobQuery           | PageQueryConditionJobQuery | body     | true     | PageQueryConditionJobQuery | PageQueryConditionJobQuery |
| &emsp;&emsp;condition                |                            |          | false    | JobQuery                   | JobQuery                   |
| &emsp;&emsp;&emsp;&emsp;jobNo        | 任务ID                     |          | false    | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;workNo       | 工单编号                   |          | false    | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;vin          | VIN                        |          | false    | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;goods        | 货物                       |          | false    | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;startPointId | 起点ID                     |          | false    | string                     |                            |
| &emsp;&emsp;&emsp;&emsp;endPointId   | 终点ID                     |          | false    | string                     |                            |
| &emsp;&emsp;pageSize                 | 分页大小                   |          | false    | integer(int32)             |                            |
| &emsp;&emsp;pageIndex                | 页数                       |          | false    | integer(int32)             |                            |


**响应状态**:


| 状态码 | 说明                  | schema                |
| ------ | --------------------- | --------------------- |
| 200    | OK                    | RPageDTOWorkJobInfoVO |
| 500    | Internal Server Error | ReturnVOVoid          |


**响应状态码-200**:


**响应参数**:


| 参数名称                           | 参数说明                                                                                           | 类型                 | schema               |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------- | -------------------- |
| code                               | 200：成功                                                                                          | string               |                      |
| msg                                |                                                                                                    | string               |                      |
| data                               |                                                                                                    | PageDTOWorkJobInfoVO | PageDTOWorkJobInfoVO |
| &emsp;&emsp;records                |                                                                                                    | array                | WorkJobInfoVO        |
| &emsp;&emsp;&emsp;&emsp;id         | 任务ID                                                                                             | string               |                      |
| &emsp;&emsp;&emsp;&emsp;orderNo    | 订单号                                                                                             | string               |                      |
| &emsp;&emsp;&emsp;&emsp;jobId      | 任务ID（任务ID）                                                                                   | string               |                      |
| &emsp;&emsp;&emsp;&emsp;jobNo      | 任务单号（任务ID）                                                                                 | string               |                      |
| &emsp;&emsp;&emsp;&emsp;workNo     | 工单编号                                                                                           | string               |                      |
| &emsp;&emsp;&emsp;&emsp;status     | 任务状态 1:执行中 2:已暂停 3:已分配（未分配）9:已完成 -1:已取消 -2:作业失败,可用值:0,3,1,9,-2,2,-1 | string               |                      |
| &emsp;&emsp;&emsp;&emsp;vin        | VIN                                                                                                | string               |                      |
| &emsp;&emsp;&emsp;&emsp;startTime  | 任务开始时间                                                                                       | string(date-time)    |                      |
| &emsp;&emsp;&emsp;&emsp;endTime    | 任务结束时间                                                                                       | string(date-time)    |                      |
| &emsp;&emsp;&emsp;&emsp;operations | 可操作按钮 START_DELIVERY:开始送货 UNLOADED:卸货完成 CANCEL:取消 PAUSE:暂停 CONTINUE:继续          | array                | string               |
| &emsp;&emsp;total                  |                                                                                                    | integer(int64)       |                      |
| &emsp;&emsp;size                   |                                                                                                    | integer(int64)       |                      |
| &emsp;&emsp;current                |                                                                                                    | integer(int64)       |                      |
| &emsp;&emsp;orders                 |                                                                                                    | array                | OrderItem            |
| &emsp;&emsp;&emsp;&emsp;column     |                                                                                                    | string               |                      |
| &emsp;&emsp;&emsp;&emsp;asc        |                                                                                                    | boolean              |                      |
| &emsp;&emsp;optimizeCountSql       |                                                                                                    | boolean              |                      |
| &emsp;&emsp;searchCount            |                                                                                                    | boolean              |                      |
| &emsp;&emsp;optimizeJoinOfCountSql |                                                                                                    | boolean              |                      |
| &emsp;&emsp;countId                |                                                                                                    | string               |                      |
| &emsp;&emsp;maxLimit               |                                                                                                    | integer(int64)       |                      |
| &emsp;&emsp;pages                  |                                                                                                    | integer(int64)       |                      |
| success                            |                                                                                                    | boolean              |                      |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {
		"records": [
			{
				"id": "",
				"orderNo": "",
				"jobId": "",
				"jobNo": "",
				"workNo": "",
				"status": "",
				"vin": "",
				"startTime": "",
				"endTime": "",
				"operations": []
			}
		],
		"total": 0,
		"size": 0,
		"current": 0,
		"orders": [
			{
				"column": "",
				"asc": true
			}
		],
		"optimizeCountSql": true,
		"searchCount": true,
		"optimizeJoinOfCountSql": true,
		"countId": "",
		"maxLimit": 0,
		"pages": 0
	},
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


# 外部接口


## 工单信息变更回调


**接口地址**:`/outter/callback`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "workNo": "",
  "orderId": "",
  "orderNo": "",
  "jobId": "",
  "jobNo": "",
  "jobStatus": "",
  "vin": "",
  "details": [
    {
      "taskId": "",
      "startPointId": "",
      "startPointName": "",
      "endPointId": "",
      "endPointName": "",
      "detailIds": [],
      "goStartTime": "",
      "goEndTime": "",
      "doStartTime": "",
      "doEndTime": "",
      "status": "",
      "actionCode": "",
      "planTrack": [
        {
          "lat": 0,
          "lon": 0
        }
      ]
    }
  ]
}
```


**请求参数**:


| 参数名称                                | 参数说明                                               | 请求类型 | 是否必须 | 数据类型          | schema           |
| --------------------------------------- | ------------------------------------------------------ | -------- | -------- | ----------------- | ---------------- |
| orderCallbackDTO                        | OrderCallbackDTO                                       | body     | true     | OrderCallbackDTO  | OrderCallbackDTO |
| &emsp;&emsp;workNo                      |                                                        |          | false    | string            |                  |
| &emsp;&emsp;orderId                     | 订单ID                                                 |          | false    | string            |                  |
| &emsp;&emsp;orderNo                     | 订单号                                                 |          | false    | string            |                  |
| &emsp;&emsp;jobId                       | 任务ID                                                 |          | false    | string            |                  |
| &emsp;&emsp;jobNo                       | 任务号                                                 |          | false    | string            |                  |
| &emsp;&emsp;jobStatus                   | 任务状态,可用值:0,3,1,9,-2,2,-1                        |          | false    | string            |                  |
| &emsp;&emsp;vin                         | VIN                                                    |          | false    | string            |                  |
| &emsp;&emsp;details                     | 明细                                                   |          | false    | array             | Detail           |
| &emsp;&emsp;&emsp;&emsp;taskId          | 关联标识（步骤ID），不同场景：明细集合存在相同的ID     |          | false    | string            |                  |
| &emsp;&emsp;&emsp;&emsp;startPointId    | 起点                                                   |          | false    | string            |                  |
| &emsp;&emsp;&emsp;&emsp;startPointName  | 起点名称                                               |          | false    | string            |                  |
| &emsp;&emsp;&emsp;&emsp;endPointId      | 终点                                                   |          | false    | string            |                  |
| &emsp;&emsp;&emsp;&emsp;endPointName    | 终点名称                                               |          | false    | string            |                  |
| &emsp;&emsp;&emsp;&emsp;detailIds       | 明细唯一标识                                           |          | false    | array             | string           |
| &emsp;&emsp;&emsp;&emsp;goStartTime     | 任务去哪开始时间                                       |          | false    | string(date-time) |                  |
| &emsp;&emsp;&emsp;&emsp;goEndTime       | 任务去哪结束时间                                       |          | false    | string(date-time) |                  |
| &emsp;&emsp;&emsp;&emsp;doStartTime     | 任务做什么开始时间                                     |          | false    | string(date-time) |                  |
| &emsp;&emsp;&emsp;&emsp;doEndTime       | 任务做什么结束时间                                     |          | false    | string(date-time) |                  |
| &emsp;&emsp;&emsp;&emsp;status          | 步骤状态,可用值:0,3,1,2,5,9,-1,-2                      |          | false    | string            |                  |
| &emsp;&emsp;&emsp;&emsp;actionCode      | 动作标识,可用值:loadCargo,unloadCargo,parking,recharge |          | false    | string            |                  |
| &emsp;&emsp;&emsp;&emsp;planTrack       | 路径规划                                               |          | false    | array             | PositionDTO      |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lat | 纬度                                                   |          | false    | number(double)    |                  |
| &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;lon | 纬度                                                   |          | false    | number(double)    |                  |


**响应状态**:


| 状态码 | 说明                  | schema       |
| ------ | --------------------- | ------------ |
| 200    | OK                    | RString      |
| 500    | Internal Server Error | ReturnVOVoid |


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明  | 类型    | schema |
| -------- | --------- | ------- | ------ |
| code     | 200：成功 | string  |        |
| msg      |           | string  |        |
| data     |           | string  |        |
| success  |           | boolean |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": "",
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型   | schema |
| -------- | -------- | ------ | ------ |
| code     |          | string |        |
| msg      |          | string |        |
| data     |          | object |        |


**响应示例**:
```javascript
{
	"code": "",
	"msg": "",
	"data": {}
}
```


# 附录


## 自定义文档


### WebSocket API
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

| 参数名称  | 参数说明                       | 请求类型 | 是否必须 | 数据类型 | schema |
| --------- | ------------------------------ | -------- | -------- | -------- | ------ |
| uuid      | 唯一消息会话ID                 | path     | true     | string   |        |
| Request   |                                | body     | true     | object   |
| type      | SUB, UNSUB, PING, PONG, RESULT |          | true     | string   |
| projectId | 项目ID                         |          | true     | string   |

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

| 参数名称     | 参数说明                                                                              | 类型   | schema |
| ------------ | ------------------------------------------------------------------------------------- | ------ | ------ |
| type         | RESULT                                                                                | string |        |
| businessType | 业务类型<br/> JOB_CHANGE: 任务变更<br/> VEH_REAL:小车实时位置<br/> VEH_ALARM:告警信息 | string |        |
| payload      | 具体信息                                                                              | object |        |

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
    # 速度 单位：m/s
    "velocity": 50,
    # 速度 单位：km/h
    "speed": 180,
    # 航向角 单位：度
    "heading": 358.6605,
    "pathPogress": 100,
    # 档位
    "tapPos": 1,
    # 正在执行任务的剩余里程 单位：米
    "remMileage": 0,
    # 正在执行任务的剩余时长 单位：分
    "remGoTime": 0
    # 车辆驾驶模式
    "driveMode": 1,
    # 预计续航里程（km）
    "endurance": 100
    # 电量 %
    "soc": 75
    # 紧急制动 0 取消紧急制动  1紧急制动
    "scramFlag": 0
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

# 故障报警
{
    "type": "RESULT",
    "businessType": "VEH_FAULT",
    "payload": [
        {
            "isDeleted": 0,
            "tenantId": "1796366158757437441",
            "faultBit": 0,
            "faultType": "线控",
            "faultName": "电池故障",
            "faultDesc": "总压过高",
            "faultCode": "GZ1874989607615127552",
            "status": 0,
            "deviceId": "mumu8261",
            "startTime": "2025-01-03 09:22:12",
            "location": {
                "lon": 119.28088384711778,
                "lat": 36.694080110099975,
                "pointFeature": "119.28088384711778_36.694080110099975"
            },
            "projectId": "1865994966275584002",
            "vehInstanceId": "vehicle1827975241448202240",
            "vin": "LTFKEVS7XX08261",
            "ext": "{\"timestamp\":1735867332621,\"vehicleId\":\"mumu8261\",\"position\":{\"lon\":119.28088384711778,\"lat\":36.694080110099975,\"pointFeature\":\"119.28088384711778_36.694080110099975\"},\"velocity\":50,\"heading\":270.9506,\"pathId\":4,\"pathProgress\":100,\"actionCode\":\"loadCargo\",\"actionValue\":0,\"driveMode\":4,\"tapPos\":31,\"scramFlag\":0,\"vehFault\":3}"
        },
        {
            "isDeleted": 0,
            "tenantId": "1796366158757437441",
            "faultBit": 1,
            "faultType": "线控",
            "faultName": "电池故障",
            "faultDesc": "单体过放",
            "faultCode": "GZ1874989607627710464",
            "status": 0,
            "deviceId": "mumu8261",
            "startTime": "2025-01-03 09:22:12",
            "location": {
                "lon": 119.28088384711778,
                "lat": 36.694080110099975,
                "pointFeature": "119.28088384711778_36.694080110099975"
            },
            "projectId": "1865994966275584002",
            "vehInstanceId": "vehicle1827975241448202240",
            "vin": "LTFKEVS7XX08261",
            "ext": "{\"timestamp\":1735867332621,\"vehicleId\":\"mumu8261\",\"position\":{\"lon\":119.28088384711778,\"lat\":36.694080110099975,\"pointFeature\":\"119.28088384711778_36.694080110099975\"},\"velocity\":50,\"heading\":270.9506,\"pathId\":4,\"pathProgress\":100,\"actionCode\":\"loadCargo\",\"actionValue\":0,\"driveMode\":4,\"tapPos\":31,\"scramFlag\":0,\"vehFault\":3}"
        }
    ]
}
```