export interface Config {
    services: {
        youtube: {
            enabled: true;
            apiKey: string | string[];
        };
    };
}
