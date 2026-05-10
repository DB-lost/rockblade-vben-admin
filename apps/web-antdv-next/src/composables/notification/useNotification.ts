import type { NotificationItem } from '@vben/layouts';

import type { BackendMessage } from './types';

import { computed, ref, watch } from 'vue';

import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { notification } from 'antdv-next';

import { useWebSocket } from './useWebSocket';

const STORAGE_KEY_PREFIX = 'notification_list_';

function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function generateId(msg: BackendMessage): string {
  if (msg.data?.id) return String(msg.data.id);
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  } catch {
    return timestamp;
  }
}

function toNotificationItem(msg: BackendMessage): NotificationItem {
  const avatar = msg.data?.avatar as string | undefined;
  const link = msg.data?.link as string | undefined;

  return {
    id: generateId(msg),
    avatar: avatar || preferences.app.defaultAvatar,
    date: formatDate(msg.timestamp),
    isRead: false,
    link,
    message: msg.content,
    query: msg.data?.query as Record<string, any>,
    state: msg.data?.state as Record<string, any>,
    title: msg.title,
  };
}

function loadFromStorage(userId: string): NotificationItem[] {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(userId: string, notifications: NotificationItem[]) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(notifications));
  } catch {
    // storage full, keep in memory only
  }
}

// ---- Module-level singleton state ----
const globalNotifications = ref<NotificationItem[]>([]);
const globalNotificationIds = new Set<string>();
let globalUserId: null | string = null;

// 全局自定义消息处理器映射（单例）
const globalCustomHandlers = new Map<
  string,
  Set<(msg: BackendMessage) => void>
>();

// 全局 WebSocket 实例
let globalWs: null | ReturnType<typeof useWebSocket> = null;

function addNotification(msg: BackendMessage) {
  const id = generateId(msg);
  if (globalNotificationIds.has(id)) return;

  const item = toNotificationItem(msg);
  globalNotifications.value.unshift(item);
  globalNotificationIds.add(id);

  notification.info({
    description: item.message,
    duration: 3,
    title: item.title,
  });

  if (globalUserId) {
    saveToStorage(globalUserId, globalNotifications.value);
  }
}

function processMessage(msg: BackendMessage) {
  const customHandlerSet = globalCustomHandlers.get(msg.type);
  if (customHandlerSet && customHandlerSet.size > 0) {
    customHandlerSet.forEach((handler) => handler(msg));
    return;
  }

  addNotification(msg);
}

export function useNotification() {
  const userStore = useUserStore();

  const wsUrl = computed(() => {
    const userId = userStore.userInfo?.userId;
    if (!userId) return null;
    return `${import.meta.env.VITE_GLOB_WS_URL}/${userId}`;
  });

  // 使用全局 WebSocket 实例，按需创建
  if (!globalWs) {
    globalWs = useWebSocket({
      url: () => wsUrl.value || '',
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
    });
  }
  const ws = globalWs;

  ws.onMessage(processMessage);

  const unreadCount = computed(() => {
    return globalNotifications.value.filter((n) => !n.isRead).length;
  });

  function addCustomHandler(
    messageType: string,
    handler: (msg: BackendMessage) => void,
  ) {
    let handlers = globalCustomHandlers.get(messageType);
    if (!handlers) {
      handlers = new Set();
      globalCustomHandlers.set(messageType, handlers);
    }
    handlers.add(handler);
    return () => {
      globalCustomHandlers.get(messageType)?.delete(handler);
    };
  }

  function markRead(id: number | string) {
    const item = globalNotifications.value.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      const userId = userStore.userInfo?.userId;
      if (userId) saveToStorage(userId, globalNotifications.value);
    }
  }

  function markAllRead() {
    globalNotifications.value.forEach((n) => {
      n.isRead = true;
    });
    const userId = userStore.userInfo?.userId;
    if (userId) saveToStorage(userId, globalNotifications.value);
  }

  function removeNotification(id: number | string) {
    const index = globalNotifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      const item = globalNotifications.value[index];
      if (item) {
        globalNotificationIds.delete(String(item.id));
      }
      globalNotifications.value.splice(index, 1);
      const userId = userStore.userInfo?.userId;
      if (userId) saveToStorage(userId, globalNotifications.value);
    }
  }

  function clearAll() {
    globalNotifications.value = [];
    globalNotificationIds.clear();
    const userId = userStore.userInfo?.userId;
    if (userId) localStorage.removeItem(getStorageKey(userId));
  }

  function connect() {
    const url = wsUrl.value;
    if (url) {
      ws.connect();
    }
  }

  function disconnect() {
    ws.disconnect();
  }

  watch(
    () => userStore.userInfo?.userId,
    (userId) => {
      if (!userId) {
        disconnect();
        globalNotifications.value = [];
        globalNotificationIds.clear();
        globalUserId = null;
        return;
      }

      globalUserId = userId;
      globalNotifications.value = loadFromStorage(userId);
      globalNotifications.value.forEach((n) => {
        globalNotificationIds.add(String(n.id));
      });

      if (ws.status.value !== 'connected') {
        connect();
      }
    },
    { immediate: true },
  );

  return {
    notifications: globalNotifications,
    unreadCount,
    isConnected: computed(() => ws.status.value === 'connected'),
    addCustomHandler,
    connect,
    disconnect,
    markRead,
    markAllRead,
    remove: removeNotification,
    clearAll,
  };
}
