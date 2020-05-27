import { Config, Channel } from "../types/config"
import { log } from "../helpers/log"
import { existsSync, readFileSync } from "fs"
import { safeLoad } from "js-yaml"

if (typeof process.env.NODE_ENV !== "string" || process.env.NODE_ENV === "") {
    process.env.NODE_ENV = "production"
    log("INFO", "Node environment no set. Asssuming a production environment.")
} else {
    log("TRACE", `Node environment currently set to ${process.env.NODE_ENV}`)
}

if (!existsSync("configs/config.yml"))
    log("ERROR", "No config.yml file found in configs/ folder. Create it from the config.example.yml file.")
if (!existsSync("configs/channels.yml"))
    log("ERROR", "No channels.yml file found in configs/ folder. Create it from the channels.example.yml file.")



log("TRACE", "Loading config and channels...")

let configYaml, channelsYaml
try {
    configYaml = safeLoad(readFileSync("configs/config.yml", "utf8"))
    channelsYaml = safeLoad(readFileSync("configs/channels.yml", "utf8"))
} catch (e) {
    log("ERROR", "An error occured when fetching config files.", e)
}

export const config: Config = configYaml
export const channels: { [key: string]: Channel } = channelsYaml
log("TRACE", "Config loaded.")
