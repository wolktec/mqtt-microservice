import mqtt from "mqtt";
export type MicroserviceResolver = Record<string, (args: any) => Promise<any> | any>;
export type ErrorHandler = (e: any) => Error;
export interface MicroserviceConfig {
    url: string;
    name: string;
    responseTopic?: string;
    /**
     * This error handler just maps the error to a more readable error
     * @returns {Error} An error message with the name, message and stack properties
     */
    errorHandler?: ErrorHandler;
}
/**
 * Creates a new microservice
 * @param config The configuration for the microservice
 * @param resolvers A map of handlers for each topic, all topics will be prefixed with the microservice name as `name/topic`
 */
declare const createMicroservice: (config: MicroserviceConfig, resolvers: MicroserviceResolver) => Promise<mqtt.MqttClient>;
export default createMicroservice;
