import type { NotificationItem } from '@vben/layouts';

import type { BackendMessage } from './types';

import type { UserNotificationResponse } from '#/api';

import { computed, ref, watch } from 'vue';

import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'antdv-next';

import {
  deleteNotification,
  listNotification,
  readAllNotification,
  readNotification,
} from '#/api';
import { $t } from '#/locales';

import { useWebSocket } from './useWebSocket';

interface ToastConfig {
  type: 'error' | 'info' | 'warning';
  duration: number;
}

const LEVEL_TOAST_CONFIG: Record<string, ToastConfig | undefined> = {
  NORMAL: { type: 'info', duration: 4 },
  IMPORTANT: { type: 'warning', duration: 6 },
  URGENT: { type: 'error', duration: 0 },
};

const TYPE_ICONS: Record<string, string> = {
  SYSTEM: '⚙️',
  BUSINESS: '📋',
  WARNING: '⚠️',
};

/**
 * 格式化通知时间
 */
function formatDate(dateStr: Date | string | undefined): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
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
    return String(dateStr);
  }
}

function apiToNotificationItem(
  item: UserNotificationResponse,
): NotificationItem {
  return {
    id: item.id ?? '',
    avatar: TYPE_ICONS[item.type as string] ?? preferences.app.defaultAvatar,
    date: formatDate(item.createTime),
    isRead: item.readStatus === 1,
    message: item.content ?? '',
    title: item.title ?? '',
    type: item.type as 'BUSINESS' | 'SYSTEM' | 'WARNING' | undefined,
    level: item.level as 'IMPORTANT' | 'NORMAL' | 'URGENT' | undefined,
    senderId: item.senderId,
  };
}

function getToastConfig(msg: BackendMessage): ToastConfig {
  return LEVEL_TOAST_CONFIG[msg.level] ?? { type: 'info', duration: 4 };
}

// ---- Module-level singleton state ----
const globalNotifications = ref<NotificationItem[]>([]);
const unreadCount = ref(0);
const hasNewNotification = ref(false);
const showRefreshBanner = ref(false);
const isNotificationOpen = ref(false);

let globalWs: null | ReturnType<typeof useWebSocket> = null;

/**
 * 从 API 刷新通知列表
 */
async function refreshNotifications() {
  try {
    const data = await listNotification(50);
    globalNotifications.value = (data ?? []).map((item) =>
      apiToNotificationItem(item),
    );
    hasNewNotification.value = false;
    showRefreshBanner.value = false;
    unreadCount.value = globalNotifications.value.filter(
      (n) => !n.isRead,
    ).length;
  } catch {
    // API 失败时不覆盖已有数据
  }
}

/**
 * WS 消息处理：仅弹 Toast + 标记有新通知
 */
function processMessage(msg: BackendMessage) {
  const config = getToastConfig(msg);
  notification[config.type]({
    description: msg.title,
    duration: config.duration,
    title: $t('system.notification.pushTitle'),
  });

  hasNewNotification.value = true;
  unreadCount.value++;

  // 通知栏打开时显示刷新横幅
  if (isNotificationOpen.value) {
    showRefreshBanner.value = true;
  }
}

export function useNotification() {
  const accessStore = useAccessStore();
  const userStore = useUserStore();

  const wsUrl = computed(() => {
    const token = accessStore.accessToken;
    if (!token) return null;
    return `${import.meta.env.VITE_GLOB_WS_URL}?Authorization=Bearer+${token}`;
  });

  // 全局单例 WebSocket
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

  function setOpen(open: boolean) {
    isNotificationOpen.value = open;
    if (open) {
      refreshNotifications();
    }
  }

  function markRead(id: number | string) {
    const userNotification = globalNotifications.value.find((n) => n.id === id);
    if (!userNotification || userNotification.isRead) return;

    readNotification(String(id)).then(() => {
      userNotification.isRead = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    });
  }

  function markAllRead() {
    readAllNotification().then(() => {
      globalNotifications.value.forEach((n) => {
        n.isRead = true;
      });
      unreadCount.value = 0;
    });
  }

  function removeNotification(id: number | string) {
    deleteNotification(String(id)).then(() => {
      const idx = globalNotifications.value.findIndex((n) => n.id === id);
      if (idx !== -1) {
        const item = globalNotifications.value[idx];
        globalNotifications.value.splice(idx, 1);
        if (item && !item.isRead) {
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
      }
    });
  }

  function clearAll() {
    // 批量删除所有通知
    const promises = globalNotifications.value
      .filter((n) => n.id !== null)
      .map((n) => deleteNotification(String(n.id)).catch(() => {}));
    Promise.all(promises).then(() => {
      globalNotifications.value = [];
      unreadCount.value = 0;
      hasNewNotification.value = false;
      showRefreshBanner.value = false;
    });
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
        unreadCount.value = 0;
        hasNewNotification.value = false;
        showRefreshBanner.value = false;
        return;
      }

      if (ws.status.value !== 'connected') {
        connect();
      }
    },
    { immediate: true },
  );

  return {
    notifications: globalNotifications,
    unreadCount,
    hasNewNotification,
    showRefreshBanner,
    isConnected: computed(() => ws.status.value === 'connected'),
    setOpen,
    refreshNotifications,
    connect,
    disconnect,
    markRead,
    markAllRead,
    remove: removeNotification,
    clearAll,
  };
}
