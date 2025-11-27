# Short URL 前端

一个基于 Vue 3 + Vite 的前端应用，用于：

- 创建短链并展示后端返回短链与原始链接
- 通过前端的跳转页解析短码并跳转到原始链接

## 快速开始

```sh
pnpm install
pnpm dev
```

默认开发预览地址：`http://localhost:5173/`（实际端口可能会顺延）

## 环境变量

- `VITE_API_BASE_URL`：后端 API 的基址，用于前端请求后端
  - 示例（本项目）：`http://localhost:3000/v1`
  - 配置文件位置：`short-url-fronted/.env`

## 页面说明

- 创建页：`/`（`src/pages/Shortener.vue`）
  - 输入原始链接（支持超长 URL）
  - 可选自定义短码
  - 创建成功后仅展示：
    - 后端返回短链（点击“打开”将在新窗口进入该短链）
    - 原始链接
- 跳转页：`/:urlCode`（`src/pages/Redirect.vue`）
  - 从路径参数读取 `urlCode`
  - 调后端 `GET /v1/{urlCode}` 获取原始链接
  - 使用 `window.location.href` 跳转

## 常用命令

```sh
# 类型检查
pnpm type-check

# 代码规范
pnpm lint

# 生产构建
pnpm build

# 预览构建产物
pnpm preview
```

## 主要文件

- 入口：`src/main.ts`
- 路由：`src/router/index.ts`
- 创建页：`src/pages/Shortener.vue`
- 跳转页：`src/pages/Redirect.vue`
- 接口封装：`src/api/http.ts`、`src/api/urlRecord.ts`

## 交互与原理

- “后端返回短链”由后端根据 `PROJECT_URL` 拼接生成，例如 `http://localhost:5173/{code}`
- 用户点击该短链 → 命中前端路由 `/:urlCode` → 前端请求后端原始链接 → 浏览器跳转到原始链接

> 若希望短链点击即服务端 302 直跳，可改造后端 `GET /v1/{urlCode}` 使用 `res.redirect(...)` 并将 `PROJECT_URL` 设置为后端 `/v1` 地址。
