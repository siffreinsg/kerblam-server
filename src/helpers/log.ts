export const log = (level: "TRACE" | "INFO" | "WARN" | "ERROR" | string, ...toLog: [unknown, ...unknown[]]): void => {
    if (level === "TRACE" && process.env.NODE_ENV === "production") return

    toLog.unshift(`[${level.padEnd(5)}][${new Date().toLocaleString()}]`)

    switch (level) {
        case "ERROR":
            console.error.apply(undefined, toLog)
            return process.exit(1)
        case "WARN":
            return console.warn.apply(undefined, toLog)
        case "TRACE":
            return console.log.apply(undefined, toLog)
        default:
            return console.info.apply(undefined, toLog)
    }
}
