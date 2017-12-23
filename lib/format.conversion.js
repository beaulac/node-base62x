'use strict';
const config = require('./config');

function toUTF8Array(utf16Str) {
    return Buffer.from(utf16Str);
}

// https://terenceyim.wordpress.com/2011/03/04/javascript-utf-8-codec-that-supports-supplementary-code-points/
/**
 *
 * @param utf8Bytes - UTF-8 Byte Array
 * @return {Array}
 */
function toUTF16Array(utf8Bytes) {
    const utf16 = [];

    for (let i = 0, j = 0, code; i < utf8Bytes.length; i++) {

        if (utf8Bytes[i] <= 0x7f) { // one byte
            utf16[j++] = String.fromCharCode(utf8Bytes[i]);
        }
        else if (utf8Bytes[i] >= 0xc0) {  // Multibytes
            if (utf8Bytes[i] < 0xe0) {  // two bytes
                code = ((utf8Bytes[i++] & 0x1f)<<6) |
                       (utf8Bytes[i] & 0x3f);
            }
            else if (utf8Bytes[i] < 0xf0) {  // three bytes
                code = ((utf8Bytes[i++] & 0x0f)<<12) |
                       ((utf8Bytes[i++] & 0x3f)<<6) |
                       (utf8Bytes[i] & 0x3f);
            }
            else {  // four bytes
                // turned into two characters in JS as surrogate pair
                code = (((utf8Bytes[i++] & 0x07)<<18) |
                        ((utf8Bytes[i++] & 0x3f)<<12) |
                        ((utf8Bytes[i++] & 0x3f)<<6) |
                        (utf8Bytes[i] & 0x3f)) - 0x10000;
                // High surrogate
                utf16[j++] = String.fromCharCode(((code & 0xffc00)>>>10) + 0xd800);
                // Low surrogate
                code = (code & 0x3ff) + 0xdc00;
            }
            utf16[j++] = String.fromCharCode(code);
        }
        else { // Otherwise it's an invalid UTF-8, skipped
            console.warn('static toUTF16Array: illegal utf8 found. 1702132109.');
        }
    }
    return utf16;
}

function xx2dec(input, ibase, rb62x) {
    let rtn = 0;
    const obase = 10;
    const xtag = config.get('xtag');
    const bpos = config.get('bpos');
    const max_safe_base = config.get('max_safe_base');
    const xpos = config.get('xpos');
    if (ibase < 2 || ibase > xpos) {
        console.log('static xx2dec: illegal ibase:[' + ibase + ']');
    }
    else if (ibase <= max_safe_base) {
        rtn = parseInt(input + '', ibase | 0).toString(obase | 0); //http://locutus.io/php/math/base_convert/
    }
    else {
        const iArr = input.split('');
        const aLen = iArr.length;
        let xnum = 0;
        let tmpi = 0;
        iArr.reverse();
        for (let i = 0; i < aLen; i++) {
            if (iArr[i + 1] === xtag) {
                tmpi = bpos + rb62x[iArr[i]];
                xnum++;
                i++;
            }
            else {
                tmpi = rb62x[iArr[i]];
            }
            rtn += tmpi * Math.pow(ibase, (i - xnum));
        }
        //- oversize check
        //- @todo
    }
    //console.log('static xx2dec: in:['+input+'] ibase:['+ibase+'] rtn:['+rtn+'] in 10.');
    return rtn;
}

function dec2xx(num_input, obase, b62x) {
    let rtn = 0;
    const ibase = 10;
    const xtag = config.get('xtag');
    const bpos = config.get('bpos');
    const max_safe_base = config.get('max_safe_base');
    const xpos = config.get('xpos');

    if (obase < 2 || obase > xpos) {
        console.log('static xx2dec: illegal ibase:[' + ibase + ']');
    }
    else if (obase <= max_safe_base) {
        rtn = parseInt(num_input + '', ibase | 0).toString(obase | 0);
    }
    else {
        let i = 0, b = 0;

        const oArr = [];

        while (num_input >= obase) {
            b = num_input % obase;
            num_input = Math.floor(num_input / obase);
            if (b <= bpos) {
                oArr[i++] = b62x[b];
            }
            else {
                oArr[i++] = b62x[b - bpos];
                oArr[i++] = xtag;
            }
        }

        b = num_input;
        if (b <= bpos) {
            oArr[i++] = b62x[b];
        }
        else {
            oArr[i++] = b62x[b - bpos];
            oArr[i++] = xtag;
        }
        oArr.reverse();
        rtn = oArr.join('');
    }
    //console.log('static dec2xx: in:['+num_input_orig+'] in 10, obase:['+obase+'] rtn:['+rtn+'].');
    return rtn;
}

module.exports = {
    toUTF8Array,
    toUTF16Array,

    xx2dec,
    dec2xx
};
