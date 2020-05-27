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
