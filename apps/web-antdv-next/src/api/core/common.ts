import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/common/codes');
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/common/info');
}

/**
 * 文件上传
 * @param params 上传参数
 * @param file 文件
 * @returns
 */
export async function fileUploadApi(file: File, isPublic: boolean) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post<string>(`/fileDedup/fileUpload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    params: {
      isPublic,
    },
  });
}
