import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridColumns } from '#/adapter/vxe-table';
import type { FileDedupPageResponse } from '#/api';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'fileName',
      label: '原始文件名',
    },
    {
      component: 'Input',
      fieldName: 'mimeType',
      label: '文件类型',
    },
  ];
}

export function useColumns<T = FileDedupPageResponse>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridColumns {
  return [
    {
      field: 'fileName',
      title: '原始文件名',
      width: 250,
    },
    {
      field: 'ossPath',
      title: 'OSS 文件路径',
    },
    {
      field: 'fileSize',
      title: '文件大小 (字节)',
      width: 150,
    },
    {
      field: 'mimeType',
      title: '文件 MIME 类型',
      width: 150,
    },
    {
      field: 'refCount',
      title: '引用计数',
      width: 150,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('infra.fileDedup.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('infra.fileDedup.operation'),
      width: 150,
    },
  ];
}
