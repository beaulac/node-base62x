'use strict';
const config = require('./config');
const convert = require('./format.conversion');

module.exports = function encode(input) {
    if (!input) {
        return;
    }

    const xtag = config.get('xtag');
    const b62x = config.get('b62x');
    const bpos = config.get('bpos');

    const inputArr = convert.toUTF8Array(input);

    const output = [];

    let inputPos = 0, outputPos = 0;

    let c0 = 0;
    let c1 = 0;
    let c2 = 0;
    let c3 = 0;
    do {
        const remaini = inputArr.length - inputPos;

        switch (remaini) {
        case 1:
            c0 = inputArr[inputPos]>>2;
            c1 = ((inputArr[inputPos]<<6) & 0xff)>>6;
            if (c0 > bpos) {
                output[outputPos] = xtag;
                output[++outputPos] = b62x[c0];
            }
            else {
                output[outputPos] = b62x[c0];
            }
            if (c1 > bpos) {
                output[++outputPos] = xtag;
                output[++outputPos] = b62x[c1];
            }
            else {
                output[++outputPos] = b62x[c1];
            }
            break;
        case 2:
            c0 = inputArr[inputPos]>>2;
            c1 = (((inputArr[inputPos]<<6) & 0xff)>>2) | (inputArr[inputPos + 1]>>4);
            c2 = ((inputArr[inputPos + 1]<<4) & 0xff)>>4;
            if (c0 > bpos) {
                output[outputPos] = xtag;
                output[++outputPos] = b62x[c0];
            }
            else {
                output[outputPos] = b62x[c0];
            }
            if (c1 > bpos) {
                output[++outputPos] = xtag;
                output[++outputPos] = b62x[c1];
            }
            else {
                output[++outputPos] = b62x[c1];
            }
            if (c2 > bpos) {
                output[++outputPos] = xtag;
                output[++outputPos] = b62x[c2];
            }
            else {
                output[++outputPos] = b62x[c2];
            }
            inputPos += 1;
            break;
        default:
            c0 = inputArr[inputPos]>>2;
            c1 = (((inputArr[inputPos]<<6) & 0xff)>>2) | (inputArr[inputPos + 1]>>4);
            c2 = (((inputArr[inputPos + 1]<<4) & 0xff)>>2) | (inputArr[inputPos + 2]>>6);
            c3 = ((inputArr[inputPos + 2]<<2) & 0xff)>>2;
            if (c0 > bpos) {
                output[outputPos] = xtag;
                output[++outputPos] = b62x[c0];
            }
            else {
                output[outputPos] = b62x[c0];
            }
            if (c1 > bpos) {
                output[++outputPos] = xtag;
                output[++outputPos] = b62x[c1];
            }
            else {
                output[++outputPos] = b62x[c1];
            }
            if (c2 > bpos) {
                output[++outputPos] = xtag;
                output[++outputPos] = b62x[c2];
            }
            else {
                output[++outputPos] = b62x[c2];
            }
            if (c3 > bpos) {
                output[++outputPos] = xtag;
                output[++outputPos] = b62x[c3];
            }
            else {
                output[++outputPos] = b62x[c3];
            }
            inputPos += 2;
        }
        outputPos++;
    } while (++inputPos < inputArr.length);

    return output.join('');
};
