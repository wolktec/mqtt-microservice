import { MqttClient } from "mqtt";
import { AwaitingResponse, Message } from "../internalTypes";
import { randomUUID } from "crypto";
import { DEFAULT_TIMEOUT } from "../default";

const request =
  (
    conn: MqttClient,
    awaitingResponse: AwaitingResponse<any>,
    timeoutTime: number = 5000
  ) =>
  async <T, U>(topic: string, payload: T): Promise<U> => {
    randomUUID();
    const correlationId = randomUUID();
    const message: Message<T> = {
      correlationId,
      payload,
    };

    const p = new Promise<U>((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (awaitingResponse[correlationId]) {
          reject(new Error("Timeout"));
          delete awaitingResponse[correlationId];
        }
      }, timeoutTime || DEFAULT_TIMEOUT);

      awaitingResponse[correlationId] = {
        resolve: (value: U) => {
          clearTimeout(timeout);
          resolve(value);
        },
        reject: (error: any) => {
          clearTimeout(timeout);
          reject(error);
        }
      };
    });

    conn.publish(topic, JSON.stringify(message));

    return p;
  };

export default request;
