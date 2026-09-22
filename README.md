# 月蓝琉璃工作台（Moonblue Glass Workbench）

> 本地优先的个人工作台桌面应用 —— 任务、财务、健康、日记、专注、英语、图书、笔记，一站式管理，**数据全部存本机文件，无云端服务、无需联网**。

![仪表盘](docs/screenshots/dashboard.png)

## 特性总览

| 模块 | 说明 |
|---|---|
| 📊 仪表盘 | 今日概览、本周节奏、本月结余、心情信号 |
| 📋 时间计划 | 任务（可重复）与日程（固定时间/地点/时长） |
| 💰 收支记录 | 预算、分类图表、近 6 月趋势、账单 CSV 导入 |
| ❤️ 健康管理 | 步数、睡眠、心率、饮水 |
| 📔 心情日记 | 心情打卡 + 心情日历 + Markdown 日记 |
| ⏱️ 专注记录 | 番茄钟，可关联任务 |
| 🔤 英语学习 | 间隔重复背单词 |
| 📚 图书库 | TXT/Markdown 阅读、笔记、划线 |
| 📝 便签笔记 | TXT/Markdown/JSON 导入、拖拽排序 |
| 🎉 节日标记 | 农历/阳历节日 + 调休补班 |
| 🔔 提醒 | 到点/提前提醒、系统通知、开机自启、托盘常驻 |
| 🌙 深色模式 | 一键切换浅色/深色 |
| 💾 自动备份 | 退出时 + 每天备份，损坏自动恢复 |

## 功能详解

### 📊 仪表盘
今日任务完成度、本周专注时长、本月结余、今日安排一眼尽收，右侧是心情信号卡片。
![仪表盘](docs/screenshots/dashboard.png)

### 📋 时间计划
任务和日程分开管理：任务有「待完成/已完成」状态、可设置重复；日程记录固定时间、地点和时长。周视图快速切换日期、同时查看任务与日程。
![时间计划](docs/screenshots/tasks.png)

### 💰 收支记录
记一笔、设预算、看分类占比和近 6 月收支趋势；支持导入微信/支付宝导出的账单 CSV，按交易号自动去重。
![收支记录](docs/screenshots/finance.png)

### ❤️ 健康管理
记录步数、睡眠、心率、饮水，本周活力趋势一览。
![健康管理](docs/screenshots/health.png)

### 📔 心情日记
四种心情快速打卡，心情日历按月展示，日记支持 Markdown 编辑与标签。
![心情日记](docs/screenshots/diary.png)

### ⏱️ 专注记录
番茄学习模式：25/45/60 分钟，可关联任务，完成后写入专注记录。
![专注记录](docs/screenshots/focus.png)

### 🔤 英语学习
今日单词 + 间隔重复复习（按记忆曲线安排到期复习）。
![英语学习](docs/screenshots/english.png)

### 📚 图书库
导入 TXT / Markdown 图书，分页阅读、读书笔记与划线。
![图书库](docs/screenshots/library.png)

### 📝 便签笔记
导入 TXT / Markdown / JSON 笔记，卡片拖拽排序。
![便签笔记](docs/screenshots/notes.png)

### 🎉 节日标记
心情日历和任务周视图自动标记农历/阳历节日与调休补班。
![节日标记](docs/screenshots/festival.png)

### 🌙 深色模式
设置里一键切换浅色/深色主题。
![深色模式](docs/screenshots/dark.png)

## 技术栈

- **前端**：Vite + React 18 + TypeScript
- **UI**：Radix UI + shadcn 风格组件 + Tailwind CSS
- **桌面**：Tauri 2（Rust 后端，打包为 Windows NSIS 安装版）
- **数据**：本地 JSON 文件 + 大文本拆分存储

## 数据存储

采用便携模式，数据存放在程序（exe）同级的 `data/` 目录，整包拷贝即可迁移：

- `workbench-data.json` — 主数据
- `content/` — 图书/笔记正文（大文本拆分存储）
- `backups/` — 自动备份（退出时 + 每天，保留最近 10 份；正文以硬链接共享，多份备份不重复占用磁盘）

首次以便携模式启动时，若检测到旧版 AppData 数据会自动迁移过来。换电脑迁移：直接拷贝整个应用目录（含 `data/`），或在应用内「数据备份」导出 JSON → 新电脑「数据备份」导入。

## 本地开发

```bash
npm install          # 安装依赖（Node 18+，并需 Rust 工具链 1.77+）
npx tauri dev        # 启动桌面应用（自动拉起 vite 前端并打开窗口）
npx vite --host 127.0.0.1 --port 5173   # 仅起前端开发服务器
npm test             # 单测（账单 CSV 解析）
npm run lint         # 类型检查 + Biome 代码规范检查
npx tauri build      # 打包 Windows 安装版（NSIS，自动先构建前端产物）
```

## 目录结构

```
├── src/                 # React 前端源码
│   └── workbench/       # 工作台核心（context/storage/pages/overlays）
│       └── pages/       # 各页面（dashboard/tasks/finance/… 10 个页面）
├── src-tauri/           # Tauri 2 Rust 后端（数据读写/备份恢复、托盘/通知、更新检查等）
├── scripts/             # 辅助脚本（图标生成、截图）
├── build/               # 应用图标源文件
├── docs/screenshots/    # README 配图
└── tauri.conf.json      # Tauri 打包配置
```

## 隐私

应用完全本地运行：无云端服务、无遥测、不上传任何个人数据。仅「调休」功能会向 `timor.tech` 拉取节假日数据（请求只含年份、不含个人数据，失败静默降级为只显示传统节日）。
