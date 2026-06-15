<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CodegenTablePageResponse } from '#/api';

import { Page, useVbenDrawer, useVbenModal, VbenButton } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { downloadFileFromBlobPart } from '@vben/utils';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { codegenPage, codegenTable, deleteCodegenTable } from '#/api';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import Table from './modules/table.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [TableModal, modalApi] = useVbenModal({
  connectedComponent: Table,
  destroyOnClose: true,
  fullscreen: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await codegenPage({
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
  } as VxeTableGridOptions<CodegenTablePageResponse>,
});

function onActionClick(e: OnActionClickParams<CodegenTablePageResponse>) {
  switch (e.code) {
    case 'codegen': {
      onCodegen(e.row);
      break;
    }
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

function onCodegen(row: CodegenTablePageResponse) {
  const hideLoading = message.loading({
    content: $t('infra.codegen.generating', [row.tableName]),
    duration: 0,
    key: 'codegen_msg',
  });

  codegenTable(row.id)
    .then((blob) => {
      downloadFileFromBlobPart({
        fileName: `${row.tableName}.zip`,
        source: blob as Blob,
      });
      message.success({
        content: $t('infra.codegen.codegenSuccess', [row.tableName]),
        key: 'codegen_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onEdit(row: CodegenTablePageResponse) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: CodegenTablePageResponse) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.tableName]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteCodegenTable(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.tableName]),
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

function onImport() {
  modalApi.open();
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <TableModal @success="onRefresh" />
    <Grid :table-title="$t('infra.codegen.list')">
      <template #toolbar-tools>
        <VbenButton variant="default" @click="onImport">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.import', [$t('infra.codegen.name')]) }}
        </VbenButton>
      </template>
    </Grid>
  </Page>
</template>

<style lang="less" scoped></style>
