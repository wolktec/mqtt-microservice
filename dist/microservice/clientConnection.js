"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const requestMicroservice_1 = __importDefault(require("./requestMicroservice"));
const default_1 = require("../default");
const MicroserviceError_1 = require("../errors/MicroserviceError");
const createConnection = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield mqtt_1.default.connectAsync(config.url);
    const awaitingResponses = {};
    conn.subscribeAsync(`${config.responseTopic || default_1.DEFAULT_RESPONSE_TOPIC}/#`);
    conn.on("message", (topic, message) => {
        const { correlationId, payload, error } = JSON.parse(message.toString());
        if (awaitingResponses[correlationId]) {
            if (error) {
                const { name, message, stack } = error;
                awaitingResponses[correlationId].reject(new MicroserviceError_1.MicroserviceError(name, message, stack));
                delete awaitingResponses[correlationId];
                return;
            }
            awaitingResponses[correlationId].resolve(payload);
            delete awaitingResponses[correlationId];
        }
    });
    return {
        request: (0, requestMicroservice_1.default)(conn, awaitingResponses, config.timeout),
        conn
    };
});
exports.default = createConnection;
//# sourceMappingURL=clientConnection.js.map