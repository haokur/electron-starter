module.exports = {
    "appId": "com.electron.starter",
    "directories": {
        "output": "dist"
    },
    "publish": [
        {
            "provider": "generic",
            "url": "https://static.haokur.com/electron-app/"
        }
    ],
    "nsis": {
        "oneClick": false,
        "perMachine": false,
        "allowToChangeInstallationDirectory": true,
        "shortcutName": "Electron App"
    },
    "win": {
        "target": "nsis"
    },
    "linux": {
        "target": [
            "snap"
        ]
    },
    "mac": {
        "target": "dir"
    },
    "files": [
        "build/main/**/*",
        {
            "from": "build/renderer",
            "to": "renderer",
            "filter": [
                "**/*"
            ]
        },
        {
            "from": "src/main/static",
            "to": "static",
            "filter": [
                "**/*"
            ]
        },
        "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
        "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
        "!**/node_modules/*.d.ts",
        "!**/node_modules/.bin",
        "!src",
        "!config",
        "!README.md",
        "!scripts",
        "!build/renderer",
        "!dist"
    ],
    "beforeBuild": "./scripts/electron-builder-hooks/before-build.js"
}