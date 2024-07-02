import { contextBridge, ipcRenderer } from 'electron';

// 注册到$electron,给renderer使用
contextBridge.exposeInMainWorld('$electron', {
  $on: ipcRenderer.on.bind(ipcRenderer),
  $emit(action: string, ...args: any) {
    ipcRenderer.send('preload', action, ...args)
  },
  // TODO:暂时不知道,为什么移除不掉
  $remove: ipcRenderer.removeListener.bind(ipcRenderer),
  // 可用,移除renderer(Vue应用)所有监听
  $removeAll: ipcRenderer.removeAllListeners.bind(ipcRenderer),
})
