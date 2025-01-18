const { build } = require("electron-builder");
const config = require('../electron-builder.config')

// const config = {
//     appId: "com.example.app",
//     "asar": true,
//     directories: {
//         output: "release"
//     },
//     // mac: {
//     //     target: ["dir"]
//     // },
// }

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