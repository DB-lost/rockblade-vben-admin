/**
 * WebSocket 消息类型定义
 *
 * 与后端 NotifyMessage 对齐：
 * - type: NOTIFICATION | SYSTEM | REMINDER
 * - title: 标题
 * - content: 内容 (映射为 message)
 * - data: 业务数据 (可选)
 * - timestamp: 时间戳
 */

/** 后端发送的原始消息格式 */
export interface BackendMessage {
  /** 消息类型: NOTIFICATION | SYSTEM | REMINDER  */
  type: 'NOTIFICATION' | 'REMINDER' | 'SYSTEM';
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 业务数据，可包含 avatar、link、candidateId 等 */
  data?: Record<string, unknown>;
  /** 时间戳 (ISO 格式) */
  timestamp: string;
}

/** 消息类型联合类型 */
export type NotificationType = BackendMessage['type'];

/** WebSocket 连接状态 */
export type WebSocketStatus =
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'error';

/** useWebSocket 配置选项 */
export interface UseWebSocketOptions {
  /** WebSocket 服务器地址 */
  url: (() => string) | string;
  /** 是否自动重连，默认 true */
  reconnect?: boolean;
  /** 重连间隔(ms)，默认 3000 */
  reconnectInterval?: number;
  /** 最大重连次数，默认 5 */
  maxReconnectAttempts?: number;
  /** 心跳间隔(ms)，默认 30000 */
  heartbeatInterval?: number;
  /** 心跳超时时间(ms)，默认 10000 */
  heartbeatTimeout?: number;
}

/** useWebSocket 返回值 */
export interface UseWebSocketReturn {
  /** 当前连接状态 */
  status: import('vue').Ref<WebSocketStatus>;
  /** 手动建立连接 */
  connect: () => void;
  /** 断开连接 */
  disconnect: () => void;
  /** 发送消息 */
  send: (data: unknown) => void;
  /** 订阅消息 */
  onMessage: (handler: (msg: BackendMessage) => void) => void;
  /** 订阅连接打开 */
  onOpen: (handler: () => void) => void;
  /** 订阅连接关闭 */
  onClose: (handler: () => void) => void;
  /** 订阅错误 */
  onError: (handler: (error: Event) => void) => void;
}
