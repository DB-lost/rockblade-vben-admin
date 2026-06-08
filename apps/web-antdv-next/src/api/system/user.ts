import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 分页查询参数
 */
export interface UserPageRequest {
  /**
   * 用户名
   */
  username?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 用户状态（0:禁用；1：启用）
   */
  status?: number;
  pageNum?: number;
  pageSize?: number;
}

/**
 * 接口响应参数
 */
export interface UserPageResponse {
  /**
   * 主键ID
   */
  id?: string;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 用户状态（0:禁用；1：启用）
   */
  status?: number;
}

/**
 * 表单请求参数
 */
export interface UserRequest {
  /**
   * 主键ID
   */
  id?: string;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 用户状态（0:禁用；1：启用）
   */
  status?: number;
}

/**
 * 响应实体
 */
export interface UserResponse {
  /**
   * 主键ID
   */
  id?: string;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 用户类型
   */
  userType?: string;
  /**
   * 用户状态（0:禁用；1：启用）
   */
  status?: number;
}

/**
 * 列表项
 */
export interface UserListResponse {
  /**
   * 主键ID
   */
  id?: string;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 用户类型
   */
  userType?: string;
  /**
   * 用户状态（0:禁用；1：启用）
   */
  status?: number;
  /**
   * 是否删除
   */
  deleted?: boolean;
}

/**
 * ResetPasswordRequest，重置密码
 *
 * ChangePasswordRequest，修改密码
 */
export interface ResetPasswordRequest {
  /**
   * id
   */
  id?: string;
  /**
   * 新密码
   */
  newPassword: string;
  /**
   * 标志
   */
  nonce?: string;
  /**
   * 重置密码枚举
   */
  resetPasswordEnums: ResetPasswordEnums;
}

export interface ChangePasswordRequest extends ResetPasswordRequest {
  /**
   * 旧密码
   */
  oldPassword: string;
}

/**
 * 重置密码枚举
 */
export enum ResetPasswordEnums {
  Change = 'CHANGE',
  Reset = 'RESET',
}

enum Api {
  Base = '/user',
  Page = '/user/page',
  QueryAll = '/user/queryAll',
  QueryById = '/user/queryById',
  UpdatePassword = '/user/updatePassword',
}

/**
 * 分页查询用户表列表
 */
async function pageUser(request: UserPageRequest) {
  return requestClient.get<UserPageResponse>(Api.Page, { params: request });
}

/**
 * 根据ID获取用户表详情
 */
async function queryUserById(id: string) {
  return requestClient.get<UserResponse>(`${Api.QueryById}/${id}`);
}

/**
 * 查询所有用户表列表
 */
async function queryAllUser() {
  return requestClient.get<UserListResponse[]>(Api.QueryAll);
}

/**
 * 保存用户表
 */
async function saveUser(request: Recordable<UserRequest>) {
  return requestClient.post<string>(Api.Base, request);
}

/**
 * 更新用户表
 */
async function updateUser(request: Recordable<UserRequest>) {
  return requestClient.put<string>(Api.Base, request);
}

/**
 * 删除用户表
 */
async function deleteUser(id: string | undefined) {
  return requestClient.delete(`${Api.Base}/${id}`);
}

/**
 * 修改密码（登录用户）
 */
async function changePassword(data: ChangePasswordRequest) {
  return requestClient.put(Api.UpdatePassword, data);
}

/**
 * 管理员重置用户密码
 */
async function resetUserPassword(data: ResetPasswordRequest) {
  return requestClient.put(`${Api.UpdatePassword}`, data);
}

export {
  changePassword,
  deleteUser,
  pageUser,
  queryAllUser,
  queryUserById,
  resetUserPassword,
  saveUser,
  updateUser,
};
