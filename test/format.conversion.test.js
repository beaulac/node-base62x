'use strict';
const assert = require('assert');
const RefB62x = require('../original');
const convert = require('../lib/format.conversion');

const outputs = [
    'G1',
    'GM2',
    'OK93',
    'GLx1VGYA'
];

describe('utf8array', function () {

    it('matches reference', function () {
        outputs.forEach(
            str => assert.deepEqual(
                RefB62x.toUTF8Array(str),
                convert.toUTF8Array(str)
            )
        );
    });

});

describe('utf16array', function () {

    it('matches reference', function () {
        outputs.forEach(
            str => assert.deepEqual(
                RefB62x.toUTF16Array(RefB62x.toUTF8Array(str)),
                convert.toUTF16Array(convert.toUTF8Array(str))
            )
        );
    });

});