package com.ftfontend.tcpNativeModule;

import static com.ftfontend.MainActivity.appHandler;

import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Objects;

import cn.cicv.cloud.client.TcpClient;
import cn.cicv.cloud.command.ActionJobCommand;
import cn.cicv.cloud.command.JobCommand;

public class TcpNativeModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

  private final ReactApplicationContext reactContext;
  private TcpClient client;

  private boolean isConnectionMonitorRunning = false;
  private String currentHost;
  private int currentPort;

  public TcpNativeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;

    reactContext.addLifecycleEventListener(this);
  }

  @NonNull
  @Override
  public String getName() {
    return "TcpNativeModule";
  }
  
  @ReactMethod
  public void connectToServer(String host, int port) {
    this.currentHost = host;
    this.currentPort = port;
    
    new Thread(()->{
      try {
        // 初始化 TcpClient
        client = new TcpClient(host, port);
        Log.d("TcpNativeModule", "Connected to server: " + host + ":" + port);
        
        // 启动连接监控线程
        startConnectionMonitor();
      } catch (Exception e) {
        client = null;
        if (appHandler != null) {
          appHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
              connectToServer(host, port);
            }
          }, 1000);
        }

        Log.e("TcpNativeModule", "Client init error: " + e.toString());
        Objects.requireNonNull(getCurrentActivity()).runOnUiThread(()->{
          Toast.makeText(reactContext, "Client init error: " + e.toString(), Toast.LENGTH_SHORT).show();
        });
      }
    }).start();
  }
  
  private void startConnectionMonitor() {
    if (isConnectionMonitorRunning) {
      return;
    }
    
    isConnectionMonitorRunning = true;
    new Thread(() -> {
      while (isConnectionMonitorRunning) {
        try {
          if (client == null || !client.getSocket().isConnected()) {
            Log.d("TcpNativeModule", "Connection lost, attempting to reconnect...");
            try {
              if (client != null) {
                client.close();
              }
              client = new TcpClient(currentHost, currentPort);
              Log.d("TcpNativeModule", "Reconnected to server: " + currentHost + ":" + currentPort);
            } catch (Exception e) {
              Log.e("TcpNativeModule", "Reconnection failed: " + e.toString());
            }
          }
          Thread.sleep(5000); // 每5秒检查一次连接状态
        } catch (InterruptedException e) {
          Log.e("TcpNativeModule", "Connection monitor interrupted: " + e.toString());
        }
      }
    }).start();
  }


  @ReactMethod
  public void sendCommand(String vehicleId, String command) {
    System.out.println("sendCommand vehicleId:"+vehicleId+",command:"+command);

    if (client == null) {
      System.out.println("TCP client is not connected. Please connect first.");
      return;
    }
   
    try {
      switch (command){
        case "sendScramCommand":
          sendScramCommand(client,vehicleId);
          break;
        case "sendUnScramCommand":
          sendUnScramCommand(client,vehicleId);
          break;
        case "sendChangeDriveMode0Command":
          sendChangeDriveMode0Command(client,vehicleId);
          break;
        case "sendChangeDriveMode1Command":
          sendChangeDriveMode1Command(client,vehicleId);
          break;
      }
      
      System.out.println("Command sent successfully.");
    } catch (Exception e) {
      System.out.println("Failed to send command: " + e.getMessage());

    }

  }

  private void closeTcpConnection() {
    if (client != null) {
      try {
        client.close();
      } finally {
        client = null;
      }
    }
  }

  public void sendEventToReactNative(String eventName, String message) {
    if (reactContext.hasActiveCatalystInstance()) { // Check if React Native is ready
      reactContext
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit(eventName, message);
    } else {
      System.out.println("React Native environment is not ready.");
    }
  }

  /**
   * 下发紧急急停指令
   */
  public  void sendScramCommand(TcpClient client,String vehicleId) {
    JobCommand<ActionJobCommand> jobCommand = new JobCommand<>();
    jobCommand.setVehicleId(vehicleId);
    jobCommand.setSeq(122222L);
    jobCommand.setJobType((short) 5);
    ActionJobCommand actionJobCommand = new ActionJobCommand();
    actionJobCommand.setTimestamp(System.currentTimeMillis());
    actionJobCommand.setActionLen((short) 5);
    actionJobCommand.setAction("scram");
    actionJobCommand.setValue(0);
    jobCommand.setAdviceData(actionJobCommand);
    client.sendJobCommand(jobCommand);
  }

  /**
   * 下发取消紧急急停指令
   */
  public  void sendUnScramCommand(TcpClient client,String vehicleId) {
    JobCommand<ActionJobCommand> jobCommand = new JobCommand<>();
    jobCommand.setVehicleId(vehicleId);
    jobCommand.setSeq(122222L);
    jobCommand.setJobType((short) 7);
    ActionJobCommand actionJobCommand = new ActionJobCommand();
    actionJobCommand.setTimestamp(System.currentTimeMillis());
    actionJobCommand.setActionLen((short) 7);
    actionJobCommand.setAction("unscram");
    actionJobCommand.setValue(0);
    jobCommand.setAdviceData(actionJobCommand);
    client.sendJobCommand(jobCommand);
  }

  /**
   * 下发人工驾驶切换到自动驾驶指令
   */
  public  void sendChangeDriveMode0Command(TcpClient client,String vehicleId) {
    Log.i("sendChangeDriveMode0Command",vehicleId);
    JobCommand<ActionJobCommand> jobCommand = new JobCommand<>();
    jobCommand.setVehicleId(vehicleId);
    jobCommand.setSeq(122222L);
    jobCommand.setJobType((short) 7);
    ActionJobCommand actionJobCommand = new ActionJobCommand();
    actionJobCommand.setTimestamp(System.currentTimeMillis());
    actionJobCommand.setActionLen((short) 16);
    actionJobCommand.setAction("change_drivemode");
    actionJobCommand.setValue(0);
    jobCommand.setAdviceData(actionJobCommand);
    client.sendJobCommand(jobCommand);
  }

  /**
   * 下发自动驾驶切换到人工驾驶指令
   */
  public  void sendChangeDriveMode1Command(TcpClient client,String vehicleId) {
    JobCommand<ActionJobCommand> jobCommand = new JobCommand<>();
    jobCommand.setVehicleId(vehicleId);
    jobCommand.setSeq(122222L);
    jobCommand.setJobType((short) 7);
    ActionJobCommand actionJobCommand = new ActionJobCommand();
    actionJobCommand.setTimestamp(System.currentTimeMillis());
    actionJobCommand.setActionLen((short) 16);
    actionJobCommand.setAction("change_drivemode");
    actionJobCommand.setValue(1);
    jobCommand.setAdviceData(actionJobCommand);
    client.sendJobCommand(jobCommand);
  }

  @Override
  public void onHostResume() {
  }

  @Override
  public void onHostPause() {
  }

  @Override
  public void onHostDestroy() {
    closeTcpConnection();
  }
}
//keytool -genkeypair -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-release-key

