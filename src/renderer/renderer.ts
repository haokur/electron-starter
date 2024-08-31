import { createApp } from 'vue';
import App from './App.vue';

import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'element-plus/dist/index.css';

import router from './routers/router';

const app = createApp(App);
app.use(router).use(ElementPlus, {
  locale: zhCn,
});

app.mount('#app');
