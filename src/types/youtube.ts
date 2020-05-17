export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

export interface Thumbnails {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
    standard?: Thumbnail;
    maxres?: Thumbnail;
}

export interface PlaylistItems {
    kind: "youtube#playlistItem";
    etag: string;
    id: string;
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: Thumbnails;
        channelTitle: string;
        playlistId: string;
        position: number;
        resourceId: {
            "kind": string;
            "videoId": string;
        };
    };
}

export interface PlaylistItemListResponse {
    kind: "youtube#playlistItemListResponse";
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: PlaylistItems[];
}

export interface StreamItem {
    kind: "youtube#searchResult";
    etag: string;
    id: {
        kind: "youtube#video";
        videoId: string;
    };
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: Thumbnails;
        channelTitle: string;
        liveBroadcastContent: "live";
    };
}

export interface StreamSearchListResponse {
    kind: "youtube#searchListResponse";
    etag: string;
    nextPageToken: string;
    prevPageToken: string;
    regionCode: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: StreamItem[];
}
