<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { FileDedupPageResponse } from '#/api';

import { Page } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteFileDedup, pageFileDedup } from '#/api';
import { $t } from '#/locales';

import { queryById } from '../../../api/infra/file-dedup';
import { useColumns, useGridFormSchema } from './data';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await pageFileDedup({
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
    rowConfig: {
      keyField: 'id',
    },

    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<FileDedupPageResponse>,
});

function onActionClick(e: OnActionClickParams<FileDedupPageResponse>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'getFile': {
      onGetFile(e.row);
      break;
    }
  }
}

function onDelete(row: FileDedupPageResponse) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteFileDedup(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess'),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onGetFile(row: FileDedupPageResponse) {
  queryById(row.id).then((res) => {
    if (res.ossPath) {
      window.open(res.ossPath, '_blank');
    } else {
      message.warning($t('infra.fileDedup.noFile'));
    }
  });
}

function onRefresh() {
  gridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <Grid :table-title="$t('infra.fileDedup.list')" />
  </Page>
</template>
