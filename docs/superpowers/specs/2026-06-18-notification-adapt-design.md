# 通知系统适配设计

## 背景

后端调整了 WebSocket 推送消息格式，同时通知列表数据改为由 REST API 管理。前端需要适配新的推送格式和通知管理流程。

## 后端接口

### WebSocket 推送格式 (NotifyMessage)

```json
{
  "type": "SYSTEM | BUSINESS | WARNING",
  "title": "消息标题",
  "level": "NORMAL | IMPORTANT | URGENT",
  "data": "附加数据（可选 Map/POJO）"
}
```

### 通知列表 API 返回 (UserNotificationResponse)

```json
{
  "id": "主键",
  "senderId": "发送人ID（空=系统）",
  "title": "标题",
  "content": "内容",
  "type": "SYSTEM | BUSINESS | WARNING",
  "level": "NORMAL | IMPORTANT | URGENT",
  "readStatus": 0,
  "readTime": "2026-06-18 10:00:00",
  "createTime": "2026-06-18 10:00:00"
}
```

## 工作流

```
WebSocket 推送 (type, title, level)
  → 弹出对应 level 样式的 Toast
  → 通知栏是否打开？
      是 → 显示「收到新通知」刷新横幅
      否 → 红点标记
  → 用户打开通知栏
  → API listNotification() 拉取列表
  → 渲染展示
```

## 变更清单

### 1. 类型定义更新

**BackendMessage** (`composables/notification/types.ts`)

- type: 'SYSTEM' | 'BUSINESS' | 'WARNING'
- title: string
- level: 'NORMAL' | 'IMPORTANT' | 'URGENT'
- data?: Record<string, unknown>
- 移除: content, timestamp

**NotificationItem** (`widgets/notification/types.ts`)

- 新增: type?, level?, senderId?
- avatar 改为可选

### 2. API 新增 (`api/system/notification.ts`)

```typescript
interface NotificationPageRequest {
  type?: string;
  level?: string;
  readStatus?: number;
  beginTime?: string;
  endTime?: string;
  pageNum?: number;
  pageSize?: number;
}

async function pageNotification(request); // GET /notifications/page
```

### 3. WebSocket 处理 (`useNotification.ts`)

- WS 消息 → 弹 Toast（按 level 区分样式）
- 新增 hasNewNotification ref 控制红点
- 新增 refreshNotifications() 从 API 拉取
- 新增 showRefreshBanner ref 控制刷新横幅
- 已读/删除操作同步后端 API

### 4. Level → Toast 样式映射

| Level     | Toast 类型 | 时长     |
| --------- | ---------- | -------- |
| NORMAL    | info       | 4s       |
| IMPORTANT | warning    | 6s       |
| URGENT    | error      | 手动关闭 |

### 5. 通知栏 UI 适配 (`notification.vue`)

- avatar → type 图标（⚙️ 系统 / 📋 业务 / ⚠️ 警告）
- 新增 level 标签行（带颜色）
- 新增 type 标识文字
- 新增刷新横幅

### 6. 通知管理页面

- 路由: `/system/notification`（hideInMenu: true）
- 分页表格 + 搜索筛选
- 操作: 标记已读、删除、全部标记已读
- 通过通知栏「查看所有」跳入
