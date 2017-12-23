'use strict';
const config = require('./config');
const convert = require('./format.conversion');

function _decodeByLength(tmpArr, output, outputPos) {
    let c0 = 0,
        c1 = 0,
        c2 = 0;

    if (tmpArr[3] != null) {
        c0 = tmpArr[0]<<2 | tmpArr[1]>>4;
        c1 = ((tmpArr[1]<<4) & 0xf0) | (tmpArr[2]>>2);
        c2 = ((tmpArr[2]<<6) & 0xff) | tmpArr[3];
        output[outputPos] = c0;
        output[++outputPos] = c1;
        output[++outputPos] = c2;
    } else if (tmpArr[2] != null) {
        c0 = tmpArr[0]<<2 | tmpArr[1]>>4;
        c1 = ((tmpArr[1]<<4) & 0xf0) | tmpArr[2];
        output[outputPos] = c0;
        output[++outputPos] = c1;
    } else if (tmpArr[1] != null) {
        c0 = tmpArr[0]<<2 | tmpArr[1];
        output[outputPos] = c0;
    } else {
        c0 = tmpArr[0];
        output[outputPos] = c0; //String.fromCharCode(c0);
    }

    return [output, outputPos];
}

function decode(input = '') {
    let output = [];
    if (!input) {
        return '';
    }

    const xtag = config.get('xtag');
    const bpos = config.get('bpos');
    const indexByAscii = config.get('ibasc');
    const offsetsByCharcode = config.get('offsetsByCharcode');

    const inputBytes = Buffer.from(input);

    let inputPos = 0;
    let outputPos = 0;
    const ixtag = xtag.charCodeAt(0);

    do {
        const tmpArr = [];

        switch (inputBytes.length - inputPos) {
        case 1:
            console.log('static decode: illegal base62x input:[' + inputBytes[inputPos] + ']. 1702122106.');
            break;
        case 2:
            if (inputBytes[inputPos] === ixtag) {
                tmpArr[0] = bpos + offsetsByCharcode[inputBytes[++inputPos]];
            } else {
                tmpArr[0] = indexByAscii[inputBytes[inputPos]];
            }

            if (inputBytes[++inputPos] === ixtag) {
                tmpArr[1] = bpos + offsetsByCharcode[inputBytes[++inputPos]];
            } else {
                tmpArr[1] = indexByAscii[inputBytes[inputPos]];
            }

            [output, outputPos] = _decodeByLength(tmpArr, output, outputPos);

            break;
        case 3:
            if (inputBytes[inputPos] === ixtag) {
                tmpArr[0] = bpos + offsetsByCharcode[inputBytes[++inputPos]];
            } else {
                tmpArr[0] = indexByAscii[inputBytes[inputPos]];
            }

            if (inputBytes[++inputPos] === ixtag) {
                tmpArr[1] = bpos + offsetsByCharcode[inputBytes[++inputPos]];
            } else {
                tmpArr[1] = indexByAscii[inputBytes[inputPos]];
            }

            if (inputBytes[++inputPos] === ixtag) {
                tmpArr[2] = bpos + offsetsByCharcode[inputBytes[++inputPos]];
            } else {
                tmpArr[2] = indexByAscii[inputBytes[inputPos]];
            }

            [output, outputPos] = _decodeByLength(tmpArr, output, outputPos);
            break;
        default:
            if (inputBytes[inputPos] === ixtag) {
                tmpArr[0] = bpos + offsetsByCharcode[inputBytes[++inputPos]];
            } else {
                tmpArr[0] = indexByAscii[inputBytes[inputPos]];
            }
            if (inputBytes[++inputPos] === ixtag) {
                tmpArr[1] = bpos + offsetsByCharcode[inputBytes[++inputPos]];
            } else {
                tmpArr[1] = indexByAscii[inputBytes[inputPos]];
            }
            if (inputBytes[++inputPos] === ixtag) {
                tmpArr[2] = bpos + offsetsByCharcode[inputBytes[++inputPos]];
            } else {
                tmpArr[2] = indexByAscii[inputBytes[inputPos]];
            }

            if (inputBytes[++inputPos] === ixtag) {
                tmpArr[3] = bpos + offsetsByCharcode[inputBytes[++inputPos]];
            } else {
                tmpArr[3] = indexByAscii[inputBytes[inputPos]];
            }

            [output, outputPos] = _decodeByLength(tmpArr, output, outputPos);
        }

        ++outputPos;

    } while (++inputPos < inputBytes.length);

    return convert.toUTF16Array(output).join('');
}


module.exports = decode;
