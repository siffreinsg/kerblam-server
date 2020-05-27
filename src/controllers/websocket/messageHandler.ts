import { RegisterEvent } from "./register"
import { WSClient } from "./../../types/websocket"
import { log } from "./../../helpers/log"
import { Data } from "ws"

export const messageHandler = (client: WSClient, message: Data): void => {
    log("TRACE", `(WS) Message received from client ${client.uuid ?? client.address}.`, message)

    if (typeof message !== "string")
        return log("TRACE", `(WS) Client ${client.uuid ?? client.address} sent an invalid message.`)

    let data
    try { data = JSON.parse(message) }
    catch (ex) { return log("TRACE", `(WS) Client ${client.uuid ?? client.address} sent an invalid message.`, ex) }

    switch (data.event) {
        case "REGISTER":
            RegisterEvent(client, data)
            break
        default:
            return log("TRACE", `(WS) Client ${client.uuid ?? client.address} sent an invalid message.`)
    }
}
