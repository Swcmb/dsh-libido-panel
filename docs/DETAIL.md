# 性欲值

在 DSH 对话输入框上方显示当前数值、一根细条、档位名，以及距发情期还有几天（发情期内显示「第 N 天」）。

```text
18 ▬▬▬▬░░░░░░  平静   3 天后
```

## 数据从哪来

插件不保存状态。它每 30 秒向本机的 `http://127.0.0.1:41888/api/state` 请求一次：

| 项目 | 位置 |
| --- | --- |
| 服务 | `panel/server.mjs`（也可使用 `panel/start.bat`） |
| 状态文件 | `~/.dsh/worlds/default/me/发情状态.json` |
| 规则 | `RULES.md` |

服务未启动时，HUD 显示「面板没开」，不会阻塞输入或对话。

## 怎么让它变

这个插件只负责显示和注入当前状态，不负责直接调整数值。可通过面板或仓库中的 `panel/set.mjs` 修改状态：

```text
node panel/set.mjs                 看现在多少
node panel/set.mjs +8 摸尾巴        涨 8 并记一条事件
node panel/set.mjs -20 难过         落 20
node panel/set.mjs 解决             直接归 10
node panel/set.mjs 睡醒             记录睡醒
```

## 会话范围

HUD 在 Web 客户端显示。Host 侧动态上下文由 `~/.dsh/worlds/default/me/发情插件.json` 中的 `sessionIds` 白名单控制；未列入的会话不会注册这两段上下文。
