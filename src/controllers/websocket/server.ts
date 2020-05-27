import { WSClient } from "./../../types/websocket"
import { messageHandler } from "./messageHandler"
import { log } from "../../helpers/log"
import { config } from "../config"
import { Server, OPEN } from "ws"

export const server = new Server({
    port: config.server.port ?? 80,
    path: config.server.path ?? "/websocket",
    clientTracking: true
})

server.on("listening", () => log("TRACE", `(WS) Listening on ${config.server.port}.`))
server.on("connection", (client: WSClient, req) => {
    const address = typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"].split(/\s*,\s*/)[0] : req.connection.remoteAddress
    log("TRACE", `(WS) New client connected from ${address}.`)

    client.address = address

    client.json = (data: unknown, cb: (err?: Error) => void): void => {
        let payload
        try { payload = JSON.stringify(data) }
        catch (ex) { return cb(ex) }

        client.send(payload, cb)
    }

    client.on("message", message => messageHandler(client, message))
    client.on("close", () => log("TRACE", `(WS) Client disconnected from ${address}`))
})

export const broadcast = (data: unknown): void => {
    server.clients.forEach(client => {
        if (client.readyState === OPEN) {
            client.send(data, (err) => {
                if (err) log("TRACE", "(WS) An error occured while sending data to client.", err)
            })
        }
    })
}
