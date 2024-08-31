<template>
  <div>
    <el-button @click="handleOpenDevtool">打开控制台</el-button>
    <el-button @click="getElectronAppConfig">获取版本信息</el-button>
  </div>
</template>
<script setup lang="ts">
import { electronEmit } from '../events/events';
import ipcHelperUtil from '../utils/ipc-helper.util';

function handleOpenDevtool() {
  // electronEmit('toggleDevTools', {}, (res) => {
  //   console.log(res, '切换成功');
  // });
  ipcHelperUtil.ipcRun('toggleDevTools', {}, (result) => {
    console.log(result, '切换成功');
  });
}

function getElectronAppConfig() {
  ipcHelperUtil.ipcRun('getAppSystemInfo', {}, (result) => {
    console.log(result, 'About.vue::19行');
  });
  // electronEmit('getAppSystemInfo', {}, (res) => {
  //   console.log(res, 'About.vue::18行');
  // });
}
</script>
