# DSH Libido Panel

一个标准 **DSH Bundle 插件**，由 Host 插件、Web 客户端 HUD 和独立的本地状态面板组成。

HUD 显示当前数值、状态档位和周期倒计时；Host 插件按会话白名单，将本地状态转换为两段动态上下文。

## 功能

- **Composer HUD**：在 DSH 对话输入框上方显示 0–100 数值、档位、周期状态和近况。
- **动态上下文**：提供 `libido-state` 与 `libido-pending` 两段上下文。
- **会话白名单**：只对配置文件列出的会话注入动态上下文。
- **本地面板**：提供状态曲线、事件调整、近况记录和 HTTP API。
- **独立运行**：面板服务单独启动；服务未启动时 HUD 显示「面板没开」，不影响 DSH 对话。

## 安装

需要已安装 DSH CLI，并使用 DSH Web profile。

```bash
dsh plugin --profile <profile> add github:Swcmb/dsh-libido-panel
```

验证 Bundle 配置：

```bash
dsh --profile <profile> --dump-config
```

输出中应包含 `dsh-libido-hud`。随后重启对应 profile 的 DSH。

本地开发时，也可以从 checkout 安装：

```bash
git clone https://github.com/Swcmb/dsh-libido-panel.git
dsh plugin --profile <profile> add ./dsh-libido-panel
```

## 启动本地面板

面板默认监听 `127.0.0.1:41888`，无需安装 npm 依赖。

**Windows**

```powershell
.\panel\start.bat
```

**PowerShell 后台启动**

```powershell
.\panel\start-hidden.ps1
```

**macOS / Linux**

```bash
npm start
# 或
node panel/server.mjs
```

浏览器访问 <http://127.0.0.1:41888>。

## 配置会话白名单

编辑 `~/.dsh/worlds/default/me/发情插件.json`：

```json
{
  "sessionIds": [
    "session-xxxxxxxx"
  ]
}
```

将示例 ID 替换为实际会话 ID，可以填写多个。缺少配置文件、名单为空或内容无效时，Host 插件不会注入动态上下文。

修改名单后重启 DSH Host。白名单只控制 Host 侧上下文注入，Web HUD 独立显示。

## 数据位置

默认状态文件：

```text
~/.dsh/worlds/default/me/发情状态.json
```

| 环境变量 | 作用 |
| --- | --- |
| `LIBIDO_STATE` | 覆盖状态 JSON 文件路径 |
| `LIBIDO_OWNER` | 设置面板显示名称 |

修改状态：

```bash
node panel/set.mjs
node panel/set.mjs +8 "event"
node panel/set.mjs -20 "event"
node panel/set.mjs 睡醒
```

## 项目结构

```text
.
├── index.js
├── cordis.patch.yml
├── package.json
├── plugin/
│   ├── client.js
│   ├── index.js
│   ├── icon.svg
│   └── locale/
├── panel/
│   ├── index.html
│   ├── server.mjs
│   ├── set.mjs
│   └── start scripts
└── docs/
    ├── DETAIL.md
    ├── INSTALL.md
    ├── ORIGIN.md
    └── RULES.md
```

## 文档

- [安装与配置](docs/INSTALL.md)
- [功能说明](docs/DETAIL.md)
- [状态与行为规则](docs/RULES.md)
- [项目来源与授权说明](docs/ORIGIN.md)

## 卸载

```bash
dsh plugin --profile <profile> remove dsh-libido-panel
```

卸载 Bundle 不会删除本地状态文件或配置。
