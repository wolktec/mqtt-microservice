import mqtt, { MqttClient } from "mqtt"
import request from "./requestMicroservice"
import { AwaitingResponse, Message } from "../internalTypes"
import { DEFAULT_RESPONSE_TOPIC } from "../default"
import { MicroserviceError } from "../errors/MicroserviceError"

export interface ClientConnectionConfig {
    url: string,
    timeout?: number,
    responseTopic?: string,
}

export interface ClientConnection {
    request<U>(topic: string, payload: any): Promise<U>
    conn: MqttClient
}

const createConnection = async (config: ClientConnectionConfig): Promise<ClientConnection> => {
    const conn = await mqtt.connectAsync(config.url)
    const awaitingResponses: AwaitingResponse<any> = {}

    conn.subscribeAsync(`${config.responseTopic || DEFAULT_RESPONSE_TOPIC}/#`)

    conn.on("message", (topic, message) => {
        const { correlationId, payload, error } = JSON.parse(message.toString()) as Message<any>
        if (awaitingResponses[correlationId]) {
            if(error) {
                const { name, message, stack } = error
                awaitingResponses[correlationId].reject(new MicroserviceError(name, message, stack))
                delete awaitingResponses[correlationId]
                return
            }
            awaitingResponses[correlationId].resolve(payload)
            delete awaitingResponses[correlationId]
        }
    })

    return {
        request: request(conn, awaitingResponses, config.timeout),
        conn
    }
}

export default createConnection