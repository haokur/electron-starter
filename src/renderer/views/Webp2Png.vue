<template>
  <div class="webp">
    <div class="webp-upload">
      <el-upload
        class="upload-demo"
        :auto-upload="false"
        drag
        multiple
        @change="handleChange"
        :show-file-list="false"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      </el-upload>
    </div>
    <div class="webp-list">
      <div class="webp-actions">
        <el-button @click="clearAllRecord" type="primary">清除所有</el-button>
      </div>
      <el-table :data="currentFiles" style="width: 100%">
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="文件名" />
        <el-table-column label="转换状态" width="180">
          <template #default="scope">
            {{ StatusMap[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="180">
          <template #default="scope">
            <el-button
              link
              type="primary"
              v-show="scope.row.status === 2"
              @click="openInDir(scope.row)"
            >
              打开文件所在文件
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, toRaw } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue';
import ipcHelperUtil from '../utils/ipc-helper.util';
import { v4 as uuidv4 } from 'uuid';

enum FileStatus {
  Wait = 1,
  Success = 2,
  Failed = 3,
}

const StatusMap = {
  [FileStatus.Wait]: '等待中',
  [FileStatus.Success]: '成功',
  [FileStatus.Failed]: '失败',
};

interface IDropFileItem {
  id: string;
  path: string;
  size: number;
  name: string;
  status: FileStatus.Wait | FileStatus.Success | FileStatus.Failed; // 0等待中，1成功，2失败
  resultPath: string;
}
const currentFiles = ref<IDropFileItem[]>([]);

const clearAllRecord = () => {
  currentFiles.value = [];
};

const handleChange = (ev) => {
  const currentFile = toRaw(ev);
  const id = uuidv4();
  const newFile = {
    id,
    name: currentFile.name,
    path: currentFile.raw.path,
    size: currentFile.raw.size,
    status: FileStatus.Wait,
    resultPath: '',
  };
  currentFiles.value.push(newFile);
  // 发送给主进程处理
  ipcHelperUtil.ipcRun('webp2Png', newFile, (config) => {
    console.log(config, 'Webp2Png.vue::85行');
    // newFile.status = result ? FileStatus.Success : FileStatus.Failed;
    currentFiles.value.forEach((item) => {
      if (item.id === id) {
        const { result, resultPath } = config;
        item.status = result ? FileStatus.Success : FileStatus.Failed;
        if (item.status === 2) {
          item.resultPath = resultPath;
        }
      }
    });
  });
};

const openInDir = (item: IDropFileItem) => {
  ipcHelperUtil.ipcRun('openFileOrDir', { filePath: item.resultPath });
};

onMounted(() => {});
</script>
<style lang="scss" scoped>
.webp {
  &-actions {
    margin: 8px;
  }
}
</style>
