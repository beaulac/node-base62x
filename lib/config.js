'use strict';
/**
 * @type {string}
 * Special tag symbol:
 * x1 => 61,
 * x2 => 62,
 * x3 => 63
 */
const defaultXTag = 'x';
const b62xTemplate = Object.freeze(
    [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
        'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ]
);

let _xtag, _alphabet, _reverseLookup;

const config = Object.defineProperties(
    Object.create(null),
    {
        xtag: {
            get: () => _xtag,
            set: tag => {
                _alphabet = buildAlphabet(tag);
                _xtag = tag;
                _reverseLookup = buildReverseLookup(_alphabet);
            },
            enumerable: true
        },
        b62x: { get: () => _alphabet, enumerable: true },
        rb62x: { get: () => _reverseLookup, enumerable: true },
        template: { value: b62xTemplate }
    }
);

config.xtag = defaultXTag;


function buildAlphabet(xtag) {
    const alphabet = b62xTemplate.filter(c => c !== xtag);

    if (alphabet.length === b62xTemplate.length) {
        throw Error(`Invalid tag: "${xtag}"`);
    }

    return [...alphabet, ...[1, 2, 3].map(i => `${xtag}${i}`)];
}

function buildReverseLookup(alphabet) {
    return new Proxy(
        alphabet.reduce(
            (acc, char, idx) => {
                acc[char] = idx;
                return acc;
            },
            Object.create(null)
        ),
        {
            get: (target, key) => {
                const result = target[key];
                if (result === undefined) {
                    throw Error(`Invalid Base62x character: "${key}"`);
                }
                return result;
            }
        }
    );
}

module.exports = config;
