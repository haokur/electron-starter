### 一、初始化

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

### 二、使用 vite 和 ts

注意点:

- main 和 renderer 包下各一个 ts.config.ts,因为要打包后的结果不一样
- 打包时,生成的目录为 build/main 和 build/renderer
- package.json 中配置的入口(main)为 build/main/main.js
- npm run build, 会先根据根目录 vite.config.js 打包renderer 应用,然后再执行 electron-builder 打包

### main和renderer通信

- 不能直接传递函数回调,使用发布订阅模式,以 action 匹配,发送传递数据,对应端处理回调数据
- 比如调用electron执行切换控制台操作

renderer 调用
```
const toggleDevTools = () => {
  electronEmit('toggleDevTools', {}, (res) => {
    console.log(res, '切换成功');
  });
};
```

main 定义提供方法

```
export function toggleDevTools() {
    const currentWin: any = electronUtil.getCurrentWindow()
    isDevtoolVisible
        ? currentWin.closeDevTools()
        : currentWin.openDevTools()
    isDevtoolVisible = !isDevtoolVisible

    // 调用renderer层的方法.
    electronUtil.showNotice("切换成功~")
    return isDevtoolVisible
}
```

### 三、版本更新

1. 安装依赖项:

```
npm install electron-builder --save-dev
```

2. 配置远程最新软件包服务器地址

electron-builder.json 中

```json
"publish": [
    {
        "provider": "generic",
        "url": "https://oss.haokur.com/electron-app/"
    }
]
```

3. 打包:

```
npm run build
```

4. 在 dist 目录下, 若是 mac 环境则将

-- dist
---- latest-mac.yml
---- electron-starter-1.0.1-mac.zip
---- electron-starter-1.0.1.dmg

以上三个文件,放到服务器如 https://oss.haokur.com/electron-app/ 的目录下

5. 更改 package.json 里的 version 来生成一个版本号,要测更新,则改一个比服务器的低版本
6. 打包完后,打开应用,则会提示更新
![自动更新效果图](https://oss.haokur.com/github/electron-update.png)
