import { Config } from "./types/config"
import { log } from "./helpers/log"
import { existsSync, readFileSync } from "fs"
import {safeLoad} from "js-yaml"

if (typeof process.env.NODE_ENV !== "string" || process.env.NODE_ENV === "") {
    process.env.NODE_ENV = "production"
    log("INFO", "Node environment no set. Asssuming a production environment.")
} else {
    log("TRACE", `Node environment currently set to ${process.env.NODE_ENV}`)
}

if (!existsSync("configs/config.yml")) {
    log("ERROR", "No config.yml file found in configs/ folder. Create it from the config.example.yml file.")
}

log("TRACE", "Loading config...")

let configYaml
try {
    configYaml = safeLoad(readFileSync("configs/config.yml", "utf8"))
} catch (e) {
    log("ERROR", "An error occured when fetching config.", e)
}

export const config: Config = configYaml
log("TRACE", "Config loaded.")
