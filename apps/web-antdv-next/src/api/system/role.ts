import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    [key: string]: any;
    id: string;
    name: string;
    permissions: string[];
    remark?: string;
    status: 0 | 1;
  }
}

/**
 * 列表项
 */
export interface RoleListResponse {
  /**
   * 主键ID
   */
  id?: string;
  /**
   * 用户名
   */
  name?: string;
}

/**
 * 获取角色列表数据
 */
async function getRolePage(params: Recordable<any>) {
  return requestClient.get<Array<SystemRoleApi.SystemRole>>('/role/page', {
    params,
  });
}

/**
 * 创建角色
 * @param data 角色数据
 */
async function createRole(data: Omit<SystemRoleApi.SystemRole, 'id'>) {
  return requestClient.post('/role', data);
}

/**
 * 更新角色
 *
 * @param id 角色 ID
 * @param data 角色数据
 */
async function updateRole(data: Omit<SystemRoleApi.SystemRole, 'id'>) {
  return requestClient.put(`/role`, data);
}

/**
 * 删除角色
 * @param id 角色 ID
 */
async function deleteRole(id: string) {
  return requestClient.delete(`/role/${id}`);
}

/**
 * 获取角色列表数据
 */
async function getRoleList() {
  return requestClient.get<Array<RoleListResponse>>('/role/queryAll');
}

export { createRole, deleteRole, getRoleList, getRolePage, updateRole };
