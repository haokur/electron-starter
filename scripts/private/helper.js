module.exports = {
    async withTimeLogExec(callback, name) {
        const execName = name || callback.name || "exec_" + Date.now()
        const logTimeText = `【${execName}】执行耗时`
        console.log(`\n【${execName}】开始执行>>>>>>`)
        console.time(logTimeText)
        await callback()
        console.timeEnd(logTimeText)
        console.log("\n");
    }
}