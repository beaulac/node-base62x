'use strict';

const referenceB62x = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b',
    'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z', '1', '2', '3', 'x'
];

/**
 * @type {string}
 * Special tag symbol:
 * x1 represents 61,
 * x2 => 62,
 * x3 => 63,
 * x4 => 64
 */
const referenceXTag = 'x';

/**
 * @type {number} - Position of the tag symbol
 */
const referenceXpos = referenceB62x.indexOf(referenceXTag);

/**
 * @type {number} - Position of the last pre-tag symbol
 */
const referenceBpos = referenceB62x.lastIndexOf('1') - 1;


const referenceIndexesByCharacter = {}
    , referenceIndexesByCharcode = {};

referenceB62x.forEach(
    (char, idx) => {
        // Omit x1, x2, x3
        if (!(idx > referenceBpos && idx < referenceXpos)) {
            referenceIndexesByCharacter[char] = idx;
            referenceIndexesByCharcode[char.charCodeAt(0)] = idx;
        }
    }
);

const defaultConfig = {
    'isdebug': true,
    'codetype': 0,

    /**
     * Special tag symbol:
     *
     * x1 represents 61,
     * x2 => 62,
     * x3 => 63,
     * x4 => 64
     */
    'xtag': referenceXTag,

    'encd': '-enc',
    'decd': '-dec',
    'debg': 'v',
    'cvtn': '-n',
    'b62x': referenceB62x,
    'rb62x': referenceIndexesByCharacter,
    'ibasc': referenceIndexesByCharcode,
    'bpos': referenceBpos,
    'xpos': referenceXpos,
    'max_safe_base': 36,
    'ver': 0.8
};

let currentConfig = Object.assign({}, defaultConfig);

function get(k) {
    return currentConfig[k];
}

function set(k, v) {
    currentConfig[k] = v;
}

module.exports = {
    get, set
};