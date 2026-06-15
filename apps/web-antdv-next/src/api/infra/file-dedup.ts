import { requestClient } from '#/api/request';

/**
 * 分页查询参数
 */
export interface FileDedupPageRequest {
  /**
   * 原始文件名
   */
  fileName?: string;
  /**
   * 文件 MIME 类型
   */
  mimeType?: string;
  pageNum?: number;
  pageSize?: number;
}

/**
 * 接口响应参数
 */
export interface FileDedupPageResponse {
  /**
   * 主键ID
   */
  id?: string | undefined;
  /**
   * OSS 文件路径 (完整 URL)
   */
  ossPath?: string;
  /**
   * 原始文件名
   */
  fileName?: string;
  /**
   * 文件大小 (字节)
   */
  fileSize?: number;
  /**
   * 文件 MIME 类型
   */
  mimeType?: string;
  /**
   * 引用计数 (被多少条消息/记录引用)
   */
  refCount?: number;
}

export interface FileDedupResponse {
  /**
   * 主键ID
   */
  id?: string;
  /**
   * OSS 文件路径 (完整 URL)
   */
  ossPath?: string;
  /**
   * OSS 文件路径 (完整 URL)
   */
  path?: string;
  /**
   * 原始文件名
   */
  fileName?: string;
  /**
   * 文件大小 (字节)
   */
  fileSize?: number;
  /**
   * 文件 MIME 类型
   */
  mimeType?: string;
  /**
   * 引用计数 (被多少条消息/记录引用)
   */
  refCount?: number;
}

enum Api {
  Base = '/fileDedup',
  Page = '/fileDedup/page',
  QueryById = '/fileDedup/queryById',
}

/**
 * 分页查询文件去重表 (基于内容哈希)列表
 */
async function pageFileDedup(request: FileDedupPageRequest) {
  return requestClient.get<FileDedupPageResponse>(Api.Page, {
    params: request,
  });
}

/**
 * 删除文件去重表 (基于内容哈希)
 */
async function deleteFileDedup(id: string | undefined) {
  return requestClient.delete(`${Api.Base}/${id}`);
}

/**
 * 根据ID获取文件去重表定义详情
 */
async function queryById(id: string | undefined) {
  return requestClient.get<FileDedupResponse>(`${Api.QueryById}/${id}`);
}

export { deleteFileDedup, pageFileDedup, queryById };
