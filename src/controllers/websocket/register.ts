import { log } from "./../../helpers/log"
import { db } from "./../database"
import { isUUID, generateUUID } from "./../../helpers/uuid"
import { WSClient, WSRegisterEventData } from "./../../types/websocket"

export const RegisterEvent = (client: WSClient, data: WSRegisterEventData): void => {
    if (!isUUID(data.uuid))
        client.uuid = generateUUID()
    else
        client.uuid = data.uuid

    const dbclient = db
        .get("clients")
        .find({ uuid: data.uuid })

    if (!dbclient.value()) {
        db.get("clients")
            .push({
                uuid: client.uuid
            })
            .write()
    }

    client.json({
        uuid: client.uuid
    }, (err?: Error) => {
        if (!err) return
        log("TRACE", `An error occured while replying to register event from ${client.uuid ?? client.address}.`, err)
    })
}
