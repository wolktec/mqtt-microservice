import { MqttClient } from "mqtt";
export interface ClientConnectionConfig {
    url: string;
    timeout?: number;
    responseTopic?: string;
}
export interface ClientConnection {
    request<U>(topic: string, payload: any): Promise<U>;
    conn: MqttClient;
}
declare const createConnection: (config: ClientConnectionConfig) => Promise<ClientConnection>;
export default createConnection;
