import mqtt from "mqtt";
export type MicroserviceResolver = Record<string, (args: any) => Promise<any> | any>;
export interface MicroserviceConfig {
    url: string;
    name: string;
    responseTopic?: string;
}
/**
 * Creates a new microservice
 * @param config The configuration for the microservice
 * @param resolvers A map of handlers for each topic, all topics will be prefixed with the microservice name as `name/topic`
 */
declare const createMicroservice: (config: MicroserviceConfig, resolvers: MicroserviceResolver) => Promise<mqtt.MqttClient>;
export default createMicroservice;
