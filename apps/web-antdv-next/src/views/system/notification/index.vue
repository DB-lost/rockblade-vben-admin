<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { Page, VbenButton } from '@vben/common-ui';
import { MailCheck } from '@vben/icons';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteNotification,
  pageNotification,
  readAllNotification,
  readNotification,
} from '#/api';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await pageNotification({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
      response: {
        result: 'records',
        total: 'totalRow',
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions,
});

function onActionClick(e: OnActionClickParams<any>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'markRead': {
      onMarkRead(e.row);
      break;
    }
  }
}

function onMarkRead(row: any) {
  if (row.readStatus === 1) {
    message.info('该通知已读');
    return;
  }
  readNotification(row.id).then(() => {
    row.readStatus = 1;
    gridApi.query();
  });
}

function onDelete(row: any) {
  deleteNotification(row.id).then(() => {
    message.success($t('ui.actionMessage.deleteSuccess'));
    gridApi.query();
  });
}

function onReadAll() {
  readAllNotification().then(() => {
    message.success($t('ui.actionMessage.operationSuccess'));
    gridApi.query();
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid :table-title="$t('system.notification.list')">
      <template #toolbar-tools>
        <VbenButton variant="default" @click="onReadAll">
          <MailCheck class="size-5" />
          全部标记已读
        </VbenButton>
      </template>
    </Grid>
  </Page>
</template>
