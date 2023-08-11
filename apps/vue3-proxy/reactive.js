"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactive = void 0;
const effect_1 = require("./effect");
const isObject = (obj) => obj !== null && typeof obj === 'object';
const reactive = (target) => {
    return new Proxy(target, {
        get(target, key, receiver) {
            let res = Reflect.get(target, key, receiver);
            (0, effect_1.track)(target, key);
            if (isObject(res)) {
                return (0, exports.reactive)(res);
            }
            return res;
        },
        set(target, key, value, receiver) {
            let res = Reflect.set(target, key, value, receiver);
            (0, effect_1.trigger)(target, key);
            return res;
        }
    });
};
exports.reactive = reactive;
