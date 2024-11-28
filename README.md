This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Task Management System

一個基於 React 和 PocketBase 的任務管理系統。

## 功能特點

- 即時數據更新
  - 使用 PocketBase Realtime 訂閱功能
  - 使用 React Query 管理狀態和緩存
- 任務管理
  - 創建、編輯、刪除任務
  - 任務狀態追蹤
  - 進度管理
  - 到期日設置
  - 任務分配
- 數據視覺化
  - 任務狀態分佈圖
  - 進度分佈圖
  - 到期時間統計圖
- 角色管理
  - 角色創建和管理
  - 權限控制

## 技術棧

- Frontend:
  - Next.js
  - React Query
  - Lodash
  - ECharts
  - React Hook Form
  - Zod
  - Tailwind CSS
  - shadcn/ui
- Backend:
  - PocketBase

## 主要功能實現

### 即時更新
