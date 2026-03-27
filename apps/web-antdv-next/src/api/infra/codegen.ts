import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * KeyValue
 */
export interface KeyValue {
  key?: any;
  value?: any;
}

/**
 * 代码生成分页请求参数
 */
export interface CodegenPageRequest {
  /**
   * 数据源Key
   */
  dataSourceKey: string;
  /**
   * 表描述
   */
  tableComment?: string;
  /**
   * 表名
   */
  tableName?: string;
}

/**
 * CodegenTablePageResponse，代码生成表分页查询结果
 */
export interface CodegenTablePageResponse {
  /**
   * 数据源key
   */
  dataSourceKey?: string;
  /**
   * 前端类型：VUE3_SHADCN_VUE
   */
  frontType?: FrontType;
  /**
   * 主键ID
   */
  id?: string;
  /**
   * 上次生成时间
   */
  lastGenTime?: Date;
  /**
   * 备注
   */
  remark?: string;
  /**
   * FRONTEND_BACKEND-前后端，BACKEND-仅后端，FRONTEND-仅前端
   */
  scene?: Scene;
  /**
   * 表描述
   */
  tableComment?: string;
  /**
   * 表名称
   */
  tableName?: string;
  /**
   * 模板类型：TABLE-单表，TREE_TABLE-树表，MASTER_SLAVE_TABLE-主从表
   */
  templateType?: TemplateType;
  [property: string]: any;
}

/**
 * 前端类型：VUE3_SHADCN_VUE
 */
export enum FrontType {
  Vue3ShadcnVue = 'VUE3_SHADCN_VUE',
}

/**
 * FRONTEND_BACKEND-前后端，BACKEND-仅后端，FRONTEND-仅前端
 */
export enum Scene {
  FrontendBackend = 'FRONTEND_BACKEND',
  OnlyBackend = 'ONLY_BACKEND',
  OnlyFrontend = 'ONLY_FRONTEND',
}

/**
 * 模板类型：TABLE-单表，TREE_TABLE-树表，MASTER_SLAVE_TABLE-主从表
 */
export enum TemplateType {
  MasterSlaveTable = 'MASTER_SLAVE_TABLE',
  Table = 'TABLE',
  TreeTable = 'TREE_TABLE',
}

/**
 * 查询数据源列表
 */
async function dataSourceList() {
  return requestClient.get<Array<KeyValue>>('/codegenTable/dataSourceList');
}

/**
 * 获取代码生成分页数据
 */
async function codegenPage(params: Recordable<CodegenPageRequest>) {
  return requestClient.get<Array<CodegenTablePageResponse>>(
    '/codegenTable/page',
    {
      params,
    },
  );
}

export { codegenPage, dataSourceList };
