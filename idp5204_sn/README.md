# IDP5204 SN 读取

在海康机器人（HIKROBOT）IDP5204 PDA（Android 11）上读取**设备自身序列号 SN**的最小工程。

当前方案：官方 API `Build.getSerial()`（见 `SnReader.kt`），启动时申请 `READ_PHONE_STATE` 权限。

## ⚠️ 已知限制

Android 10（API 29）起，非系统签名 / 非设备属主的普通 App 调 `Build.getSerial()` **多半返回 `unknown`**。
若装到 IDP5204 上拿不到有效值，说明本机没给到权限，需要其一：

- App 拿到**系统签名**（platform 签名），或被设为设备属主；
- 改走**系统属性**方案（反射 `SystemProperties.get("ro.serialno")` 之类，属性名向海康确认）。

界面会显示实际返回值和来源说明，据此判断走哪条路。

## 用法

1. Android Studio 打开本目录，或命令行 `./gradlew installDebug`。
2. 装到 IDP5204 上运行，看顶部 SN 及「来源/说明」。有效值可一键复制。

## 环境

- Gradle 8.10.2 / AGP 8.6.0 / Kotlin 1.9.24
- compileSdk 34，targetSdk 30（对应 Android 11），minSdk 24
