import { PlaylistItems, StreamItem, PlaylistItemListResponse, StreamSearchListResponse } from "./../types/youtube"
import { log } from "./../helpers/log"
import { config } from "../config"
import axios, { AxiosResponse, AxiosError } from "axios"

if (config.services.youtube.enabled === true && (typeof config.services.youtube.apiKey !== "string" || config.services.youtube.apiKey.length < 10))
    log("ERROR", "YouTube service is enabled but API key is not valid. Disable the service or verify API key.")

export const getPlaylistItems = (playlistId: string): Promise<PlaylistItems[]> => {
    return new Promise((resolve: (videos: PlaylistItems[]) => unknown, reject: (err: AxiosError | Error) => unknown): void => {
        axios({
            method: "GET",
            params: {
                part: "snippet",
                playlistId,
                key: config.services.youtube.apiKey,
                maxResults: 50
            },
            responseType: "json",
            url: "https://www.googleapis.com/youtube/v3/playlistItems"
        })
            .then((resp: AxiosResponse) => {
                const data = resp.data as PlaylistItemListResponse

                if (typeof data.pageInfo != "object" || typeof data.pageInfo.totalResults != "number" || !(data.items instanceof Array))
                    reject(new Error("Unknown request error"))
                else
                    resolve(data.items)
            })
            .catch(reject)
    })
}

export const getStream = (channelId: string): Promise<StreamItem | undefined> => {
    return new Promise((resolve: (stream?: StreamItem) => void, reject: (err: AxiosError | Error) => void): void => {
        axios({
            method: "GET",
            params: {
                part: "snippet",
                channelId,
                key: config.services.youtube.apiKey,
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

                if (typeof data.pageInfo != "object" || typeof data.pageInfo.totalResults != "number" || !(data.items instanceof Array))
                    reject(new Error("Unknown request error"))
                else if (data.pageInfo.totalResults === 1 && data.items[0])
                    resolve(data.items[0])
                else
                    resolve()
            })
            .catch(reject)
    })
}
