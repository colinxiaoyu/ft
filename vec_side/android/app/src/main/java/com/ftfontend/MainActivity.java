package com.ftfontend;

import static com.ftfontend.tcpNativeModule.TcpNativePackage.tcpNativeModule;

import android.os.Bundle;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.google.gson.Gson;

import cn.cicv.cloud.message.V2CMessage;

public class MainActivity extends ReactActivity implements AppHandler.HandlerCallback {

    public static AppHandler appHandler;
    Gson gson;
    MainApplication app;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set full-screen mode, hiding the status bar
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        // Set full-screen mode to hide status bar and navigation bar
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN | // Hide status bar
                        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | // Hide navigation bar
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY // Immersive mode
        );

        appHandler = new AppHandler(Looper.getMainLooper(), this);
        gson = new Gson();
    }

    @Override
    public void onMessageReceived(Message msg) {
        if (msg.what == AppHandler.MESSAGE_UPDATE_OBJECT) {
            // 从消息中提取对象
            V2CMessage myMessage = (V2CMessage) msg.obj;

            String json = gson.toJson(myMessage);

            tcpNativeModule.sendEventToReactNative("V2CMessage",json );
        }
    }

    /**
     * Return the name of the main component registered from JavaScript.
     * React Native uses this name to render the component.
     */
    @Override
    protected String getMainComponentName() {
        return "FTFontEnd"; // Make sure this matches the name in your JavaScript entry point
    }

    /**
     * Return an instance of ReactActivityDelegate.
     * The DefaultReactActivityDelegate allows you to enable or disable the new architecture.
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        // Set up the delegate based on the New Architecture flag
        return new DefaultReactActivityDelegate(
                this,
                getMainComponentName(),
                BuildConfig.IS_NEW_ARCHITECTURE_ENABLED // Use the build config flag to enable the New Architecture
        );
    }

    // Handle window focus changes to ensure full-screen mode
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            // Ensure the status bar and navigation bar are hidden when the activity has focus
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_FULLSCREEN |
                            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            );
        }
    }
}
