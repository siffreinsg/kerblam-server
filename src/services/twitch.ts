import { db } from "./../controllers/database"
import { config } from "../controllers/config"
import axios, { AxiosError } from "axios"
import { Stream, Game } from "../types/twitch"
import { isArray, inspect } from "util"
import { log } from "../helpers/log"

if (config.services.twitch.enabled)
    log("INFO", "Twitch service enabled.")

if (config.services.twitch.enabled && (typeof config.services.twitch.clientId !== "string" || typeof config.services.twitch.clientSecret !== "string"))
    log("ERROR", "Twitch service is enabled but client id or secret has not been provided. Disable the service or verify the config.")

let accessToken: string = db.get("services.twitch.accessToken").value()

async function refreshAccessToken(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!config.services.twitch.enabled)
            return reject(new Error("SERVICE_NOT_ENABLED"))

        log("TRACE", "Refreshing access token.")

        axios({
            method: "POST",
            params: {
                "client_id": config.services.twitch.clientId,
                "client_secret": config.services.twitch.clientSecret,
                "grant_type": "client_credentials"
            },
            responseType: "json",
            url: "https://id.twitch.tv/oauth2/token",
        })
            .then((resp) => {
                if (resp.status !== 200 || resp.data.status === 200)
                    return reject(new Error("UNKNOWN_HTTP_ERROR"))
                if (!resp.data)
                    return reject(new Error("UNKNOWN_ERROR"))

                if (!resp.data.access_token || !resp.data.expires_in)
                    return reject(new Error("NO_ACCESS_TOKEN"))

                accessToken = resp.data.access_token
                db.set("services.twitch.accessToken", accessToken).write()
                log("TRACE", `Access token refreshed: ${accessToken}`)

                return resolve()
            })
            .catch((error: AxiosError) => {
                if (error.code === "403" || error.response?.status === 403)
                    return reject(new Error("FORBIDDEN"))

                log("WARN", "An error occured while refreshing access token", error)
                return reject(new Error("UNKNOWN_ERROR"))
            })
    })
}

export async function getStream(channels: string | string[], cursor?: string): Promise<Stream[]> {
    return new Promise((resolve, reject) => {
        axios({
            headers: {
                "Client-ID": config.services.twitch.clientId,
                "Authorization": `Bearer ${accessToken}`
            },
            method: "GET",
            params: {
                "user_login": channels,
                after: cursor
            },
            responseType: "json",
            url: "https://api.twitch.tv/helix/streams"
        })
            .then((resp) => {
                if (!resp.data || !isArray(resp.data.data))
                    return reject(new Error("UNKNOWN_ERROR"))
                return resolve(resp.data.data)
            })
            .catch((error: AxiosError) => {
                if (error.code === "401" || error.response?.status === 401) {
                    refreshAccessToken()
                        .then(() => {
                            getStream(channels, cursor)
                                .then(resolve)
                                .catch(reject)
                        })
                        .catch(() => reject(new Error("ERROR_REFRESH_ACCESS_TOKEN")))
                }

                log("WARN", "An error occured while fetching streams.", error)
                return reject(new Error("UNKNOWN_ERROR"))
            })
    })
}

export async function getGame(games: string | string[]): Promise<Game[]> {
    return new Promise((resolve, reject) => {
        if (isArray(games) && games.length > 100)
            throw new Error("TOO_MUCH_GAMES")

        axios({
            headers: {
                "Client-ID": config.services.twitch.clientId,
                "Authorization": `Bearer ${accessToken}`
            },
            method: "GET",
            params: { id: games },
            responseType: "json",
            url: "https://api.twitch.tv/helix/games"
        })
            .then((resp) => {
                if (!resp.data || !isArray(resp.data.data))
                    return reject(new Error("UNKNOWN_ERROR"))
                return resolve(resp.data.data)
            })
            .catch((error: AxiosError) => {
                if (error.code === "401" || error.response?.status === 401) {
                    refreshAccessToken()
                        .then(() => {
                            getGame(games)
                                .then(resolve)
                                .catch(reject)
                        })
                        .catch(() => reject(new Error("ERROR_REFRESH_ACCESS_TOKEN")))
                }

                log("WARN", "An error occured while fetching games.", inspect(error))
                return reject(new Error("UNKNOWN_ERROR"))
            })
    })
}
