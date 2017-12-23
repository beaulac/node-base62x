'use strict';
const config = require('./config');
const convert = require('./format.conversion');

function _decodeByLength(tmpArr, op, m) {
    var c0 = 0;
    var c1 = 0;
    var c2 = 0;
    if (typeof tmpArr[3] != 'undefined') {
        c0 = tmpArr[0]<<2 | tmpArr[1]>>4;
        c1 = ((tmpArr[1]<<4) & 0xf0) | (tmpArr[2]>>2);
        c2 = ((tmpArr[2]<<6) & 0xff) | tmpArr[3];
        op[m] = c0;
        op[++m] = c1;
        op[++m] = c2;
    }
    else if (typeof tmpArr[2] != 'undefined') {
        c0 = tmpArr[0]<<2 | tmpArr[1]>>4;
        c1 = ((tmpArr[1]<<4) & 0xf0) | tmpArr[2];
        op[m] = c0;
        op[++m] = c1;
    }
    else if (typeof tmpArr[1] != 'undefined') {
        c0 = tmpArr[0]<<2 | tmpArr[1];
        op[m] = c0;
    }
    else {
        c0 = tmpArr[0];
        op[m] = c0; //String.fromCharCode(c0);
    }

    //console.log('static decodeByLength: tmpArr:['+tmpArr+'] op:['+op+'] m:['+m+']');
    return [op, m];
}

function decode(input, obase) {
    var rtn = undefined;
    if (typeof input == 'undefined' || input == '') {
        return rtn;
    }
    var codetype = 1;
    var xtag = config.get('xtag');
    var b62x = config.get('b62x');
    var asclist = config.get('asclist');
    var ascrlist = config.get('ascrlist');
    var bpos = config.get('bpos');
    var xpos = config.get('xpos');
    var ascidx = config.get('ascidx');
    var ascmax = config.get('ascmax');
    //var max_safe_base = config.get('max_safe_base');
    //console.log('static decode: xtag:['+xtag+'] input:['+input+']');

    var indexByAscii = config.get('ibasc');

    var isnum = false;
    if (obase > 0) {
        isnum = true;
    }
    if (isnum) {
        rtn = 0;
        var ibase = xpos;
        var num_input = convert.xx2dec(input, ibase, indexByAscii);
        rtn = convert.dec2xx(num_input, obase, b62x);
        // why a medille num_input is needed? for double check?
    }
    else {
        // string
        var inputArr = convert.toUTF8Array(input); // this.str2ab(input); //input.split(''); // need '' as parameter
        var inputlen = inputArr.length;

        var op = [];
        var i = 0;
        var m = 0;
        var ixtag = xtag.charCodeAt();

        // non-ascii
        var tmpArr = [];
        var tmprtn = {};
        var bint = { 1: 1, 2: 2, 3: 3 };
        var remaini = 0;

        let rki;
        // for (var rk in rb62x) { // for char and its ascii value as key
        //     rki = rk.charCodeAt();
        //     rb62x[rki] = rb62x[rk];
        // }
        for (var rk in bint) { // for char and its ascii value as key
            rki = rk.charCodeAt();
            bint[rki] = bint[rk];
        }
        do {
            tmpArr = [];
            remaini = inputlen - i;
            switch (remaini) {
            case 1:
                console.log('static decode: illegal base62x input:[' + inputArr[i] + ']. 1702122106.');
                break;
            case 2:
                if (inputArr[i] == ixtag) {
                    tmpArr[0] = bpos + bint[inputArr[++i]];
                }
                else {
                    tmpArr[0] = indexByAscii[inputArr[i]];
                }
                if (inputArr[++i] == ixtag) {
                    tmpArr[1] = bpos + bint[inputArr[++i]];
                }
                else {
                    tmpArr[1] = indexByAscii[inputArr[i]];
                }
                tmprtn = _decodeByLength(tmpArr, op, m);
                op = tmprtn[0];
                m = tmprtn[1];
                break;
            case 3:
                if (inputArr[i] == ixtag) {
                    tmpArr[0] = bpos + bint[inputArr[++i]];
                }
                else {
                    tmpArr[0] = indexByAscii[inputArr[i]];
                }
                if (inputArr[++i] == ixtag) {
                    tmpArr[1] = bpos + bint[inputArr[++i]];
                }
                else {
                    tmpArr[1] = indexByAscii[inputArr[i]];
                }
                if (inputArr[++i] == ixtag) {
                    tmpArr[2] = bpos + bint[inputArr[++i]];
                }
                else {
                    tmpArr[2] = indexByAscii[inputArr[i]];
                }
                tmprtn = _decodeByLength(tmpArr, op, m);
                op = tmprtn[0];
                m = tmprtn[1];
                break;
            default:
                if (inputArr[i] == ixtag) {
                    tmpArr[0] = bpos + bint[inputArr[++i]];
                }
                else {
                    tmpArr[0] = indexByAscii[inputArr[i]];
                }
                if (inputArr[++i] == ixtag) {
                    tmpArr[1] = bpos + bint[inputArr[++i]];
                }
                else {
                    tmpArr[1] = indexByAscii[inputArr[i]];
                }
                if (inputArr[++i] == ixtag) {
                    tmpArr[2] = bpos + bint[inputArr[++i]];
                }
                else {
                    tmpArr[2] = indexByAscii[inputArr[i]];
                }
                if (inputArr[++i] == ixtag) {
                    tmpArr[3] = bpos + bint[inputArr[++i]];
                }
                else {
                    tmpArr[3] = indexByAscii[inputArr[i]];
                }
                tmprtn = _decodeByLength(tmpArr, op, m);
                op = tmprtn[0];
                m = tmprtn[1];
            }
            m++;
        }
        while (++i < inputlen);
        // console.log('static dec: op:['+op+'] asctype:['+asctype+'] inputArr:['+inputArr+'] tmpstr:['+tmpstr+']');
        rtn = convert.toUTF16Array(op).join(''); //String.fromCharCode.apply(null, new Uint8Array(op));
    }
    return rtn;
}


module.exports = decode;
