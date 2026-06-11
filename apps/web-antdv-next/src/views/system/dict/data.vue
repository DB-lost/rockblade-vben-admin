<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DictDataPageResponse } from '#/api';

import { useVbenDrawer, VbenButton } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDictData, pageDictData } from '#/api';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data-data';
import Form from './modules/data-form.vue';

const props = defineProps<{
  dictTypeId: string;
}>();

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

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
          return await pageDictData({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
            dictTypeId: props.dictTypeId,
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
  } as VxeTableGridOptions<DictDataPageResponse>,
});

function onActionClick(e: OnActionClickParams<DictDataPageResponse>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

function onEdit(row: DictDataPageResponse) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: DictDataPageResponse) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.label ?? '']),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteDictData(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.label ?? '']),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({ dictTypeId: props.dictTypeId }).open();
}
</script>
<template>
  <FormDrawer @success="onRefresh" />
  <Grid :table-title="$t('system.dict.data.list')">
    <template #toolbar-tools>
      <VbenButton variant="default" @click="onCreate">
        <Plus class="size-5" />
        {{ $t('ui.actionTitle.create', [$t('system.dict.data.name')]) }}
      </VbenButton>
    </template>
  </Grid>
</template>
