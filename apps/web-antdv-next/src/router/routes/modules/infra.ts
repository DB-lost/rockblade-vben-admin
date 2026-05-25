import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:information-circle',
      order: 9997,
      title: $t('infra.title'),
      authority: ['DevelopRoleCode'],
    },
    name: 'Infra',
    path: '/infra',
    children: [
      {
        path: '/infra/codegen',
        name: 'InfraCodegen',
        meta: {
          icon: 'ion:code-download',
          title: $t('infra.codegen.title'),
        },
        component: () => import('#/views/infra/codegen/index.vue'),
      },
      {
        path: '/infra/operate-log',
        name: 'InfraOperateLog',
        meta: {
          icon: 'icon-park-solid:log',
          title: $t('infra.operateLog.title'),
        },
        component: () => import('#/views/infra/operate-log/index.vue'),
      },
    ],
  },
];

export default routes;
