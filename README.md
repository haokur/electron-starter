1. 下载官方代码：

[electron/electron-quick-start: Clone to try a simple Electron app (github.com)](https://github.com/electron/electron-quick-start)

2. 修改 .npmrc，加速 electron 下载

```
package-lock=true
registry=https://registry.npmmirror.com/
electron_mirror=https://npmmirror.com/mirrors/electron/
```

3. 安装打包依赖

```
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

4. 启动

```
npm start
```

5. 打包

```
npm run package

# 或,会比npm run package多一个zip包,zip包里是对应可运行程序
npm run make
```