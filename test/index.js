'use strict';
const assert = require('assert');

const fixtures = require('./fixtures');

describe('Base62x Codec', function () {
    const B62xCodec = require('..');

    describe(' using default xtag', function () {

        it('Encodes examples correctly', function () {
            fixtures.forEach(
                ([input, expected]) => assert.strictEqual(B62xCodec.encode(input), expected)
            );
        });

        it('Decodes examples correctly', function () {
            fixtures.forEach(
                ([expected, encoded]) => assert.strictEqual(
                    Buffer.from(expected).compare(B62xCodec.decode(encoded)), 0)
            );
        });

        it('Decodes examples correctly as strings', function () {
            fixtures.forEach(
                ([expected, encoded]) => assert.strictEqual(B62xCodec.decodeString(encoded), expected)
            );
        });

    });


    describe(' using a custom xtag', function () {

        describe(' (invalid)', function () {
            it('refuses an invalid tag', function () {
                try {
                    B62xCodec.config.xtag = 'invalid';
                    assert.fail('Should refuse this custom tag.');
                } catch (e) {
                    assert(e.message === `Invalid tag: "invalid"`);
                }
            });
        });

        describe(' (valid): ', function () {
            [...B62xCodec.config.template].forEach(c => {
                it(`accepts "${c}" as an xtag`, function () {
                    B62xCodec.config.xtag = c;

                    const input = Math.random().toString(36).slice(2);

                    assert.strictEqual(
                        B62xCodec.decodeString(B62xCodec.encode(input)),
                        input
                    );
                });
            });

        });
    });

});
