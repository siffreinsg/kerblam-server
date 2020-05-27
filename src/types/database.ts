export interface DBClient {
    uuid?: string;
}

export interface KerblamDB {
    services: {
        twitch: {
            accessToken: string;
        };
    };
    clients: DBClient[];
}
