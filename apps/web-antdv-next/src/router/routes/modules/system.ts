import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ion:settings-outline',
      order: 9997,
      title: $t('system.title'),
      authority: ['DevelopRoleCode', 'InitAdminCode'],
    },
    name: 'System',
    path: '/system',
    children: [
      {
        path: '/system/menu',
        name: 'SystemMenu',
        meta: {
          icon: 'mdi:menu',
          title: $t('system.menu.title'),
          authority: ['DevelopRoleCode'],
        },
        component: () => import('#/views/system/menu/index.vue'),
      },
      {
        path: '/system/role',
        name: 'SystemRole',
        meta: {
          icon: 'mdi:account-group',
          title: $t('system.role.title'),
          authority: ['DevelopRoleCode', 'InitAdminCode'],
        },
        component: () => import('#/views/system/role/index.vue'),
      },
      {
        path: '/system/dept',
        name: 'SystemDept',
        meta: {
          icon: 'charm:organisation',
          title: $t('system.dept.title'),
          authority: ['DevelopRoleCode', 'InitAdminCode'],
        },
        component: () => import('#/views/system/dept/index.vue'),
      },
      {
        path: '/system/user',
        name: 'SystemUser',
        meta: {
          icon: 'mdi:user',
          title: $t('system.user.title'),
          authority: ['DevelopRoleCode', 'InitAdminCode'],
        },
        component: () => import('#/views/system/user/index.vue'),
      },
      {
        path: '/system/dict',
        name: 'SystemDict',
        meta: {
          icon: 'mdi:book-open-outline',
          title: $t('system.dict.title'),
          authority: ['DevelopRoleCode', 'InitAdminCode'],
        },
        component: () => import('#/views/system/dict/index.vue'),
      },
      {
        path: '/system/job',
        name: 'SystemJob',
        meta: {
          icon: 'mdi:timer-cog-outline',
          title: $t('system.job.title'),
          authority: ['DevelopRoleCode', 'InitAdminCode'],
        },
        component: () => import('#/views/system/job/index.vue'),
      },
      {
        path: '/system/job-log',
        name: 'SystemJobLog',
        meta: {
          icon: 'hugeicons:job-search',
          title: $t('system.job-log.title'),
          authority: ['DevelopRoleCode', 'InitAdminCode'],
        },
        component: () => import('#/views/system/job-log/index.vue'),
      },
    ],
  },
];

export default routes;
