<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { queryOperateLogById } from '#/api';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  wrapperClass: 'grid-cols-2 gap-x-4',
});

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  showConfirmButton: false,

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData();
      // Wait for Vue to flush DOM updates (form fields mounted)
      await nextTick();

      if (data && data.id) {
        id.value = data.id;
        // 编辑时加载数据
        await queryOperateLogById(data.id).then((data) => {
          formApi.setValues(data);
        });
      } else {
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return id.value
    ? $t('common.edit', $t('infra.operateLog.name'))
    : $t('common.create', $t('infra.operateLog.name'));
});
</script>
<template>
  <Drawer class="w-full max-w-200" :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
