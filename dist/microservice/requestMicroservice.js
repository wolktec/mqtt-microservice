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
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const default_1 = require("../default");
const request = (conn, awaitingResponse, timeoutTime = 5000) => (topic, payload) => __awaiter(void 0, void 0, void 0, function* () {
    (0, crypto_1.randomUUID)();
    const correlationId = (0, crypto_1.randomUUID)();
    const message = {
        correlationId,
        payload,
    };
    const p = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            if (awaitingResponse[correlationId]) {
                reject(new Error("Timeout"));
                delete awaitingResponse[correlationId];
            }
        }, timeoutTime || default_1.DEFAULT_TIMEOUT);
        awaitingResponse[correlationId] = {
            resolve: (value) => {
                clearTimeout(timeout);
                resolve(value);
            },
            reject: (error) => {
                clearTimeout(timeout);
                reject(error);
            }
        };
    });
    conn.publish(topic, JSON.stringify(message));
    return p;
});
exports.default = request;
//# sourceMappingURL=requestMicroservice.js.map