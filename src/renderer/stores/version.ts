import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useVersionStore = defineStore('updaterAppInfo', () => {
    const updaterAppInfo = ref({
        visible: false,
        key: "updateAvailable",
        title: "版本提示",
        content: "有新的版本可以使用，是否现在下载更新？",
        percentage: 0,
    })

    const updateAppVersionInfo = (config) => {
        updaterAppInfo.value = {
            ...updaterAppInfo.value,
            ...config
        }
    }

    const isDownloadProgress = computed(() => {
        return updaterAppInfo.value.key === "downloadProgress";
    });

    return { updaterAppInfo, isDownloadProgress, updateAppVersionInfo }
})
