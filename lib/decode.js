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
    const idxByChar = config.get('rb62x');

    const output = [];
    let pos = 0;

    do {
        const segmentLength = Math.min(input.length - pos, 4);
        _decodeSegment(_readSegment(segmentLength));
    } while (pos < input.length);

    return Buffer.from(output);


    function _readSegment(segmentLength) {
        if (segmentLength < 2) {
            throw Error(`Illegal base62x input: '${input[pos]}' at position ${pos}`);
        }

        const segment = [];
        while (segmentLength--) {
            segment.push(_readIndex());
        }
        return segment;
    }

    function _readIndex() {
        const char = input[pos++];

        return char === xtag
            ? idxByChar[char + input[pos++]] // Is of form 'x1', 'x2', or 'x3'. Suffix should not be read independently.
            : idxByChar[char];
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
