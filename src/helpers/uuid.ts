const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

export const generateUUID = (): string => {
    let dt = new Date().getTime()

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16)
    })
}

export const isUUID = (input: unknown): boolean => {
    if (typeof input !== "string")
        return false

    return uuidRegex.test(input)
}
