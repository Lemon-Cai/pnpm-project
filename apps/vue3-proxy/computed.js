"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computed = void 0;
const effect_1 = require("./effect");
const computed = (getter) => {
    let _value = (0, effect_1.effect)(getter, {
        scheduler: () => {
            _dirty = true;
        }
    });
    let cacheValue;
    let _dirty = true;
    class ComputedRefImpl {
        get value() {
            if (_dirty) {
                cacheValue = _value();
                _dirty = false;
            }
            return cacheValue;
        }
    }
    return new ComputedRefImpl();
};
exports.computed = computed;
