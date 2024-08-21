"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = exports.createMicroservice = void 0;
var createMicroservice_1 = require("./microservice/createMicroservice");
Object.defineProperty(exports, "createMicroservice", { enumerable: true, get: function () { return __importDefault(createMicroservice_1).default; } });
var clientConnection_1 = require("./microservice/clientConnection");
Object.defineProperty(exports, "createConnection", { enumerable: true, get: function () { return __importDefault(clientConnection_1).default; } });
//# sourceMappingURL=index.js.map