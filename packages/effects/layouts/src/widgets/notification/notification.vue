<script lang="ts" setup>
import type { NotificationItem } from './types';

import { watch } from 'vue';
import { useRouter } from 'vue-router';

import { Bell, CircleCheckBig, CircleX, MailCheck } from '@vben/icons';
import { $t } from '@vben/locales';

import {
  VbenButton,
  VbenIconButton,
  VbenPopover,
  VbenScrollbar,
} from '@vben-core/shadcn-ui';

import { useToggle } from '@vueuse/core';

interface Props {
  dot?: boolean;
  notifications?: NotificationItem[];
  showRefreshBanner?: boolean;
}

defineOptions({ name: 'NotificationPopup' });

withDefaults(defineProps<Props>(), {
  dot: false,
  notifications: () => [],
  showRefreshBanner: false,
});

const emit = defineEmits<{
  clear: [];
  makeAll: [];
  read: [NotificationItem];
  refresh: [];
  remove: [NotificationItem];
  'update:open': [boolean];
  viewAll: [];
}>();

const router = useRouter();
const [open, toggle] = useToggle();

watch(open, (val) => emit('update:open', val));

const LEVEL_META: Record<string, { class: string; label: string }> = {
  NORMAL: { class: 'text-blue-500 bg-blue-50', label: '普通' },
  IMPORTANT: { class: 'text-orange-500 bg-orange-50', label: '重要' },
  URGENT: { class: 'text-red-500 bg-red-50', label: '紧急' },
};

const TYPE_META: Record<string, string> = {
  SYSTEM: '系统',
  BUSINESS: '业务',
  WARNING: '警告',
};

function close() {
  open.value = false;
}

function handleViewAll() {
  emit('viewAll');
  close();
}

function handleMakeAll() {
  emit('makeAll');
}

function handleClear() {
  emit('clear');
}

function handleRefresh() {
  emit('refresh');
}

function handleClick(item: NotificationItem) {
  if (item.link) {
    navigateTo(item.link, item.query, item.state);
  }
}

function navigateTo(
  link: string,
  query?: Record<string, any>,
  state?: Record<string, any>,
) {
  if (link.startsWith('http://') || link.startsWith('https://')) {
    window.open(link, '_blank');
  } else {
    router.push({
      path: link,
      query: query || {},
      state,
    });
  }
}

/**
 * 判断字符串是否为 emoji
 */
function isEmoji(str: string): boolean {
  return /\p{Emoji}/u.test(str);
}
</script>
<template>
  <VbenPopover v-model:open="open" content-class="relative right-2 w-90 p-0">
    <template #trigger>
      <div class="mr-2 flex-center h-full" @click.stop="toggle()">
        <VbenIconButton class="bell-button relative text-foreground">
          <span
            v-if="dot"
            class="absolute top-0.5 right-0.5 size-2 rounded-sm bg-primary"
          ></span>
          <Bell class="size-4" />
        </VbenIconButton>
      </div>
    </template>

    <div class="relative">
      <div class="flex items-center justify-between p-4 py-3">
        <div class="text-foreground">{{ $t('ui.widgets.notifications') }}</div>
        <VbenIconButton
          :disabled="notifications.length <= 0"
          :tooltip="$t('ui.widgets.markAllAsRead')"
          @click="handleMakeAll"
        >
          <MailCheck class="size-4" />
        </VbenIconButton>
      </div>

      <!-- 刷新横幅 -->
      <div
        v-if="showRefreshBanner"
        class="flex cursor-pointer items-center gap-2 bg-blue-50 px-4 py-2 text-sm text-blue-600"
        @click="handleRefresh"
      >
        <span>📬</span>
        <span>收到新通知，点击刷新</span>
      </div>

      <VbenScrollbar v-if="notifications.length > 0">
        <ul class="flex! max-h-90 w-full flex-col">
          <template v-for="item in notifications" :key="item.id ?? item.title">
            <li
              class="relative flex w-full cursor-pointer items-start gap-5 border-t border-border p-3 hover:bg-accent"
              @click="handleClick(item)"
            >
              <span
                v-if="!item.isRead"
                class="absolute top-2 right-2 size-2 rounded-sm bg-primary"
              ></span>

              <!-- 头像/图标区域 -->
              <span
                class="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-lg"
              >
                <template v-if="item.avatar && isEmoji(item.avatar)">
                  {{ item.avatar }}
                </template>
                <img
                  v-else
                  :src="item.avatar"
                  class="aspect-square size-full object-cover"
                />
              </span>

              <div class="flex flex-1 flex-col gap-1 leading-none">
                <p class="font-semibold">{{ item.title }}</p>
                <p class="my-1 line-clamp-2 text-xs text-muted-foreground">
                  {{ item.message }}
                </p>
                <!-- level 标签 + type + 时间 -->
                <div class="flex items-center gap-2">
                  <span
                    v-if="item.level"
                    class="inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs"
                    :class="LEVEL_META[item.level]?.class"
                  >
                    {{ LEVEL_META[item.level]?.label ?? item.level }}
                  </span>
                  <span v-if="item.type" class="text-xs text-muted-foreground">
                    {{ TYPE_META[item.type] ?? item.type }}
                  </span>
                  <span class="text-xs text-muted-foreground">
                    {{ item.date }}
                  </span>
                </div>
              </div>

              <div
                class="absolute top-1/2 right-3 flex -translate-y-1/2 flex-col gap-2"
              >
                <VbenIconButton
                  v-if="!item.isRead"
                  size="xs"
                  variant="ghost"
                  class="h-6 px-2"
                  :tooltip="$t('common.confirm')"
                  @click.stop="emit('read', item)"
                >
                  <CircleCheckBig class="size-4" />
                </VbenIconButton>
                <VbenIconButton
                  v-if="item.isRead"
                  size="xs"
                  variant="ghost"
                  class="h-6 px-2 text-destructive"
                  :tooltip="$t('common.delete')"
                  @click.stop="emit('remove', item)"
                >
                  <CircleX class="size-4" />
                </VbenIconButton>
              </div>
            </li>
          </template>
        </ul>
      </VbenScrollbar>

      <template v-else>
        <div class="flex-center min-h-37.5 w-full text-muted-foreground">
          {{ $t('common.noData') }}
        </div>
      </template>

      <div
        class="flex items-center justify-between border-t border-border px-4 py-3"
      >
        <VbenButton
          :disabled="notifications.length <= 0"
          size="sm"
          variant="ghost"
          @click="handleClear"
        >
          {{ $t('ui.widgets.clearNotifications') }}
        </VbenButton>
        <VbenButton size="sm" @click="handleViewAll">
          {{ $t('ui.widgets.viewAll') }}
        </VbenButton>
      </div>
    </div>
  </VbenPopover>
</template>

<style scoped>
:deep(.bell-button) {
  &:hover {
    svg {
      animation: bell-ring 1s both;
    }
  }
}

@keyframes bell-ring {
  0%,
  100% {
    transform-origin: top;
  }

  15% {
    transform: rotateZ(10deg);
  }

  30% {
    transform: rotateZ(-5deg);
  }

  45% {
    transform: rotateZ(5deg);
  }

  60% {
    transform: rotateZ(-3deg);
  }

  75% {
    transform: rotateZ(2deg);
  }
}
</style>
