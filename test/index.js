'use strict';
const assert = require('assert');

const fixtures = require('./fixtures');

describe('Base62x Codec', function () {
    const B62xCodec = require('..');


    describe(' invalid input', function () {
        it('throws error on invalid decode input', function () {
            try {
                B62xCodec.decode('xaxaa');
                assert.fail('Should refuse to decode this.');
            } catch (e) {
                assert(e.message === 'Invalid Base62x character: "xa"');
            }
        });

        it('throws error on decode input with invalid length', function () {
            try {
                B62xCodec.decode('2');
                assert.fail('Should refuse to decode this.');
            } catch (e) {
                assert(e.message === `Illegal base62x input: '2' at position 0`);
            }
        });

        it('decodes empty buffer from empty input', function () {
            assert.strictEqual(Buffer.compare(Buffer.alloc(0), B62xCodec.decode()), 0);
        });

        it('encodes empty input as empty string', function () {
            assert.strictEqual(B62xCodec.encode(), '');
        });
    });

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
                it(`accepts "${ c }" as an xtag`, function () {
                    B62xCodec.config.xtag = c;

                    const input = randomBuffer();

                    assert.strictEqual(
                        B62xCodec.decode(B62xCodec.encode(input)).compare(input),
                        0
                    );
                });
            });

        });
    });

    describe(' using empty strings and buffers', function () {

        it('encodes empty buffer as empty string', function () {
            assert.strictEqual(
                B62xCodec.encode(Buffer.from([])),
                ''
            );
        });

        it('encodes empty string and buffer the same way', function () {
            assert.strictEqual(
                B62xCodec.encode(Buffer.from([])),
                B62xCodec.encode('')
            );
        });

        it('encodes null-byte string and buffer the same way', function () {
            assert.strictEqual(
                B62xCodec.encode(Buffer.from([0])),
                B62xCodec.encode('\u0000')
            );
        });

        it('decodes empty string as empty buffer', function () {
            assert.strictEqual(
                Buffer.compare(
                    B62xCodec.decode(''),
                    Buffer.alloc(0)
                ),
                0
            );
        });

    });

    function randomBuffer() {
        const length = Math.ceil(100 * Math.random())
            , buf = Buffer.allocUnsafe(length);
        for (let i = 0; i < length; i++) {
            buf[i] = Math.floor(0x100 * Math.random());
        }
        return buf;
    }

});
