'use strict';

const referenceB62x = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
    'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z', 'x1', 'x2', 'x3'
];

/**
 * @type {string}
 * Special tag symbol:
 * x1 => 61,
 * x2 => 62,
 * x3 => 63
 */
const referenceXTag = 'x';

const referenceIndexesByCharacter = new Proxy(
    referenceB62x.reduce(
        (acc, char, idx) => {
            acc[char] = idx;
            return acc;
        },
        Object.create(null)
    ),
    {
        get: function (target, key) {
            const result = target[key];
            if (result === undefined) {
                throw Error(`Invalid Base62x character: '${key}'`);
            }
            return result;
        }
    }
);

const defaultConfig = {
    xtag: referenceXTag,
    b62x: referenceB62x,
    rb62x: referenceIndexesByCharacter
};

module.exports = defaultConfig;
