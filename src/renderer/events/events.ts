/**监听来自electron的消息 */
import * as DefaultEventHandler from './event-handler'

const EventListeners = {}

/**动态添加监听electron主进程的事件 */
export function addElectronEvent(key, callback) {
    if (!callback) return
    if (!Array.isArray(EventListeners[key])) {
        EventListeners[key] = []
    }
    EventListeners[key].push(callback)
}


/**删除对主进程的事件的监听 */
export function removeElectronEvent(key, callback) {
    if (!callback) return
    if (EventListeners[key]) {
        EventListeners[key] = EventListeners[key].filter(item => item !== callback)
    }
}

/**清除所有监听 */
export function removeAllElectronEvent() {
    Object.keys(EventListeners).forEach(key => {
        EventListeners[key] = []
    })
    $electron.$removeAll()
}

/**监听到事件，遍历执行 */
function handleListenElectronMain(...args) {
    let [_, message = {}] = args
    let { action, result } = message
    if (action && Array.isArray(EventListeners[action])) {
        EventListeners[action].forEach(fn => {
            fn(result)
        })
    }
}

/**初始化监听从electron的main进程给render发送通知对应响应操作 */
export function initElectronListener(defaultEvents = DefaultEventHandler) {
    Object.keys(defaultEvents).forEach(key => {
        addElectronEvent(key, defaultEvents[key])
    })
    $electron.$on("fromMain", handleListenElectronMain)
}

/**提交事件给electron应用主进程 */
export function electronEmit(eventAction: EventAction, config?: any, callback?: Function) {
    console.log(eventAction, config, "electron.emit.ts::53行");
    // 如果有回调
    if (callback) {
        addElectronEvent(eventAction, callback)
    }
    $electron.$emit(eventAction, config)
}
