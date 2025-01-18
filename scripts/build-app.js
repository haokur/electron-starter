/**打包app代码：main进程+renderer进程 */
const Path = require("path");
const FileSystem = require("fs");
const { build: viteBuild } = require('vite')
const compileTs = require("./private/tsc");

// 每次打包都自动更新版本。版本+0.01
// const packageJson = require("../package.json");

// let version = packageJson.version;
// let versionNums = version.split(".");
// let lastVersionNum = +versionNums[2] + 1;
// let nextVersion = [versionNums[0], versionNums[1], lastVersionNum].join(".");
// packageJson.version = nextVersion;
// fs.writeFileSync(
//   Path.resolve(process.cwd(), "./package.json"),
//   JSON.stringify(packageJson, null, 2)
// );

/**清除已经打包的产物 */
async function clearAppDist() {
    FileSystem.rmSync(Path.join(__dirname, "..", "build"), {
        recursive: true,
        force: true,
    });
}

function buildRenderer() {
    return viteBuild({
        configFile: Path.join(__dirname, "..", "vite.config.js"),
        base: "./",
        mode: "production",
    });
}

function buildMain() {
    const mainPath = Path.join(__dirname, "..", "src", "main");
    return compileTs(mainPath);
}

module.exports = {
    clearAppDist,
    buildRenderer,
    buildMain
}

// console.log(Chalk.blueBright("Transpiling renderer & main..."));
// Promise.allSettled([buildRenderer(), buildMain()]).then(() => {
//     console.log(
//         Chalk.greenBright(
//             "Renderer & main successfully transpiled! (ready to be built with electron-builder)"
//         )
//     );
// });
