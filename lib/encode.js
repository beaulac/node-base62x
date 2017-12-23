'use strict';
const config = require('./config');
const convert = require('./format.conversion');

module.exports = function encode(input, ibase) {
    let rtn = undefined;
    if (!input) {
        return rtn;
    }

    var codetype = 0;
    const xtag = config.get('xtag');
    var b62x = config.get('b62x');
    var bpos = config.get('bpos');
    var xpos = config.get('xpos');
    //var max_safe_base = config.get('max_safe_base');
    //console.log('static encode: xtag:['+xtag+'] input:['+input+']');
    var rb62x = config.get('rb62x');

    if (typeof ibase === 'number' && ibase > 0) { // Is a number.
        var num_input = convert.xx2dec(input, ibase, rb62x);
        var obase = xpos;
        rtn = convert.dec2xx(num_input, obase, b62x);
    } else {
        // string
        var inputArr = convert.toUTF8Array(input); // this.str2ab(input); //input.split(''); // need '' as parameter
        var inputlen = inputArr.length;
        var op = [];
        var i = 0;
        var m = 0;
        //- non-ascii
        var c0 = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        var remaini = 0;
        do {
            remaini = inputlen - i;
            switch (remaini) {
            case 1:
                c0 = inputArr[i]>>2;
                c1 = ((inputArr[i]<<6) & 0xff)>>6;
                if (c0 > bpos) {
                    op[m] = xtag;
                    op[++m] = b62x[c0];
                }
                else {
                    op[m] = b62x[c0];
                }
                if (c1 > bpos) {
                    op[++m] = xtag;
                    op[++m] = b62x[c1];
                }
                else {
                    op[++m] = b62x[c1];
                }
                break;
            case 2:
                c0 = inputArr[i]>>2;
                c1 = (((inputArr[i]<<6) & 0xff)>>2) | (inputArr[i + 1]>>4);
                c2 = ((inputArr[i + 1]<<4) & 0xff)>>4;
                if (c0 > bpos) {
                    op[m] = xtag;
                    op[++m] = b62x[c0];
                }
                else {
                    op[m] = b62x[c0];
                }
                if (c1 > bpos) {
                    op[++m] = xtag;
                    op[++m] = b62x[c1];
                }
                else {
                    op[++m] = b62x[c1];
                }
                if (c2 > bpos) {
                    op[++m] = xtag;
                    op[++m] = b62x[c2];
                }
                else {
                    op[++m] = b62x[c2];
                }
                i += 1;
                break;
            default:
                c0 = inputArr[i]>>2;
                c1 = (((inputArr[i]<<6) & 0xff)>>2) | (inputArr[i + 1]>>4);
                c2 = (((inputArr[i + 1]<<4) & 0xff)>>2) | (inputArr[i + 2]>>6);
                c3 = ((inputArr[i + 2]<<2) & 0xff)>>2;
                if (c0 > bpos) {
                    op[m] = xtag;
                    op[++m] = b62x[c0];
                }
                else {
                    op[m] = b62x[c0];
                }
                if (c1 > bpos) {
                    op[++m] = xtag;
                    op[++m] = b62x[c1];
                }
                else {
                    op[++m] = b62x[c1];
                }
                if (c2 > bpos) {
                    op[++m] = xtag;
                    op[++m] = b62x[c2];
                }
                else {
                    op[++m] = b62x[c2];
                }
                if (c3 > bpos) {
                    op[++m] = xtag;
                    op[++m] = b62x[c3];
                }
                else {
                    op[++m] = b62x[c3];
                }
                i += 2;
            }
            m++;
        }
        while (++i < inputlen);
        //console.log('static enc: op:['+op+'] asctype:['+asctype+'] inputArr:['+inputArr+']');
        rtn = op.join('');
    }
    return rtn;
};
