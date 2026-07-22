# RN 实际使用的 SDK 字段清单（双向）

> 仅列 **RN 壳真正用到** 的字段，双向。完整协议/全部字段见 `CICV-CLOUD-SDK.md`。
> 通道：TCP 私有协议（`cn.cicv.cloud`）。回充/回库/路径规划走 HTTP，不在此表。

---

## 一、上行：车机 → RN（StateMessage `0x15`，RN 读取的字段）

RN 收到整条 StateMessage 存入 `VinMessage`，但界面**实际读取**的只有下列字段。车机必须提供且填有效值：

| 字段 | 协议类型 | 段 | 单位 / 枚举 | 含义 / RN 用途 |
|---|---|---|---|---|
| `vehicleId` | str(17) | 头 | 17 位 VIN | 识别当前车辆，写入 `currentVin`，下发指令回填 |
| `velocity` | u16 | 0x01 | 原始 0.01 m/s（SDK 转 **km/h**） | 仪表车速 |
| `position.longitude` | u32 | 0x01 | 1e-7 度，**WGS84**（SDK 转 GCJ02） | 地图经度 |
| `position.latitude` | u32 | 0x01 | 1e-7 度，**WGS84**（SDK 转 GCJ02） | 地图纬度 |
| `heading` | u32 | 0x01 | 1e-4 度 | 车头朝向 |
| `tapPos` | u8 | 0x01 | 31=D / 32=R / 33=P | 档位显示 |
| `driveMode` | u8 | 0x01 | 1=人工 / 4=自动 | 模式显示 + 按钮态 |
| `soc` | u16 | 0x02 | 0.01% | 电量显示（需 version≥2） |
| `scramFlag` | u8 | 0x03 | 0=取消 / 1=急停 | 紧急制动指示灯（需 version=3） |
| `remoteScramFlag` | u8 | 0x03 | 0=取消 / 1=急停 | 远程急停状态（需 version=3） |
| `vehFault` | u32 | 0x02 | 位掩码 | 故障指示灯 |

**隐含依赖**（RN 不直接显示，但解析/流程需要）：
| 字段 | 说明 |
|---|---|
| `type` | 必须 `0x15`，否则 RN 不处理 |
| `version` | 必须 `3`，否则 0x02/0x03 段字段收不到（soc/scramFlag 等） |
| `identifier` / `bodyLen` | 帧头，解码用 |

> ⚠️ 节流：RN 只在 `[tapPos, scramFlag, remoteScramFlag, driveMode, soc, velocity, position, vehicleId]` 之一变化时才刷新 UI。`heading`、`vehFault` 不在其中，单独变化不会触发刷新。

---

## 二、下行：RN → 车机（动作指令，RN 发出的字段）

RN 侧只调用：`TcpNativeModule.sendCommand(vehicleId, command)`，`command` 为 4 个固定字符串。
桥接层据此拼装 `JobCommand` + `ActionJobCommand` 下发，车机需能解析并执行：

### RN 发出的枚举

| RN command | jobType | action | value | 含义 |
|---|---|---|---|---|
| `sendScramCommand` | 5 | `scram` | 0 | 紧急制动 |
| `sendUnScramCommand` | 7 | `unscram` | 0 | 取消急停 |
| `sendChangeDriveMode0Command` | 7 | `change_drivemode` | 0 | 切自动驾驶 |
| `sendChangeDriveMode1Command` | 7 | `change_drivemode` | 1 | 切人工驾驶 |

### 下行报文实际字段（车机需解析）

**JobCommand（作业头）**
| 字段 | 类型 | 说明 |
|---|---|---|
| `vehicleId` | str(17) | 目标车辆 VIN（与上行一致） |
| `seq` | i64 | 指令序号（当前硬编码 `122222`） |
| `jobType` | u8 | 5 或 7 |
| `dataLen` | u16 | adviceData 长度 |

