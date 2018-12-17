'use strict';
const config = require('./config');
const LOW_6 = 0x3F  // 00111111
    , LOW_4 = 0x0F; // 00001111


module.exports = encodeBase62x;


/**
 * @param {string|Buffer} input
 * @return {string}
 */
function encodeBase62x(input) {
    let output = '';
    if (!input || input.length <= 0) {
        return output;
    }

    let inputBytes = Buffer.isBuffer(input)
        ? input
        : Buffer.from(input);

    do {
        writeSegment(readInputSegment());
    } while (inputBytes.length);

    return output;


    function readInputSegment() {
        const segment = inputBytes.slice(0, 3);
        inputBytes = inputBytes.slice(3);
        return segment;
    }

    function writeSegment([currByte, nextByte, byteAfterNext]) {
        writeChars(currByte>>2); // Write 6 high-bits of current byte.

        // 2 low-bits of current byte as MSB, with 4 high-bits of next byte as LSB.
        const c1 = ((currByte<<4) & LOW_6) | (nextByte>>4);

        if (nextByte === undefined) { // This is the last byte, shift low-bits to LSB.
            return writeChars(c1>>4);
        }

        writeChars(c1);

        if (byteAfterNext === undefined) { // Next byte is last, its 4 low bits are written as is.
            return writeChars(nextByte & LOW_4);
        }

        writeChars(
            (nextByte<<2 & LOW_6) | byteAfterNext>>6, // MSB: 4 low of next byte; LSB: 2 high-bits of byte-after-next.
            byteAfterNext & LOW_6
        );
    }

    function writeChars(...chars) {
        for (const c of chars) {
            output += config.b62x[c];
        }
    }
}
