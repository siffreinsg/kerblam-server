export interface Config {
    server: {
        port: number;
        path: string;
    };
    services: {
        youtube: {
            enabled: boolean;
            apiKeys: string | string[];
        };
        twitch: {
            enabled: boolean;
            clientId: string;
            clientSecret: string;
            accessToken?: string;
        };
    };
}

export interface Channel {
    activated: boolean;
    displayName: string;
    socials: {
        [ key: string ]: string;
    };
    ids: {
        youtube: string;
        twitch: string;
    };
    streamOrigin: keyof Channel["ids"];
}
