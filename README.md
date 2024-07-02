### 初始化

1. 下载官方代码：

[electron/electron-quick-start: Clone to try a simple Electron app (github.com)](https://github.com/electron/electron-quick-start)

2. 修改 .npmrc，加速 electron 下载

```
package-lock=true
registry=https://registry.npmmirror.com/
electron_mirror=https://npmmirror.com/mirrors/electron/
```

3. 启动

```
npm start
```

4. 打包

```
npm run build
```

### 使用 vite 和 ts

注意点:

- main 和 renderer 包下各一个 ts.config.ts,因为要打包后的结果不一样
- 打包时,生成的目录为 build/main 和 build/renderer
- package.json 中配置的入口(main)为 build/main/main.js
- npm run build, 会先根据根目录 vite.config.js 打包renderer 应用,然后再执行 electron-builder 打包