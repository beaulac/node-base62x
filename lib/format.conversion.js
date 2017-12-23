'use strict';

// https://terenceyim.wordpress.com/2011/03/04/javascript-utf-8-codec-that-supports-supplementary-code-points/
/**
 *
 * @param utf8Bytes - UTF-8 Byte Array
 * @return {Array}
 */
function toUTF16Array(utf8Bytes) {
    const utf16 = [];

    for (let i = 0, j = 0, code; i < utf8Bytes.length; i++) {

        if (utf8Bytes[i] <= 0x7f) { // one byte
            utf16[j++] = String.fromCharCode(utf8Bytes[i]);
        }
        else if (utf8Bytes[i] >= 0xc0) {  // Multibytes
            if (utf8Bytes[i] < 0xe0) {  // two bytes
                code = ((utf8Bytes[i++] & 0x1f)<<6) |
                       (utf8Bytes[i] & 0x3f);
            }
            else if (utf8Bytes[i] < 0xf0) {  // three bytes
                code = ((utf8Bytes[i++] & 0x0f)<<12) |
                       ((utf8Bytes[i++] & 0x3f)<<6) |
                       (utf8Bytes[i] & 0x3f);
            }
            else {  // four bytes
                // turned into two characters in JS as surrogate pair
                code = (((utf8Bytes[i++] & 0x07)<<18) |
                        ((utf8Bytes[i++] & 0x3f)<<12) |
                        ((utf8Bytes[i++] & 0x3f)<<6) |
                        (utf8Bytes[i] & 0x3f)) - 0x10000;
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

module.exports = {
    toUTF16Array
};
