import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { CodegenTablePageResponse, TableInfoResponse } from '#/api';

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

export function useColumns<T = CodegenTablePageResponse>(
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
      minWidth: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'codegen',
            text: $t('infra.codegen.generate'),
            type: 'link',
          },
          // {
          //   code: 'edit',
          //   text: $t('common.edit'),
          //   type: 'link',
          // },
          {
            code: 'delete',
            danger: true,
            text: $t('common.delete'),
            type: 'link',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('infra.codegen.operation'),
      width: 150,
    },
  ];
}

export function useTableGridFormSchema(): VbenFormSchema[] {
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

export function useTableColumns<T = TableInfoResponse>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridColumns {
  return [
    {
      field: 'tableName',
      title: $t('infra.codegen.tableName'),
      width: 300,
    },
    {
      field: 'tableComment',
      title: $t('infra.codegen.tableComment'),
      minWidth: 100,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'add',
            danger: false,
            text: $t('ui.actionTitle.import'),
            type: 'link',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('infra.codegen.operation'),
      width: 150,
    },
  ];
}
