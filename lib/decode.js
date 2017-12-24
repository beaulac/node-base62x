'use strict';
const config = require('./config');
const convert = require('./format.conversion');

/**
 * @param {string} input
 * @return {Array}
 */
function decode(input = '') {
    const output = [];
    if (!input) {
        return output;
    }

    const xtag = config.get('xtag');
    const indexByCharacter = config.get('rb62x');

    let inputPos = 0;

    do {
        const char = input[inputPos];

        let segmentLength = Math.min(input.length - inputPos, 4);
        if (segmentLength < 2) {
            console.warn(`Illegal base62x input: ${char}`);
            continue;
        }

        const segment = new Array(segmentLength).fill(0).map(_readIndex);
        _decodeSegment(segment);

    } while (inputPos < input.length);

    return output;


    function _readIndex() {
        const char = input[inputPos++];

        if (char !== xtag) {
            return indexByCharacter[char];
        }

        // Is of form 'x1', 'x2', or 'x3'. Suffix should not be read independently.
        return indexByCharacter[char + input[inputPos++]];
    }

    function _decodeSegment(segment) {
        let c0 = 0,
            c1 = 0,
            c2 = 0;

        if (segment[3] != null) {
            c0 = segment[0]<<2 | segment[1]>>4;
            c1 = ((segment[1]<<4) & 0xf0) | (segment[2]>>2);
            c2 = ((segment[2]<<6) & 0xff) | segment[3];

            output.push(c0, c1, c2);
        } else if (segment[2] != null) {
            c0 = segment[0]<<2 | segment[1]>>4;
            c1 = ((segment[1]<<4) & 0xf0) | segment[2];

            output.push(c0, c1);
        } else if (segment[1] != null) {
            c0 = segment[0]<<2 | segment[1];
            output.push(c0);
        } else {
            c0 = segment[0];
            output.push(c0); //String.fromCharCode(c0);
        }
    }
}

function decodeString(input) {
    const outputBytes = decode(input);
    return convert.toUTF16Array(outputBytes).join('');
}


module.exports = {
    decode,
    decodeString
};
