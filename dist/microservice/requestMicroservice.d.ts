import { MqttClient } from "mqtt";
import { AwaitingResponse } from "../internalTypes";
declare const request: (conn: MqttClient, awaitingResponse: AwaitingResponse<any>, timeoutTime?: number) => <T, U>(topic: string, payload: T) => Promise<U>;
export default request;
