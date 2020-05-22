export interface Config {
    server: {
        port: number;
        path: string;
    };
    services: {
        youtube: {
            enabled: true;
            apiKey: string | string[];
        };
    };
}
