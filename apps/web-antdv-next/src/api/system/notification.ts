import { requestClient } from '#/api/request';

/**
 * UserNotificationResponse，用户通知响应
 */
export interface UserNotificationResponse {
  /**
   * 消息内容
   */
  content?: string;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 用户通知主键
   */
  id?: string;
  /**
   * 紧急程度
   */
  level?: Level;
  /**
   * 消息ID
   */
  notificationId?: string;
  /**
   * 0未读 1已读
   */
  readStatus?: number;
  /**
   * 阅读时间
   */
  readTime?: Date;
  /**
   * 发送人ID（空=系统）
   */
  senderId?: string;
  /**
   * 消息标题
   */
  title?: string;
  /**
   * 消息类型
   */
  type?: Type;
  /**
   * 用户ID
   */
  userId?: string;
}

/**
 * 紧急程度
 */
export enum Level {
  Important = 'IMPORTANT',
  Normal = 'NORMAL',
  Urgent = 'URGENT',
}

/**
 * 消息类型
 */
export enum Type {
  Business = 'BUSINESS',
  System = 'SYSTEM',
  Warning = 'WARNING',
}

/**
 * NotificationPageRequest，通知分页查询请求
 */
export interface NotificationPageRequest {
  /** 消息类型 */
  type?: string;
  /** 紧急程度 */
  level?: string;
  /** 阅读状态：0未读 1已读 */
  readStatus?: number;
  /** 开始时间 */
  beginTime?: string;
  /** 结束时间 */
  endTime?: string;
  pageNum?: number;
  pageSize?: number;
}

enum Api {
  Base = '/notifications',
  List = '/notifications/list',
  Page = '/notifications/page',
  ReadAll = '/notifications/read-all',
  UnreadCount = '/admin/notifications/unread-count',
}

/**
 * 获取当前用户通知列表
 */
async function listNotification(limit: number) {
  return requestClient.get<UserNotificationResponse[]>(Api.List, {
    params: { limit },
  });
}

/**
 * 分页查询当前用户通知列表
 */
async function pageNotification(request: NotificationPageRequest) {
  return requestClient.get(Api.Page, { params: request });
}

/**
 * 标记已读
 */
async function readNotification(id: string | undefined) {
  return requestClient.put(`${Api.Base}/${id}/read`);
}

/**
 * 全部标记已读
 */
async function readAllNotification() {
  return requestClient.put(Api.ReadAll);
}

/**
 * 未读通知数量
 */
async function unreadCountNotification() {
  return requestClient.get<number>(Api.UnreadCount);
}

/**
 * 删除通知
 */
async function deleteNotification(id: string | undefined) {
  return requestClient.delete(`${Api.Base}/${id}`);
}

export {
  deleteNotification,
  listNotification,
  pageNotification,
  readAllNotification,
  readNotification,
  unreadCountNotification,
};
