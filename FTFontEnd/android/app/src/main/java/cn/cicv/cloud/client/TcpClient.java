package cn.cicv.cloud.client;

import cn.cicv.cloud.codec.MessageCodec;
import cn.cicv.cloud.command.JobCommand;
import cn.cicv.cloud.message.V2CMessage;

import java.io.*;
import java.net.*;
import java.nio.ByteBuffer;
import java.util.logging.Logger;

import static cn.cicv.cloud.codec.MessageCodec.HEADER_LEN;

import android.os.Message;
import android.util.Log;

import com.ftfontend.AppHandler;
import com.ftfontend.MainActivity;
import com.google.gson.Gson;

public class TcpClient {

    private static final Logger log = Logger.getLogger(TcpClient.class.getName());
    private final Socket socket;
    private final InputStream inputStream;
    private final OutputStream outputStream;
    private volatile boolean isRunning = true; // 标识是否运行中

    private static Gson gson= new Gson();

    public TcpClient(String host, int port) throws IOException {
        try {
            socket = new Socket(host, port);
            inputStream = socket.getInputStream();
            outputStream = socket.getOutputStream();
            startListening();
            log.info("create socket success");
        } catch (Exception e) {
            log.info("create socket client error: " + e.getMessage());
            close();
            throw e;
        }
    }

    private void startListening() {
        Thread listenerThread = new Thread(() -> {
            try {
                while (isRunning) {
                    // 读取报文头，获取报文体长度
                    byte[] headerBuffer = new byte[HEADER_LEN];
                    if (readFully(headerBuffer) == -1) {
                        break;
                    }
                    ByteBuffer byteBuffer = ByteBuffer.wrap(headerBuffer);
                    byteBuffer.position(1);
                    int bodyLength = byteBuffer.getInt();

                    // 读取报文体数据
                    byte[] bodyBuffer = new byte[bodyLength];
                    if (readFully(bodyBuffer) == -1) {
                        break;
                    }

                    byte[] mergedArray = new byte[HEADER_LEN + bodyLength];
                    System.arraycopy(headerBuffer, 0, mergedArray, 0, HEADER_LEN);
                    System.arraycopy(bodyBuffer, 0, mergedArray, HEADER_LEN, bodyLength);

                    // 解码报文体
                    V2CMessage message = MessageCodec.decode(mergedArray);

                    Message mes = Message.obtain();
                    mes.what = AppHandler.MESSAGE_UPDATE_OBJECT; // 消息类型
                    mes.obj = message; // 设置自定义对象

                    if (MainActivity.appHandler != null) {
                        MainActivity.appHandler.sendMessage(mes);
                    }
                    // todo 加上序列化
                    log.info("receive vehicle [" + message.getVehicleId() + "], type [" + String.format("%02X", message.getType()) + "] message: " + message);
                    log.info("receive vehicle [" + message.getVehicleId() + "], type [" + String.format("%02X", message.getType()) + "] message: " + gson.toJson(message));
                }
            } catch (Exception e) {
                if (isRunning) {
                    log.severe("error while listening: " + e.getMessage());
                }
            } finally {
                close();
                log.info("listener thread stopped");
            }
        });
        listenerThread.setDaemon(true); // 设置为守护线程
        listenerThread.start();
    }

    private int readFully(byte[] buffer) throws IOException {
        int totalBytesRead = 0;
        int bytesRead;
        while (totalBytesRead < buffer.length) {
            bytesRead = inputStream.read(buffer, totalBytesRead, buffer.length - totalBytesRead);
            if (bytesRead == -1) {// 连接已关闭
                return -1;
            }
            totalBytesRead += bytesRead;
        }
        return totalBytesRead;
    }

    public boolean sendJobCommand(JobCommand<?> jobCommand) {
        try {
            byte[] encoded = MessageCodec.encode(jobCommand);
            outputStream.write(encoded);
        } catch (Exception e) {
            log.severe("error while sending job command: " + e.getMessage());
            return false;
        }
        log.info("send job command: " + jobCommand);
        return true;
    }

    public synchronized void close() {
        if (!isRunning) {
            return; // 防止重复关闭
        }
        isRunning = false;
        try {
            if (outputStream != null) {
                outputStream.close();
            }
            if (inputStream != null) {
                inputStream.close();
            }
            if (socket != null) {
                socket.close();
            }
        } catch (IOException e) {
            log.severe("release socket resources error : " + e.getMessage());
        }
    }

    public Socket getSocket() {
        return socket;
    }
}
