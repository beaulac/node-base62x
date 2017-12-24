'use strict';
const config = require('./config');


module.exports = encodeBase62x;


const LB6 = 0x3F  // 00111111
    , LB4 = 0x0F; // 00001111

/**
 * @param {string|Buffer} input
 * @return {string}
 */
function encodeBase62x(input) {
    let output = '';
    if (!input) {
        return output;
    }
    const inputBytes = Buffer.isBuffer(input) ? input : Buffer.from(input);

    const b62x = config.get('b62x');

    let inputPos = 0;

    do {
        const currByte = inputBytes[inputPos]
            , nextByte = inputBytes[inputPos + 1]
            , byteAfterNext = inputBytes[inputPos + 2];

        // Write 6 high-bits of current byte.
        writeChars(currByte>>2);

        // 2 low-bits of current byte as MSB, with 4 high-bits of next byte as LSB.
        const c1 = ((currByte<<4) & LB6) | (nextByte>>4);

        switch (inputBytes.length - inputPos) {
        case 1:
            writeChars(
                c1>>4 // This is the last byte, shift low-bits of c1 to LSB position.
            );
            break;
        case 2:
            writeChars(
                c1,
                nextByte & LB4
            );
            inputPos += 1;

            break;
        default:
            writeChars(
                c1,
                (nextByte<<2 & LB6) | byteAfterNext>>6, // MSB: 4 low of next byte; LSB: 2 high-bits of byte-after-next.
                byteAfterNext & LB6 // 6 low-bits of byte-after-next
            );
            inputPos += 2;
        }

    } while (++inputPos < inputBytes.length);

    return output;


    function writeChars(...chars) {
        for (const c of chars) {
            output += b62x[c];
        }
    }
}
