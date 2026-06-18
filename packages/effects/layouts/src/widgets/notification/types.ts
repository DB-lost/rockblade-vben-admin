interface NotificationItem {
  id: string | undefined;
  avatar?: string;
  date: string;
  isRead?: boolean;
  message: string;
  title: string;
  /**
   * 跳转链接，可以是路由路径或完整 URL
   * @example '/dashboard' 或 'https://example.com'
   */
  link?: string;
  query?: Record<string, any>;
  state?: Record<string, any>;
  /** 消息类型（用于展示图标/标签） */
  type?: 'BUSINESS' | 'SYSTEM' | 'WARNING';
  /** 紧急程度 */
  level?: 'IMPORTANT' | 'NORMAL' | 'URGENT';
  /** 发送人ID */
  senderId?: string;
}

export type { NotificationItem };
