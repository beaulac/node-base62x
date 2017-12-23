'use strict';
/*
 * -Base62x in -JavaScript
 * Refers to
 	http://ieeexplore.ieee.org/xpl/freeabs_all.jsp?arnumber=6020065
 	-GitHub-Wadelau , base62x.c
 	https://github.com/wadelau/Base62x
 	https://ufqi.com/dev/base62x/?_via=-naturedns
 */
const config = require('./lib/config');
const encode = require('./lib/encode');
const decode = require('./lib/decode');

module.exports = {
    config,
    encode,
    decode: decode.decode,
    decodeString: decode.decodeString
};
