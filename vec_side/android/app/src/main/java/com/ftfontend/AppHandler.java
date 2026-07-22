package com.ftfontend;

import android.os.Handler;
import android.os.Looper;
import android.os.Message;

import java.lang.ref.WeakReference;

public class AppHandler extends Handler {

    public static final int MESSAGE_UPDATE_OBJECT = 1; // 自定义消息类型

    private WeakReference<HandlerCallback> callbackWeakReference;

    // 定义回调接口
    public interface HandlerCallback {
        void onMessageReceived(Message msg);
    }

    // 构造方法，接收一个实现了 HandlerCallback 的实例
    public AppHandler(Looper looper, HandlerCallback callback) {
        super(looper);
        this.callbackWeakReference = new WeakReference<>(callback);
    }

    @Override
    public void handleMessage(Message msg) {
        super.handleMessage(msg);

        // 使用弱引用避免内存泄漏
        HandlerCallback callback = callbackWeakReference.get();
        if (callback != null) {
            callback.onMessageReceived(msg); // 将消息回调给实现类
        }
    }
}
