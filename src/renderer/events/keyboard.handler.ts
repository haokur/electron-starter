import Mousetrap from "mousetrap";
import { electronEmit } from "../events/events";

/**键盘快捷键绑定 */
const keyboardMap = {
    "command+shift+i": "toggleDevTools"
}

// 绑定键盘事件
export function bindKeyboardEvent() {
    Object.keys(keyboardMap).forEach(key => {
        Mousetrap.bind(key, () => {
            electronEmit(keyboardMap[key])
        });
    })
}