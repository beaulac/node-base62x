'use strict';
const assert = require('assert');


// https://github.com/wadelau/Base62x/blob/master/base62x.presentation.201107.pdf
const examples = [
    // ['A', 'GG'], // Reference encodes as `G1`
    // ['Ab', 'GM8'], // Reference encodes as `GM2`
    ['aBC', 'OK93']
    // ['A__B*', 'GLx1VGYe'] // Reference encodes as `GLx1VGYA`
];

const correctedExamples = [
    ['A', 'G1'],
    ['Ab', 'GM2'],
    ['aBC', 'OK93'],
    ['A__B*', 'GLx1VGYA'],
    ['Base62x比Base64的编码速度更快吗?', 'Gc5pPJOoUEQlb49XSsKsDEUQXEUzbkUWWUc0dx2MwfkQRjEMx3gx2MGbpF']
];

describe('Reference Implementation', function () {
    const RefB62x = require('../original');

    xdescribe(' with original examples', function () {
        it('Encodes examples correctly', function () {
            examples.forEach(
                ([input, expected]) => assert.strictEqual(RefB62x.encode(input), expected)
            );
        });

        it('Decodes examples correctly', function () {
            examples.forEach(
                ([expected, encoded]) => assert.strictEqual(RefB62x.decode(encoded), expected)
            );
        });
    });

    describe(' with corrected examples', function () {
        it('Encodes examples correctly', function () {
            correctedExamples.forEach(
                ([input, expected]) => assert.strictEqual(RefB62x.encode(input), expected)
            );
        });

        it('Decodes examples correctly', function () {
            correctedExamples.forEach(
                ([expected, encoded]) => assert.strictEqual(RefB62x.decode(encoded), expected)
            );
        });
    });

});

describe('Base62x codec', function () {
    const B62xCodec = require('..');

    describe(' with corrected examples', function () {
        it('Encodes examples correctly', function () {
            correctedExamples.forEach(
                ([input, expected]) => assert.strictEqual(B62xCodec.encode(input), expected)
            );
        });

        it('Decodes examples correctly', function () {
            correctedExamples.forEach(
                ([expected, encoded]) => assert.strictEqual(B62xCodec.decode(encoded), expected)
            );
        });
    });

});
