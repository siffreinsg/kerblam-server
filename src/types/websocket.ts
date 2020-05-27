import WebSocket from "ws"

export type WSClient = WebSocket & {
    alive?: boolean;
    address?: string;
    uuid?: string;
    json(data: unknown, cb: (err?: Error) => void): void;
}

export interface WSRegisterEventData {
    event: "REGISTER";
    uuid?: string;
}
