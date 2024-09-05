"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicroserviceError = void 0;
class MicroserviceError extends Error {
    constructor(message, name, stack) {
        super(message);
        this.name = name;
        this.stack = stack;
    }
}
exports.MicroserviceError = MicroserviceError;
//# sourceMappingURL=MicroserviceError.js.map