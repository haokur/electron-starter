/**
 * 仅作为收集event-handler导出的所有方法
 * 给render层发送信息方法，不需要再添加扩展
 * 固定下来的文件。
 */
import { ipcMain } from 'electron';

import { electronUtil } from '../utils/electron.util';

import * as eventHandlerFuncs from './event-handlers'

export function injectListenEvents(win) {
    // 监听从preload传递的消息
    ipcMain.on("preload", async (_, action, ...args) => {
        if (!action) {
            throw "请传入action参数"
        }
        if (action && eventHandlerFuncs[action]) {
            let result = await eventHandlerFuncs[action](...args, win)
            console.log(`${action}的响应结果为\n${result}`);
            if (typeof result === 'object') {
                console.log(JSON.stringify(result), "events.ts::17行");
            }
            // 发送给C端
            electronUtil.sendMessage2Render(action, result)
        } else {
            throw `action为${action},未找到该action的方法,请检查`
        }
    })
}