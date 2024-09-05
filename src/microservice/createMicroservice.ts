import mqtt from "mqtt"
import { Message } from "../internalTypes"
import { DEFAULT_RESPONSE_TOPIC } from "../default"

export type MicroserviceResolver = Record<string, (args: any) => Promise<any> | any>
export type ErrorHandler = (e: any) => Error

export interface MicroserviceConfig {
    url: string,
    name: string,
    responseTopic?: string,
    /**
     * This error handler just maps the error to a more readable error
     * @returns {Error} An error message with the name, message and stack properties
     */
    errorHandler?: ErrorHandler
}

/**
 * Creates a new microservice
 * @param config The configuration for the microservice
 * @param resolvers A map of handlers for each topic, all topics will be prefixed with the microservice name as `name/topic`
 */
const createMicroservice = async (config: MicroserviceConfig, resolvers: MicroserviceResolver) => {
    const { name, errorHandler } = config
    const conn = await mqtt.connectAsync(config.url)
    const responseTopic = config.responseTopic || DEFAULT_RESPONSE_TOPIC

    for await (const topic of Object.keys(resolvers)) {
        await conn.subscribeAsync(`${name}/${topic}`)
    }

    conn.on("message", async (topic, message) => {
        const { correlationId, payload } = JSON.parse(message.toString()) as Message<unknown>
        const [, topicName] = topic.split("/")
        const resolver = resolvers[topicName]

        if (!resolver) {
            return
        }

        try {
            const result = await resolver(payload)
            const response: Message<unknown> = {
                correlationId,
                payload: result
            }
            conn.publish(`${responseTopic}/${correlationId}`, JSON.stringify(response))
        } catch (error: any) {
            const e: Error = errorHandler ? errorHandler(error) : error
            const { name, message, stack } = e

            error = {
                name,
                message,
                stack
            }

            const response: Message<unknown> = {
                correlationId,
                error
            }

            conn.publish(`${responseTopic}/${correlationId}`, JSON.stringify(response))
        }
    })

    return conn
}

export default createMicroservice