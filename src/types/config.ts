export interface Config {
    server: {
        port: number;
        path: string;
    };
    services: {
        youtube: {
            enabled: boolean;
            apiKey: string | string[];
        };
        twitch: {
            enabled: boolean;
            clientId: string;
            clientSecret: string;
            accessToken?: string;
        };
    };
}
