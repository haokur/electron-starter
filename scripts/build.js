const fs = require("fs");
const Path = require("path");
const Chalk = require("chalk");
const FileSystem = require("fs");
const Vite = require("vite");
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

// function buildRenderer() {
//   return Vite.build({
//     configFile: Path.join(__dirname, "..", "vite.config.js"),
//     base: "./",
//     mode: "production",
//   });
// }

// function buildMain() {
//   const mainPath = Path.join(__dirname, "..", "src", "main");
//   return compileTs(mainPath);
// }

// FileSystem.rmSync(Path.join(__dirname, "..", "build"), {
//   recursive: true,
//   force: true,
// });

// console.log(Chalk.blueBright("Transpiling renderer & main..."));

// Promise.allSettled([buildRenderer(), buildMain()]).then(() => {
//   console.log(
//     Chalk.greenBright(
//       "Renderer & main successfully transpiled! (ready to be built with electron-builder)"
//     )
//   );
// });


const { buildElectronApp } = require('./build-electron');
const { withTimeLogExec } = require("./private/helper");
const { buildRenderer, buildMain, clearAppDist } = require("./build-app");

async function buildRenderAndMain() {
  await Promise.allSettled([buildRenderer(), buildMain()]).then(() => {
    console.log(
      Chalk.greenBright(
        "Renderer & main successfully transpiled! (ready to be built with electron-builder)"
      )
    );
  });
}

async function runAllPack() {
  await clearAppDist()
  await withTimeLogExec(buildRenderAndMain)
  await withTimeLogExec(buildElectronApp)
}

withTimeLogExec(runAllPack)