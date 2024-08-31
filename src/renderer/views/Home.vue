<template>
  <div class="App">
    <el-dialog v-model="updaterAppInfo.visible" :title="updaterAppInfo.title" width="30%">
      <div class="mb16">{{ updaterAppInfo.content }}</div>
      <div v-if="isDownloadProgress">
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="updaterAppInfo.percentage"
          status="success"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updaterAppInfo.visible = false">
            {{ isDownloadProgress ? '隐藏' : '取消' }}
          </el-button>
          <el-button type="primary" @click="handleUpdaterAction" v-if="!isDownloadProgress">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <button @click="toggleDevTools">点击切换控制台</button>
    <!-- <el-button @click="getElectronAppConfig">获取</el-button> -->
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRefs } from 'vue';

import { electronEmit, initElectronListener, removeAllElectronEvent } from '../events/events';
import { bindKeyboardEvent } from '../events/keyboard.handler';
import { useVersionStore } from '../stores/version';
const { updaterAppInfo, isDownloadProgress, updateAppVersionInfo } = toRefs(useVersionStore());

// 测试
function testUpdate() {
  updateAppVersionInfo.value({
    visible: true,
    key: 'downloadProgress',
    title: '版本提示',
    content: '程序包下载中，可以点击隐藏按钮关掉弹窗，在下载成功后会弹出安装提示...',
    percentage: 30,
  });
}

onMounted(() => {
  // testUpdate();
});

const toggleDevTools = () => {
  electronEmit('toggleDevTools', {}, (res) => {
    console.log(res, '切换成功');
  });
};

// 现在更新app
function handleUpdaterAction() {
  let { key } = updaterAppInfo.value;
  if (key === 'updateAvailable') {
    electronEmit('electronUpdaterDownload');
  } else if (key === 'updateDownloaded') {
    electronEmit('electronUpdaterInstall');
  }
  updaterAppInfo.value.visible = false;
}

// function getElectronAppConfig() {
//   electronEmit('getAppSystemInfo', {}, (res) => {
//     console.log(res, 'About.vue::18行');
//   });
// }

onMounted(() => {
  bindKeyboardEvent();
  initElectronListener();
});

onBeforeUnmount(() => {
  removeAllElectronEvent();
});
</script>
