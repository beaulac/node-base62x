'use strict';
const config = require('./config');

/**
 * @param {string} input
 * @return {Buffer}
 */
function decode(input = '') {
    if (!input) {
        return Buffer.allocUnsafe(0);
    }

    const xtag = config.get('xtag');
    const idxByChar = config.get('rb62x');

    const output = [];
    let pos = 0;

    do {
        _decodeSegment(_readSegment());
    } while (pos < input.length);

    return Buffer.from(output);


    function _readSegment() {
        const segmentLength = Math.min(input.length - pos, 4);
        if (segmentLength >= 2) {
            return new Array(segmentLength).fill(null).map(_readIndex);
        }
        throw Error(`Illegal base62x input: '${input[pos]}' at position ${pos}`);
    }

    function _readIndex() {
        const char = input[pos++];

        return char === xtag
            ? idxByChar[char + input[pos++]] // Is of form 'x1', 'x2', or 'x3'. Suffix should not be read independently.
            : idxByChar[char];
    }

    function _decodeSegment([s0, s1, s2, s3]) {
        if (s2 === undefined) {
            return output.push(s0<<2 | s1);
        }
        output.push(s0<<2 | s1>>4);

        if (s3 === undefined) {
            return output.push(((s1<<4)) | s2);
        }
        output.push(
            ((s1<<4)) | (s2>>2),
            ((s2<<6)) | s3
        );
    }
}

module.exports = { decode, decodeString: input => decode(input).toString() };
