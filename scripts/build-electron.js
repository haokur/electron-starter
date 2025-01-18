const { build } = require("electron-builder");
const config = require('../electron-builder.config')

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