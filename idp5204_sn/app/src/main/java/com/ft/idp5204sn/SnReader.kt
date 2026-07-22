package com.ft.idp5204sn

import android.os.Build

/**
 * 通过官方 API [Build.getSerial] 读取设备序列号 SN。
 *
 * 注意：Android 10（API 29）起，非系统签名 / 非设备属主的普通 App 调用本方法多半返回
 * [Build.UNKNOWN]（即 "unknown"）。若 IDP5204 上确实拿不到，需要系统签名或改走系统属性方案。
 *
 * 调用前需已授予 READ_PHONE_STATE 权限（部分设备需要）。
 */
object SnReader {

    /** SN 读取结果。[ok] = 是否拿到有效值。 */
    data class Result(val sn: String, val ok: Boolean, val note: String)

    fun read(): Result {
        return try {
            @Suppress("MissingPermission")
            val sn = Build.getSerial()
            val ok = sn.isNotBlank() && !sn.equals(Build.UNKNOWN, ignoreCase = true)
            val note = if (ok) "Build.getSerial()" else "Build.getSerial() 返回 unknown（可能需系统签名）"
            Result(sn, ok, note)
        } catch (se: SecurityException) {
            Result("", false, "无 READ_PHONE_STATE 权限：${se.message ?: ""}")
        } catch (t: Throwable) {
            Result("", false, "${t.javaClass.simpleName}: ${t.message ?: ""}")
        }
    }
}
