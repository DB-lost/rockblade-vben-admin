<script lang="ts" setup>
import { computed } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { saveUser } from '#/api';
import { getPublicKeyApi } from '#/api/core/auth';
import { $t } from '#/locales';
import { cryptoUtil } from '#/utils/crypto';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  wrapperClass: 'grid-cols-2 gap-x-4',
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    try {
      const { publicKey, nonce } = await getPublicKeyApi();
      cryptoUtil.setPublicKey(publicKey, nonce);
      values.password = cryptoUtil.encryptWithRSA(values.password);
      values.nonce = nonce;
    } catch {
      // encryption failed, continue without encryption
    }
    saveUser(values)
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
      formApi.resetForm();
    }
  },
});

const getDrawerTitle = computed(() => {
  return $t('ui.actionTitle.create', [$t('system.user.name')]);
});
</script>
<template>
  <Drawer class="w-full max-w-200" :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
