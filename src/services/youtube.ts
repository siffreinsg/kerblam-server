import { PlaylistItems, StreamItem, PlaylistItemListResponse, StreamSearchListResponse } from "./../types/youtube"
import { log } from "./../helpers/log"
import { config } from "../controllers/config"
import axios, { AxiosResponse, AxiosError } from "axios"
import { isArray } from "util"

if (config.services.twitch.enabled)
    log("INFO", "Youtube service enabled.")

if (config.services.youtube.enabled && (typeof config.services.youtube.apiKeys !== "string" || !isArray(config.services.youtube.apiKeys)))
    log("ERROR", "YouTube service is enabled but API key is not valid. Disable the service or verify API key.")


const getApiKey = (): string => {
    if (typeof config.services.youtube.apiKeys === "string")
        return config.services.youtube.apiKeys
    return config.services.youtube.apiKeys[Math.floor((Math.random() * config.services.youtube.apiKeys.length))]
}

export const getPlaylistItems = (playlistId: string): Promise<PlaylistItems[]> => {
    return new Promise((resolve: (videos: PlaylistItems[]) => unknown, reject: (err: AxiosError | Error) => void): void => {
        if (!config.services.youtube.enabled)
            return reject(new Error("YouTube service is not enabled."))

        axios({
            method: "GET",
            params: {
                part: "snippet",
                playlistId,
                key: getApiKey(),
                maxResults: 50
            },
            responseType: "json",
            url: "https://www.googleapis.com/youtube/v3/playlistItems"
        })
            .then((resp: AxiosResponse) => {
                const data = resp.data as PlaylistItemListResponse

                if (typeof data.pageInfo !=="object" || typeof data.pageInfo.totalResults !=="number" || !isArray(data.items))
                    reject(new Error("Unknown request error"))
                else
                    resolve(data.items)
            })
            .catch(reject)
    })
}

export const getStream = (channelId: string): Promise<StreamItem | undefined> => {
    return new Promise((resolve: (stream?: StreamItem) => void, reject: (err: AxiosError | Error) => void): void => {
        if (!config.services.youtube.enabled)
            return reject(new Error("YouTube service is not enabled."))

        axios({
            method: "GET",
            params: {
                part: "snippet",
                channelId,
                key: getApiKey(),
                type: "video",
                eventType: "live",
                maxResults: 1,
                safeSearch: "none",
            },
            responseType: "json",
            url: "https://www.googleapis.com/youtube/v3/search",
        })
            .then((resp: AxiosResponse) => {
                const data = resp.data as StreamSearchListResponse

                if (typeof data.pageInfo !=="object" || typeof data.pageInfo.totalResults !=="number" || !isArray(data.items))
                    reject(new Error("Unknown request error"))
                else if (data.pageInfo.totalResults === 1 && data.items[0])
                    resolve(data.items[0])
                else
                    resolve()
            })
            .catch(reject)
    })
}
