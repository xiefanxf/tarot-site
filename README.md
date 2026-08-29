# 日月塔罗 Solaris Luna

一套包含 78 张牌、经典牌阵与正逆位解读的中文塔罗体验。

## 项目版本

- 网页版：根目录的 React + TypeScript + Vite 项目。
- 小红书小程序版：[`xhs-miniapp/`](./xhs-miniapp/README.md)，使用小红书原生 XHSML、CSS 与 JavaScript。

## 网页版开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 小红书版数据同步

网页牌面数据更新后运行：

```bash
npm run xhs:data
```

具体导入与发布步骤见 `xhs-miniapp/README.md`。
