'use strict';
const config = require('./config');

/**
 * @param {string} input
 * @return {Buffer}
 */
function decode(input = '') {
    if (!input) {
        return Buffer.alloc(0);
    }

    const xtag = config.get('xtag');
    const indexByCharacter = config.get('rb62x');

    const output = [];
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

    return Buffer.from(output);


    function _readIndex() {
        const char = input[inputPos++];

        if (char !== xtag) {
            return indexByCharacter[char];
        }

        // Is of form 'x1', 'x2', or 'x3'. Suffix should not be read independently.
        return indexByCharacter[char + input[inputPos++]];
    }

    function _decodeSegment(segment) {
        if (segment[3] != null) {
            output.push(
                segment[0]<<2 | segment[1]>>4,
                ((segment[1]<<4) & 0xf0) | (segment[2]>>2),
                ((segment[2]<<6) & 0xff) | segment[3]
            );
        } else if (segment[2] != null) {
            output.push(
                segment[0]<<2 | segment[1]>>4,
                ((segment[1]<<4) & 0xf0) | segment[2]
            );
        } else if (segment[1] != null) {
            output.push(segment[0]<<2 | segment[1]);
        }
    }
}

function decodeString(input) {
    return decode(input).toString();
}

module.exports = {
    decode,
    decodeString
};
