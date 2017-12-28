'use strict';

const config = require('./lib/config');
const encode = require('./lib/encode');
const decode = require('./lib/decode');

module.exports = {
    config,
    encode,
    decode,
    decodeString: b62xInput => decode(b62xInput).toString()
};
