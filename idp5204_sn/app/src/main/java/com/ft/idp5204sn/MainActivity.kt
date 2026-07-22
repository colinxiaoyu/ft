package com.ft.idp5204sn

import android.Manifest
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.ft.idp5204sn.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private var sn: String? = null

    private val requestPhonePerm =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) {
            refresh() // 无论授予与否都刷新，read() 会各自处理
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnRefresh.setOnClickListener { ensurePermThenRefresh() }
        binding.btnCopy.setOnClickListener { copySn() }

        ensurePermThenRefresh()
    }

    private fun ensurePermThenRefresh() {
        val granted = ContextCompat.checkSelfPermission(
            this, Manifest.permission.READ_PHONE_STATE
        ) == PackageManager.PERMISSION_GRANTED
        if (granted) refresh()
        else requestPhonePerm.launch(Manifest.permission.READ_PHONE_STATE)
    }

    private fun refresh() {
        val result = SnReader.read()
        sn = if (result.ok) result.sn else null

        binding.tvBest.text = buildString {
            append("机型: ${Build.MODEL}  厂商: ${Build.MANUFACTURER}\n")
            append("Android: ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})\n")
            append("─".repeat(32)).append('\n')
            if (result.ok) {
                append("✅ SN：\n${result.sn}\n")
            } else {
                append("⚠️ 未拿到有效 SN\n")
            }
            append("\n来源/说明：${result.note}")
        }
        binding.btnCopy.isEnabled = sn != null
    }

    private fun copySn() {
        val value = sn ?: return
        val cm = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        cm.setPrimaryClip(ClipData.newPlainText("SN", value))
        Toast.makeText(this, "已复制 SN：$value", Toast.LENGTH_SHORT).show()
    }
}
