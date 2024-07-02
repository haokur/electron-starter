import { BrowserWindow, app } from "electron"
import { exec } from 'child_process'

export const electronUtil = {
    currentWin: null,
    /**设置全量数据 */
    setGlobalData(key: keyof IGlobalData, value) {
        global[key] = value
    },
    /**获取全量数据 */
    getGlobalData(key: keyof IGlobalData) {
        return global[key]
    },
    /**设置AppConfig配置信息 */
    setAppConfig(data) {
        this.setGlobalData("AppConfig", data)
    },
    /**获取AppConfig配置信息 */
    getAppConfig(): IAppConfig {
        return this.getGlobalData("AppConfig")
    },
    /**通过key获取配置信息 */
    getAppConfigByKey<T extends keyof IAppConfig>(key: T): IAppConfig[T] {
        return global.AppConfig[key]
    },
    /**获取用户安装app的目录 */
    getAppPath() {
        return app.getAppPath();
    },
    /**获取用户数据的目录 */
    getUserDataPath() {
        return app.getPath("userData");
    },
    // 获取当前窗口实例
    getCurrentWindow(): BrowserWindow {
        if (this.currentWin) return this.currentWin
        const currentWin: any = BrowserWindow.getFocusedWindow()
        this.currentWin = currentWin
        return currentWin
    },
    // 向C端发送事件消息
    sendMessage2Render(action, result) {
        const currentWin = this.getCurrentWindow()
        currentWin.webContents.send("fromMain", {
            action,
            result,
        });
    },
    // 基于sendMessage2Render,封装向C端显示通知消息
    showNotice(message: string, type: string = 'success') {
        this.sendMessage2Render("showNotice", {
            message,
            type,
        })
    },
    // 运行命令
    runCmd(cmd: string = '', cwd: string = '') {
        return new Promise((resolve, reject) => {
            console.log(`执行命令:${cmd}--------start`);
            exec(cmd, { cwd: cwd }, (error, stdout, stderr) => {
                if (error) {
                    console.error("error:", error);
                    return;
                } else {
                    console.log("stdout: " + stdout);
                    console.log("stderr: " + stderr);
                    resolve(true);
                }
            });
        });
    }
}