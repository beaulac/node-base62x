'use strict';
const config = require('./config');
const convert = require('./format.conversion');

function _decodeByLength(tmpArr, op, m) {
    let c0 = 0,
        c1 = 0,
        c2 = 0;

    if (tmpArr[3] != null) {
        c0 = tmpArr[0]<<2 | tmpArr[1]>>4;
        c1 = ((tmpArr[1]<<4) & 0xf0) | (tmpArr[2]>>2);
        c2 = ((tmpArr[2]<<6) & 0xff) | tmpArr[3];
        op[m] = c0;
        op[++m] = c1;
        op[++m] = c2;
    } else if (tmpArr[2] != null) {
        c0 = tmpArr[0]<<2 | tmpArr[1]>>4;
        c1 = ((tmpArr[1]<<4) & 0xf0) | tmpArr[2];
        op[m] = c0;
        op[++m] = c1;
    } else if (tmpArr[1] != null) {
        c0 = tmpArr[0]<<2 | tmpArr[1];
        op[m] = c0;
    } else {
        c0 = tmpArr[0];
        op[m] = c0; //String.fromCharCode(c0);
    }

    return [op, m];
}

function decode(input = '') {
    if (!input) {
        return '';
    }

    const xtag = config.get('xtag');
    const bpos = config.get('bpos');

    const indexByAscii = config.get('ibasc');

    const inputArr = convert.toUTF8Array(input); // this.str2ab(input); //input.split(''); // need '' as parameter
    const inputlen = inputArr.length;

    let output = [];
    let inputPos = 0;
    let outputPos = 0;
    const ixtag = xtag.charCodeAt(0);

    let tmprtn = {};
    let remaini = 0;

    const bint = { 1: 1, 2: 2, 3: 3 };
    let rki;
    for (const rk in bint) { // for char and its ascii value as key
        rki = rk.charCodeAt(0);
        bint[rki] = bint[rk];
    }


    do {
        const tmpArr = [];
        remaini = inputlen - inputPos;
        switch (remaini) {
        case 1:
            console.log('static decode: illegal base62x input:[' + inputArr[inputPos] + ']. 1702122106.');
            break;
        case 2:
            if (inputArr[inputPos] === ixtag) {
                tmpArr[0] = bpos + bint[inputArr[++inputPos]];
            }
            else {
                tmpArr[0] = indexByAscii[inputArr[inputPos]];
            }
            if (inputArr[++inputPos] === ixtag) {
                tmpArr[1] = bpos + bint[inputArr[++inputPos]];
            }
            else {
                tmpArr[1] = indexByAscii[inputArr[inputPos]];
            }
            tmprtn = _decodeByLength(tmpArr, output, outputPos);
            output = tmprtn[0];
            outputPos = tmprtn[1];
            break;
        case 3:
            if (inputArr[inputPos] === ixtag) {
                tmpArr[0] = bpos + bint[inputArr[++inputPos]];
            }
            else {
                tmpArr[0] = indexByAscii[inputArr[inputPos]];
            }
            if (inputArr[++inputPos] === ixtag) {
                tmpArr[1] = bpos + bint[inputArr[++inputPos]];
            }
            else {
                tmpArr[1] = indexByAscii[inputArr[inputPos]];
            }
            if (inputArr[++inputPos] === ixtag) {
                tmpArr[2] = bpos + bint[inputArr[++inputPos]];
            }
            else {
                tmpArr[2] = indexByAscii[inputArr[inputPos]];
            }
            tmprtn = _decodeByLength(tmpArr, output, outputPos);
            output = tmprtn[0];
            outputPos = tmprtn[1];
            break;
        default:
            if (inputArr[inputPos] === ixtag) {
                tmpArr[0] = bpos + bint[inputArr[++inputPos]];
            }
            else {
                tmpArr[0] = indexByAscii[inputArr[inputPos]];
            }
            if (inputArr[++inputPos] === ixtag) {
                tmpArr[1] = bpos + bint[inputArr[++inputPos]];
            }
            else {
                tmpArr[1] = indexByAscii[inputArr[inputPos]];
            }
            if (inputArr[++inputPos] === ixtag) {
                tmpArr[2] = bpos + bint[inputArr[++inputPos]];
            }
            else {
                tmpArr[2] = indexByAscii[inputArr[inputPos]];
            }
            if (inputArr[++inputPos] === ixtag) {
                tmpArr[3] = bpos + bint[inputArr[++inputPos]];
            }
            else {
                tmpArr[3] = indexByAscii[inputArr[inputPos]];
            }
            tmprtn = _decodeByLength(tmpArr, output, outputPos);
            output = tmprtn[0];
            outputPos = tmprtn[1];
        }

        ++outputPos;

    } while (++inputPos < inputlen);

    return convert.toUTF16Array(output).join('');
}


module.exports = decode;
