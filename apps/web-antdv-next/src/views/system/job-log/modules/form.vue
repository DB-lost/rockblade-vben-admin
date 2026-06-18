<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { queryJobLogById } from '#/api';
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
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData();
      // Wait for Vue to flush DOM updates (form fields mounted)
      await nextTick();

      if (data && data.id) {
        id.value = data.id;
        // 编辑时加载数据
        await queryJobLogById(data.id).then((data) => {
          formApi.setValues(data);
        });
      } else {
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return $t('ui.actionTitle.view', [$t('system.job-log.name')]);
});
</script>
<template>
  <Drawer class="w-full max-w-200" :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
