<template>
  <div>
    <el-button @click="handleOpenDevtool">打开控制台</el-button>
    <el-button @click="getElectronAppConfig">获取</el-button>
  </div>
</template>
<script setup lang="ts">
import { electronEmit } from '../events/events';

function handleOpenDevtool() {
  electronEmit('toggleDevTools', {}, (res) => {
    console.log(res, '切换成功');
  });
}

function getElectronAppConfig() {
  electronEmit('getAppSystemInfo', {}, (res) => {
    console.log(res, 'About.vue::18行');
  });
}
</script>
