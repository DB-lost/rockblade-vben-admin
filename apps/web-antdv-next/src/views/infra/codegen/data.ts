import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api';

import { dataSourceList } from '#/api';
import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'tableName',
      label: $t('infra.codegen.tableName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'tableComment',
      label: $t('infra.codegen.tableComment'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.role.status'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.role.remark'),
    },
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      label: $t('system.role.setPermissions'),
      modelPropName: 'modelValue',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    // { component: 'Input', fieldName: 'id', label: $t('system.role.id') },
    {
      component: 'ApiSelect',
      componentProps: {
        api: dataSourceList,
        allowClear: false,
        autoSelect: 'first',
        fieldNames: { label: 'key', value: 'value' },
      },
      fieldName: 'dataSourceKey',
      label: $t('infra.codegen.dataSource'),
    },
    {
      component: 'Input',
      fieldName: 'tableName',
      label: $t('infra.codegen.tableName'),
    },
    {
      component: 'Input',
      fieldName: 'tableComment',
      label: $t('infra.codegen.tableComment'),
    },
  ];
}

export function useColumns<T = SystemRoleApi.SystemRole>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridColumns {
  return [
    {
      field: 'tableName',
      title: $t('infra.codegen.tableName'),
      width: 200,
    },
    {
      field: 'tableComment',
      title: $t('infra.codegen.tableComment'),
      width: 200,
    },
    {
      field: 'dataSourceKey',
      title: $t('infra.codegen.dataSource'),
      width: 200,
    },
    {
      field: 'scene',
      title: $t('infra.codegen.scene'),
      width: 200,
    },
    {
      field: 'frontType',
      title: $t('infra.codegen.frontType'),
      width: 200,
    },
    {
      field: 'lastGenTime',
      title: $t('infra.codegen.lastGenTime'),
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('infra.codegen.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.role.operation'),
      width: 130,
    },
  ];
}
