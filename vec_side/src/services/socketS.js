// socketService.js
import { useState, useEffect } from 'react';
import { getConfig } from '../utils/Api';
import { pubSub } from '../utils/pubsub';
import { makeuuid } from '../utils';




let ws = null;


export function closeWs () {
  if (ws) {
    ws.close(1000, '正常关闭连接');
  }
}


export const connectWebSocket = (projectId, onMessageCallback) => {
  ws = new WebSocket(getConfig().socketUrl + makeuuid());


  console.log('getConfig().socketUrl', getConfig().socketUrl + makeuuid())

  let pingInterval

  ws.onopen = () => {
    console.log("WebSocket connected", projectId);
    // pubSub.publish('showAlert', 'WebSocket connected');
    if (ws?.readyState === WebSocket.OPEN) {
      ws?.send(JSON.stringify({ type: "SUB", projectId }));

    }

    // Ping interval
    pingInterval = setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws?.send(JSON.stringify({ type: "PING" }));
      }
      // 一直订阅
      // ws.send(JSON.stringify({ type: "SUB", projectId }));

    }, 5000);

  };


  ws.onclose = () => {
    pingInterval && clearInterval(pingInterval);
    console.log("WebSocket closed!");
    handleReconnect(onMessageCallback);
  };

  ws.onerror = (error) => {
    // ws = null
    // console.error("WebSocket error:", error);
    // handleReconnect(onMessageCallback);

  };

  ws.onmessage = (event) => {
    try {

      if (event?.data) {
        const message = JSON.parse(event.data);
        onMessageCallback(message);
        // console.log("解析后的数据：", event?.data);
      }

    } catch (error) {
      console.error("处理消息时发生错误：", error)
    }


  };
};

let reconnectAttempts = 0;
let reconnecting = false;

export const handleReconnect = (onMessageCallback) => {

  const projectId = window?.dvaStore?.getState()?.configModal?.projectId || '1865994966275584002'
  console.log('projectId', projectId)

  console.log('reconnecting', reconnecting)

  console.log('reconnectAttempts', reconnectAttempts)

  if (reconnecting) {
    return;
  }

  reconnecting = true
  reconnectAttempts = reconnectAttempts + 1
  console.log(`Attempting to reconnect... (Attempt ${reconnectAttempts + 1})`);



  // Delay for reconnect
  setTimeout(() => {
    reconnecting = false
    connectWebSocket(projectId, onMessageCallback);
  }, 1000);
};


