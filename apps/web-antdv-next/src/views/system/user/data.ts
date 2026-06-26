import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { UserPageResponse } from '#/api';
import type { DictOption } from '#/composables/useDict';

import { getRoleList } from '#/api';
import { clearDictCache, loadDictOptions } from '#/composables/useDict';
import { $t } from '#/locales';

let sexOptions: DictOption[] = [];
let statusOptions: DictOption[] = [];
const roleOptions: { label: string; value: string }[] = [];
let componentMounted = false;

async function _fetchDictOptions() {
  const [sex, status, roles] = await Promise.all([
    loadDictOptions('sys_user_sex'),
    loadDictOptions('common_status'),
    getRoleList(),
  ]);
  sexOptions = sex;
  statusOptions = status;
  roleOptions.length = 0;
  roleOptions.push(
    ...(roles ?? []).map((r: any) => ({
      label: r.name ?? r.roleName,
      value: r.id ?? r.roleId,
    })),
  );
}

export async function reloadDictData(): Promise<void> {
  if (!componentMounted) {
    componentMounted = true;
    return;
  }
  clearDictCache('sys_user_sex');
  clearDictCache('common_status');
  await _fetchDictOptions();
}

await _fetchDictOptions();

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
      rules: 'required',
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: $t('system.user.password'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('system.user.phone'),
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
    },
    {
      component: 'Select',
      fieldName: 'sex',
      label: $t('system.user.sex'),
      componentProps: {
        allowClear: true,
        placeholder: $t('ui.placeholder.select'),
        options: sexOptions,
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'roleId',
      label: $t('system.user.roleId'),
      componentProps: {
        api: getRoleList,
        fieldNames: { label: 'name', value: 'id' },
        allowClear: true,
        placeholder: $t('ui.placeholder.select'),
      },
    },
    {
      component: 'Select',
      componentProps: {
        options: statusOptions,
      },
      fieldName: 'status',
      label: $t('system.user.status'),
      rules: 'required',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: $t('system.user.nickname'),
    },
    {
      component: 'Select',
      componentProps: {
        options: statusOptions,
      },
      fieldName: 'status',
      label: $t('system.user.status'),
    },
  ];
}

export { roleOptions };

export function useColumns<T = UserPageResponse>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
  onRoleChange?: (newRoleId: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridColumns {
  return [
    {
      field: 'username',
      title: $t('system.user.username'),
      width: 200,
    },
    {
      field: 'nickname',
      title: $t('system.user.nickname'),
      width: 150,
    },
    {
      field: 'phone',
      title: $t('system.user.phone'),
      width: 150,
    },
    {
      field: 'email',
      title: $t('system.user.email'),
      width: 200,
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onRoleChange,
          disabled: (row: any) => Number(row.id) < 10,
        },
        name: 'CellSelect',
        options: roleOptions,
      },
      field: 'roleId',
      title: $t('system.user.roleId'),
      width: 300,
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('system.user.status'),
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.user.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'resetPassword',
            text: $t('common.resetPassword'),
            type: 'link',
          },
          {
            code: 'delete',
            danger: true,
            show: (row: any) => row.id !== '1',
            text: $t('common.delete'),
            type: 'link',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      width: 150,
    },
  ];
}
