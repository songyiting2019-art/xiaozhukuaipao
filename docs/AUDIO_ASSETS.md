# 音效资产清单

本文件记录已放入 `assets/audio/` 的正式音频资源。候选试听文件保留在 `assets/audio/preview/`，原始 wav 保留在 `assets/audio/source/`。

| 文件名 | 用途 | 触发时机 | 是否已接入游戏 | 备注 |
| --- | --- | --- | --- | --- |
| `bgm-home-farm-light-v1.mp3` | 主页背景音乐 | 玩家首次交互后，停留在开始页时播放 | 是 | 低音量循环；后续可再做无缝循环优化 |
| `bgm-game-pasture-cheer-v2.mp3` | 游戏背景音乐 | 玩家开始关卡、进入试玩关卡后播放 | 是 | 比 v1 更轻快；低音量循环；页面切后台会暂停 |
| `sfx-button-tap-light-v3.mp3` | 通用按钮点击 | 开始、重玩、下一关、道具按钮等普通按钮点击 | 是 | 替换 v2，更轻更短；高频音效，已做轻节流 |
| `sfx-button-back-soft-v1.mp3` | 返回/关闭按钮 | 返回主页、关闭收藏馆、关闭解锁展示 | 是 | 用于退出类反馈 |
| `sfx-collection-select-soft-v1.mp3` | 收藏馆选择 | 打开收藏馆、切换分类、选择收藏项、查看解锁提示 | 是 | 高频音效，音量偏轻 |
| `sfx-pig-tap-tiny-oink-v2b.mp3` | 小猪点选 | 点击小猪准备移动或作为道具目标 | 是 | 采用候选 B；比旧版更短更轻，保留一点小猪感 |
| `sfx-pig-run-grass-v1.mp3` | 小猪跑动 | 小猪开始跑出牧场或炮仗触发连跑 | 是 | 高频动作音，已节流避免叠加过吵 |
| `sfx-pig-exit-gate-v1.mp3` | 小猪进门/得分 | 小猪沿路跑到门口节点 | 是 | 触发点已从草坪边缘后移到门口；高频动作音，已节流 |
| `sfx-pig-hit-dizzy-v1.mp3` | 撞击眩晕 | 小猪撞到阻挡并进入眩晕反馈 | 是 | 撞击点触发 |
| `sfx-tool-remove-pop-v1.mp3` | 移除道具 | 移除小猪成功 | 是 | 道具低频反馈 |
| `sfx-tool-flip-woosh-v1.mp3` | 翻转道具 | 小猪开始翻转方向 | 是 | 道具低频反馈 |
| `sfx-tool-stimulant-zap-v1.mp3` | 兴奋剂道具 | 兴奋剂生效、蓄力开始 | 是 | 道具低频反馈 |
| `sfx-firecracker-pop-v1.mp3` | 炮仗能力 | 炮仗成功点燃、群体逃跑前 | 是 | 重要反馈，峰值已压低 |
| `sfx-combo-pop-v1.mp3` | 连击加分 | 分数/连击气泡弹出 | 是 | 高频奖励音，已节流 |
| `sfx-level-complete-stars-v1.mp3` | 通关结算 | 通关弹窗展示星级 | 是 | 结算奖励音 |
| `sfx-unlock-sparkle-v1.mp3` | 收藏馆解锁展示 | 新道具/能力解锁展示弹层出现 | 是 | 重要奖励音 |

## 归档记录

| 文件名 | 原用途 | 当前位置 | 备注 |
| --- | --- | --- | --- |
| `bgm-game-pasture-soft-v1.mp3` | 游戏背景音乐 v1 | `assets/audio/archive/` | 听感偏沉，已由 `bgm-game-pasture-cheer-v2.mp3` 替换 |
| `sfx-button-tap-soft-v1.mp3` | 通用按钮点击 v1 | `assets/audio/archive/` | 听感像报错提示，后续版本已继续减轻 |
| `sfx-button-tap-wood-v2.mp3` | 通用按钮点击 v2 | `assets/audio/archive/` | 仍偏重，已由 `sfx-button-tap-light-v3.mp3` 替换 |
| `sfx-pig-tap-snort-v1.mp3` | 小猪点选 v1 | `assets/audio/archive/` | 鼻音感偏明显，已由 `sfx-pig-tap-tiny-oink-v2b.mp3` 替换 |