**ActionJobCommand（指令体）**
| 字段 | 类型 | 说明 |
|---|---|---|
| `timestamp` | i64 | 下发时间（ms） |
| `actionLen` | u8 | = `action` 字节长度 |
| `action` | str | `scram` / `unscram` / `change_drivemode` |
| `value` | u16 | 动作参数（change_drivemode：0=自动 / 1=人工） |

> **回执（可选）**：车机可回 `0x1B` JobCommandReply（`vehicleId/seq/jobType/dataLen/doFlag`）；RN 当前不强制消费。

---

## 三、对 SDK 的要求（RN 依赖的接口与行为契约）

RN 通过原生桥接 `TcpNativeModule` 使用 SDK，SDK（`cn.cicv.cloud` + 桥接层）必须满足下列契约。

### 3.1 必须暴露的接口（RN 调用 / 订阅）
| 接口 | 方向 | 要求 |
|---|---|---|
| `TcpNativeModule.connectToServer(host, port)` | RN→SDK | 建立 TCP 长连接；参数来自 `getConfig().vcTcp/vcTcpPort` |
| `TcpNativeModule.sendCommand(vehicleId, command)` | RN→SDK | 接收 4 个 command 字符串并下发对应动作指令 |
| `DeviceEventEmitter` 事件 `'V2CMessage'` | SDK→RN | 每条上行报文 emit 一次，载荷为 **StateMessage 的 JSON 字符串** |

### 3.2 连接行为
- 明文 TCP 连接；连接放在**子线程**，不阻塞 JS/UI 线程。
- **自动重连**：断线后周期（当前 5s）重连，且容忍多次建连。
- App 销毁时关闭连接（`onHostDestroy`）。

### 3.3 编码要求（下行，SDK 必须正确生成）
- 按私有协议编码 `JobCommand`+`ActionJobCommand`，**大端**。
- 报文头固定：`identifier=0xF2, type=0x1A, version=0x01`。
- 4 个 command 映射到正确的 `jobType/action/value`（见第二节）。
- 编码前校验并保证：`vehicleId` 长度 **17**、`actionLen == action 字节长度`、必填字段非空。

### 3.4 解码要求（上行，SDK 必须正确解析并换算）
| 要求 | 说明 |
|---|---|
| 按 `type` 分派 | `0x15`→StateMessage，`0x1B`→JobCommandReply，其余忽略 |
| 按 `version` 分段解析 | 1=仅0x01；2=0x01+0x02；3=全三段，**顺序读取不得错位** |
| 单位换算 | `velocity/velocityGNSS`→km/h；`heading`→÷1e4 度；`position`→1e-7 度 |
| **坐标转换** | 经纬度 **WGS84→GCJ02**（SDK 负责，车机不要预转） |
| 缺省值 | 正确保留 255/65535/4294967295 等无效标识 |
| 序列化 | 用 gson 把整个 StateMessage 转 JSON，**字段名与 Java 字段一致** |

### 3.5 线程与投递
- TCP 监听在**守护线程**；解码后经**主线程 Handler**（`AppHandler`）投递。
- 仅当 RN 环境就绪（`hasActiveCatalystInstance()`）时才 emit，避免丢事件/崩溃。

### 3.6 换车机时 SDK 是否要改
- 车机若**沿用同一私有协议**（帧结构/字段/枚举不变）→ **SDK 无需改动**，仅改壳侧连接地址 `vcTcp/vcTcpPort`。
- 车机若**协议有变**（字段增减、顺序变化、单位/坐标系不同）→ 需同步改 SDK 的 `MessageCodec`（编解码）与相关 message/command 类。

---

## 四、一句话总结
- **RN 读**（上行）：`vehicleId, velocity, position(lon/lat), heading, tapPos, driveMode, soc, scramFlag, remoteScramFlag, vehFault`（需 `type=0x15, version=3`）。
- **RN 发**（下行）：`scram / unscram / change_drivemode(0|1)` 四条动作指令。
- **对 SDK**：暴露 `connectToServer/sendCommand` + `'V2CMessage'` 事件；负责 TCP 连接与重连、私有协议编解码、单位换算与 WGS84→GCJ02、gson 序列化。协议不变则换车机无需改 SDK。
