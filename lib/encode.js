'use strict';
const config = require('./config');

module.exports = encodeBase62x;

/**
 * @param {string} input
 * @return {string}
 */
function encodeBase62x(input = '') {
    let output = '';
    if (!input) {
        return output;
    }
    const inputBytes = Buffer.from(input);

    const xtag = config.get('xtag');
    const b62x = config.get('b62x');
    const bpos = config.get('bpos');

    let inputPos = 0;

    let c2 = 0;
    let c3 = 0;
    do {
        // 6 high-bits of current byte
        const c0 = inputBytes[inputPos]>>2;

        // 2 low-bits of current byte, with 4 high-bits of next byte if enough remain.
        let c1 = (((inputBytes[inputPos]<<6) & 0xff)>>2);

        const remaini = inputBytes.length - inputPos;

        switch (remaini) {
        case 1:
            // This is the last byte, shift low-bits to LSB position.
            c1 = c1>>4;

            if (c0 > bpos) {
                output += `${xtag}${b62x[c0]}`;
            } else {
                output += b62x[c0];
            }

            if (c1 > bpos) {
                output += `${xtag}${b62x[c1]}`;
            } else {
                output += b62x[c1];
            }

            break;
        case 2:
            c1 |= (inputBytes[inputPos + 1]>>4);
            c2 = ((inputBytes[inputPos + 1]<<4) & 0xff)>>4;

            if (c0 > bpos) {
                output += `${xtag}${b62x[c0]}`;
            } else {
                output += b62x[c0];
            }

            if (c1 > bpos) {
                output += `${xtag}${b62x[c1]}`;
            } else {
                output += b62x[c1];
            }

            if (c2 > bpos) {
                output += `${xtag}${b62x[c2]}`;
            } else {
                output += b62x[c2];
            }

            inputPos += 1;
            break;
        default:
            c1 |= (inputBytes[inputPos + 1]>>4);
            c2 = (((inputBytes[inputPos + 1]<<4) & 0xff)>>2) | (inputBytes[inputPos + 2]>>6);
            c3 = ((inputBytes[inputPos + 2]<<2) & 0xff)>>2;

            if (c0 > bpos) {
                output += `${xtag}${b62x[c0]}`;
            } else {
                output += b62x[c0];
            }

            if (c1 > bpos) {
                output += `${xtag}${b62x[c1]}`;
            } else {
                output += b62x[c1];
            }

            if (c2 > bpos) {
                output += `${xtag}${b62x[c2]}`;
            } else {
                output += b62x[c2];
            }

            if (c3 > bpos) {
                output += `${xtag}${b62x[c3]}`;
            } else {
                output += b62x[c3];
            }

            inputPos += 2;
        }

    } while (++inputPos < inputBytes.length);

    return output;
}