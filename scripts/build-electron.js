const { build } = require("electron-builder");

const config = {
    appId: "com.example.app",
    "asar": false,
    directories: {
        output: "release"
    },
    files: [
        "**/*",  // 包括所有文件
        "!node_modules/.bin",  // 排除 .bin 文件
        "node_modules/**/*"   // 确保包含 node_modules 目录
    ],
    extraResources: [
        {
            from: "node_modules/",  // 从根目录下的 node_modules 目录拷贝
            to: "node_modules/",    // 拷贝到打包后的路径
            filter: ["**/*"]        // 只拷贝必要的文件
        }
    ],
    mac: {
        target: ["dir"]
    },
}

async function buildElectronApp() {
    return build({ config })
        .then(() => {
            console.log("构建成功！");
        })
        .catch((error) => {
            console.error("构建失败：", error);
        });
}

module.exports = {
    buildElectronApp
}