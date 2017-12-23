'use strict';
const config = require('./config');

function toUTF8Array(utf16Str) { // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    var utf8 = [];
    var str = utf16Str;
    for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) {
            utf8.push(charcode);
        } // one byte
        else if (charcode < 0x800) { // two bytes
            utf8.push(0xc0 | (charcode>>6),
                0x80 | (charcode & 0x3f)
            );
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) { // three bytes
            utf8.push(0xe0 | (charcode>>12),
                0x80 | ((charcode>>6) & 0x3f),
                0x80 | (charcode & 0x3f)
            );
        }
        else { // surrogate pair, four bytes
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                                  | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode>>18),
                0x80 | ((charcode>>12) & 0x3f),
                0x80 | ((charcode>>6) & 0x3f),
                0x80 | (charcode & 0x3f)
            );
        }
    }
    return utf8;
}

function toUTF16Array(utf8Bytes) { //https://terenceyim.wordpress.com/2011/03/04/javascript-utf-8-codec-that-supports-supplementary-code-points/
    var bytes = utf8Bytes;

    var len = bytes.length;
    var utf16 = [];
    var code, i, j;
    j = 0;
    for (i = 0; i < len; i++) {
        if (bytes[i] <= 0x7f) { // one byte
            utf16[j++] = String.fromCharCode(bytes[i]);
        }
        else if (bytes[i] >= 0xc0) {  // Mutlibytes
            if (bytes[i] < 0xe0) {  // two bytes
                code = ((bytes[i++] & 0x1f)<<6) |
                       (bytes[i] & 0x3f);
            }
            else if (bytes[i] < 0xf0) {  // three bytes
                code = ((bytes[i++] & 0x0f)<<12) |
                       ((bytes[i++] & 0x3f)<<6) |
                       (bytes[i] & 0x3f);
            }
            else {  // four bytes
                // turned into two characters in JS as surrogate pair
                code = (((bytes[i++] & 0x07)<<18) |
                        ((bytes[i++] & 0x3f)<<12) |
                        ((bytes[i++] & 0x3f)<<6) |
                        (bytes[i] & 0x3f)) - 0x10000;
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
    var rtn = 0;
    var obase = 10;
    var xtag = config.get('xtag');
    var bpos = config.get('bpos');
    var max_safe_base = config.get('max_safe_base');
    var xpos = config.get('xpos');
    if (ibase < 2 || ibase > xpos) {
        console.log('static xx2dec: illegal ibase:[' + ibase + ']');
    }
    else if (ibase <= max_safe_base) {
        rtn = parseInt(input + '', ibase | 0).toString(obase | 0); //http://locutus.io/php/math/base_convert/
    }
    else {
        var iArr = input.split('');
        var aLen = iArr.length;
        var xnum = 0;
        var tmpi = 0;
        iArr.reverse();
        for (var i = 0; i < aLen; i++) {
            if (iArr[i + 1] == xtag) {
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
    var rtn = 0;
    var ibase = 10;
    var xtag = config.get('xtag');
    var bpos = config.get('bpos');
    var max_safe_base = config.get('max_safe_base');
    var xpos = config.get('xpos');
    var num_input_orig = num_input;
    if (obase < 2 || obase > xpos) {
        console.log('static xx2dec: illegal ibase:[' + ibase + ']');
    }
    else if (obase <= max_safe_base) {
        rtn = parseInt(num_input + '', ibase | 0).toString(obase | 0);
    }
    else {
        var i = 0;
        var b = 0;
        var oArr = [];
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
