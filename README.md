# DSH Libido Panel

一个可通过 DSH CLI 安装的标准 **DSH Bundle 插件**。它由 Host 插件、Web 客户端插件和独立的本地状态面板组成。

对话输入框上方显示当前数值、档位和发情期倒计时；Host 插件可按会话白名单注入对应的动态上下文。

## 功能

- **Composer HUD**：在 DSH 对话输入框上方显示 0–100 数值、五档状态、发情期倒计时和近况。
- **动态上下文**：从本机面板读取当前状态，注入 `libido-state` 和 `libido-pending` 两段上下文。
- **会话白名单**：只有配置文件中列出的会话会获得动态上下文。
- **本地面板**：提供状态调整、曲线、近况记录和状态数据接口。
- **可选服务**：本地面板独立运行；服务未启动时 HUD 显示「面板没开」，不会阻塞 DSH 对话。

## 安装

需要一个 DSH profile。HUD 使用 DSH Web 客户端。

### 从 GitHub 安装

```bash
dsh plugin --profile <profile> add github:Swcmb/dsh-libido-panel
```

### 从本地 checkout 安装（推荐用于同时运行面板）

```bash
git clone https://github.com/Swcmb/dsh-libido-panel.git
dsh plugin --profile <profile> add ./dsh-libido-panel
dsh --profile <profile> --dump-config
```

在输出的配置层中确认存在 `dsh-libido-hud`，然后重启对应 profile 的 DSH。

## 启动本地面板

插件不会替用户启动独立服务。面板默认监听 `127.0.0.1:41888`。

在仓库根目录执行：

**Windows**

```powershell
.\panel\start.bat
```

**macOS / Linux**

```bash
node panel/server.mjs
```

浏览器打开 <http://127.0.0.1:41888>。面板服务只绑定本机回环地址。

## 配置会话白名单

在 `~/.dsh/worlds/default/me/发情插件.json` 中填写允许注入动态上下文的会话 ID：

```json
{
  "sessionIds": [
    "session-xxxxxxxx"
  ]
}
```

缺少文件、名单为空或内容无效时，Host 插件不会向任何会话注册动态上下文。此名单只控制对话上下文注入；Web HUD 的显示由客户端插件独立负责。

## 数据与环境变量

状态文件默认位于：

```text
~/.dsh/worlds/default/me/发情状态.json
```

可通过环境变量覆盖：

| 变量 | 作用 |
| --- | --- |
| `LIBIDO_STATE` | 状态 JSON 文件路径 |
| `LIBIDO_OWNER` | 面板显示的名称 |

## 项目结构

```text
index.js                 DSH Host 插件入口
cordis.patch.yml         DSH Bundle 配置层
plugin/client.js         DSH Web 客户端入口
plugin/index.js          Host 侧状态与上下文逻辑
plugin/locale/           插件元数据
plugin/docs/             插件详情
panel/                   独立本地面板服务
发情设定.md               状态与档位规则
安装说明.md               安装和配置步骤
```

## 卸载

```bash
dsh plugin --profile <profile> remove dsh-libido-panel
```

卸载 Bundle 不会自动删除本地状态文件或面板数据。

## 规则说明

数值变化、睡醒结算、事件递减和档位规则见 [发情设定.md](./发情设定.md)。
