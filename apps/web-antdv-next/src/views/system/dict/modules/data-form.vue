<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  queryAllDictType,
  queryDictDataById,
  saveDictData,
  updateDictData,
} from '#/api';
import { $t } from '#/locales';

import { useFormSchema } from '../data-data';

const emits = defineEmits(['success']);

const dictTypeOptions = ref<Array<{ label: string; value: string }>>([]);

const FormSchema = useFormSchema();

const [Form, formApi] = useVbenForm({
  schema: FormSchema,
  showDefaultActions: false,
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  wrapperClass: 'grid-cols-2 gap-x-4',
});

const id = ref();

async function loadDictTypeOptions() {
  if (dictTypeOptions.value.length > 0) return;
  const types = await queryAllDictType();
  dictTypeOptions.value = (types ?? []).map((t) => ({
    label: t.name ?? t.code ?? '',
    value: t.id ?? '',
  }));
}

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    // 更新时补充主键
    if (id.value) {
      values.id = id.value;
    }
    (id.value ? updateDictData : saveDictData)(values)
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      await loadDictTypeOptions();

      const data = drawerApi.getData();
      await nextTick();

      if (data?.id) {
        id.value = data.id;
        // 编辑时加载数据
        const detail = await queryDictDataById(data.id);
        formApi.setValues(detail);
      } else {
        id.value = undefined;
        formApi.resetForm();
        // 新建时从父组件传入的 dictTypeId 预填字典类型
        if (data?.dictTypeId) {
          formApi.setValues({
            dictTypeId: data.dictTypeId as string,
          });
        }
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return id.value
    ? $t('common.edit', $t('system.dict.data.name'))
    : $t('common.create', $t('system.dict.data.name'));
});
</script>
<template>
  <Drawer :title="getDrawerTitle" class="w-full max-w-200">
    <Form />
  </Drawer>
</template>
