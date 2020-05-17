import { log } from "./helpers/log"
import { existsSync, readFileSync } from "fs"
import {safeLoad} from "js-yaml"

if (typeof process.env.NODE_ENV != "string" || process.env.NODE_ENV === "")
    process.env.NODE_ENV = "production"

if (!existsSync("configs/config.yml")) {
    log("ERROR", "No config.yml file found in configs/ folder. Create one from the example one.")
}


let configYaml
try {
    configYaml = safeLoad(readFileSync("configs/config.yml", "utf8"))
} catch (e) {
    log("ERROR", "An error occured when fetching config.", e)
}

interface Config {
    app: {
        port: number;
    };
    services: {
        youtube: {
            enabled: true;
            apiKey: string;
        };
    };
}

export const config: Config = configYaml
log("TRACE", "Config loaded.")
