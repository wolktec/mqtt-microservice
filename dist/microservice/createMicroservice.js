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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const default_1 = require("../default");
/**
 * Creates a new microservice
 * @param config The configuration for the microservice
 * @param resolvers A map of handlers for each topic, all topics will be prefixed with the microservice name as `name/topic`
 */
const createMicroservice = (config, resolvers) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const { name, errorHandler } = config;
    const conn = yield mqtt_1.default.connectAsync(config.url);
    const responseTopic = config.responseTopic || default_1.DEFAULT_RESPONSE_TOPIC;
    try {
        for (var _d = true, _e = __asyncValues(Object.keys(resolvers)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const topic = _c;
            yield conn.subscribeAsync(`${name}/${topic}`);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    conn.on("message", (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
        const { correlationId, payload } = JSON.parse(message.toString());
        const [, topicName] = topic.split("/");
        const resolver = resolvers[topicName];
        if (!resolver) {
            return;
        }
        try {
            const result = yield resolver(payload);
            const response = {
                correlationId,
                payload: result
            };
            conn.publish(`${responseTopic}/${correlationId}`, JSON.stringify(response));
        }
        catch (error) {
            const e = errorHandler ? errorHandler(error) : error;
            const { name, message, stack } = e;
            error = {
                name,
                message,
                stack
            };
            const response = {
                correlationId,
                error
            };
            conn.publish(`${responseTopic}/${correlationId}`, JSON.stringify(response));
        }
    }));
    return conn;
});
exports.default = createMicroservice;
//# sourceMappingURL=createMicroservice.js.map