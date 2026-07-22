// pubsub.js
class PubSub {
  constructor() {
    if (PubSub.instance) {
      return PubSub.instance;  // 如果实例已存在，直接返回现有实例
    }

    this.events = {};  // 存储事件
    PubSub.instance = this;  // 保存实例到静态属性
  }

  // 订阅事件
  subscribe (event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // 发布事件
  publish (event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }

  // 取消订阅事件
  unsubscribe (event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
}

// 导出单例实例
export const pubSub = new PubSub();
