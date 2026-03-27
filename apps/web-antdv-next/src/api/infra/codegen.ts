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
}

/**
 * UpdateCodegenTableRequest，代码生成表字段定义主键
 */
export interface UpdateCodegenTableRequest {
  /**
   * API包名
   */
  apiPackage: string;
  /**
   * 作者
   */
  author: string;
  /**
   * 业务名
   */
  businessName: string;
  /**
   * 业务包名
   */
  businessPackage: string;
  /**
   * 类描述
   */
  classComment: string;
  /**
   * 实体类名称
   */
  className: string;
  /**
   * 数据源Key
   */
  dataSourceKey: string;
  /**
   * 前端类型：VUE3_SHADCN_VUE
   */
  frontType: FrontType;
  /**
   * 主键ID
   */
  id: string;
  /**
   * 主表ID（主从表场景）
   */
  masterTableId?: string;
  /**
   * 模块名
   */
  moduleName: string;
  /**
   * 父菜单ID
   */
  parentMenuId: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 生成场景：FRONTEND_BACKEND-前后端，BACKEND-仅后端，FRONTEND-仅前端
   */
  scene: Scene;
  /**
   * 子表关联主表的字段ID
   */
  subJoinColumnId?: string;
  /**
   * 是否一对多关联
   */
  subJoinMany?: boolean;
  /**
   * 表描述
   */
  tableComment: string;
  /**
   * 表名称
   */
  tableName: string;
  /**
   * 表前缀
   */
  tablePrefix: string;
  /**
   * 模板类型：
   */
  templateType: TemplateType;
  /**
   * 树表名称字段ID
   */
  treeNameColumnId?: string;
  /**
   * 树表父字段ID
   */
  treeParentColumnId?: string;
}

/**
 * CodegenTableResponse，代码生成表响应
 */
export interface CodegenTableResponse {
  /**
   * API包名
   */
  apiPackage?: string;
  /**
   * 作者
   */
  author?: string;
  /**
   * 业务名
   */
  businessName?: string;
  /**
   * 业务包名
   */
  businessPackage?: string;
  /**
   * 类描述
   */
  classComment?: string;
  /**
   * 实体类名称
   */
  className?: string;
  /**
   * 数据源key
   */
  dataSourceKey?: string;
  /**
   * 前端类型：VUE3_SHADCN_VUE
   */
  frontType?: FrontType;
  /**
   * 是否生成Controller
   */
  generateController?: boolean;
  /**
   * 是否生成Entity
   */
  generateEntity?: boolean;
  /**
   * 是否生成Mapper
   */
  generateMapper?: boolean;
  /**
   * 是否生成MapperXml
   */
  generateMapperXml?: boolean;
  /**
   * 是否生成Service
   */
  generateService?: boolean;
  /**
   * 主键ID
   */
  id?: string;
  /**
   * 主表ID（主从表场景）
   */
  masterTableId?: string;
  /**
   * 模块名
   */
  moduleName?: string;
  /**
   * 父菜单ID
   */
  parentMenuId?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * FRONTEND_BACKEND-前后端，BACKEND-仅后端，FRONTEND-仅前端
   */
  scene?: Scene;
  /**
   * 子表关联主表的字段ID
   */
  subJoinColumnId?: string;
  /**
   * 是否一对多关联
   */
  subJoinMany?: boolean;
  /**
   * 表描述
   */
  tableComment?: string;
  /**
   * 表名称
   */
  tableName?: string;
  /**
   * 表前缀
   */
  tablePrefix?: string;
  /**
   * 模板类型：TABLE-单表，TREE_TABLE-树表，MASTER_SLAVE_TABLE-主从表
   */
  templateType?: TemplateType;
  /**
   * 树表名称字段ID
   */
  treeNameColumnId?: string;
  /**
   * 树表父字段ID
   */
  treeParentColumnId?: string;
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

/**
 * 根据代码生成表主键获取详细信息
 */
async function queryById(id: string) {
  return requestClient.get<CodegenTableResponse>(
    `/codegenTable/queryById/${id}`,
  );
}

/**
 * 根据主键更新代码生成表
 */
async function updateCodegenTable(data: Recordable<UpdateCodegenTableRequest>) {
  return requestClient.put<boolean>('/codegenTable', {
    data,
  });
}

export { codegenPage, dataSourceList, queryById, updateCodegenTable };
