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
        let segmentLength = Math.min(input.length - inputPos, 4);
        if (segmentLength < 2) {
            throw Error(`Illegal base62x input: '${input[inputPos]}' at position ${inputPos}`);
        }

        const segment = [];
        while (segmentLength--) {
            segment.push(_readIndex());
        }
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
        if (segment.length === 4) {
            return output.push(
                segment[0]<<2 | segment[1]>>4,
                ((segment[1]<<4) & 0xF0) | (segment[2]>>2),
                ((segment[2]<<6) & 0xFF) | segment[3]
            );
        } else if (segment.length === 3) {
            return output.push(
                segment[0]<<2 | segment[1]>>4,
                ((segment[1]<<4) & 0xF0) | segment[2]
            );
        } else if (segment.length === 2) {
            return output.push(segment[0]<<2 | segment[1]);
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
