import { KerblamDB } from "./../types/database"
import { log } from "./../helpers/log"
import { config } from "./config"
import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"

log("TRACE", "Loading database...")

export const db = low(new FileSync<KerblamDB>("KerblamDB.json"))

db.defaults({
    services: {
        twitch: {
            accessToken: config.services.twitch.accessToken
        }
    },
    clients: []
}).write()

log("TRACE", "Database loaded!")
