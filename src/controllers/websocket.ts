import { log } from "./../helpers/log"
import { config } from "./config"
import { Server, OPEN } from "ws"

export const server = new Server({
    port: config.server.port ?? 80,
    path: config.server.path ?? "/websocket",
    clientTracking: true
})

server.on("listening", () => log("TRACE", `(WS) Listening on ${config.server.port}.`))
server.on("connection", (client, req) => {
    log("TRACE", `(WS) New client connected on ${req.connection.remoteAddress}.`)
})

export const broadcast = (data: unknown): void => {
    server.clients.forEach(client => {
        if (client.readyState === OPEN) client.send(data)
    })
}
