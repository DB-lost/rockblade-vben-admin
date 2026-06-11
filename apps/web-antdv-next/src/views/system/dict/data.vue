<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DictDataPageResponse, DictTypePageResponse } from '#/api';

import { Page, useVbenDrawer, VbenButton } from '@vben/common-ui';
import { ArrowLeft, Plus } from '@vben/icons';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDictData, pageDictData } from '#/api';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data-data';
import Form from './modules/data-form.vue';

const props = defineProps<{
  selectedType: DictTypePageResponse;
}>();

const emit = defineEmits<{
  back: [];
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
            dictTypeId: props.selectedType.id,
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
  formDrawerApi.setData({ ...row, dictTypeId: props.selectedType.id }).open();
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
  formDrawerApi.setData({ dictTypeId: props.selectedType.id }).open();
}

function onBackToTypes() {
  emit('back');
}
</script>
<template>
  <Page auto-content-height>
    <template #title>
      <VbenButton variant="link" class="px-0" @click="onBackToTypes">
        <ArrowLeft class="size-5" />
        {{ $t('common.back') }}
      </VbenButton>
    </template>
    <template #extra>
      <span class="text-lg font-medium">
        {{ selectedType.name }}
      </span>
    </template>

    <FormDrawer @success="onRefresh" />
    <Grid>
      <template #toolbar-tools>
        <VbenButton variant="default" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.dict.data.name')]) }}
        </VbenButton>
      </template>
    </Grid>
  </Page>
</template>
