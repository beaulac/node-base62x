'use strict';
const assert = require('assert');
const config = require('../lib/config');
const RefB62x = require('../original');

describe('reverse b62x table', function () {

    it('matches reference', function () {
        assert.deepEqual(
            config.get('rb62x'),
            RefB62x.fillRb62x(RefB62x.get('b62x'), RefB62x.get('bpos'), RefB62x.get('xpos'))
        );
    });

});
