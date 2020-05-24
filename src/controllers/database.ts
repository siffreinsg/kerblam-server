import { log } from "./../helpers/log"
import { config } from "./config"
import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"

log("TRACE", "Loading database...")

export const db = low(new FileSync("KerblamDB.json"))

db.defaults({
    services: {
        twitch: {
            accessToken: config.services.twitch.accessToken
        }
    }
}).write()

log("TRACE", "Database loaded!")
