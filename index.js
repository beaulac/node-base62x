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

class Base62x {

    //- constructor
    constructor() {
        //- @todo, refer, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
        this.isdebug = true;
        this.config = config;
    }

    get xtag() {
        return this.config.get('xtag');
    }

    //- methods, public
    //- encode, statically
    static encode(input, ibase) {
        return encode(input, ibase);
    }

    //- decode, statically
    static decode(input, obase) {
        return decode(input, obase);
    }

    //- encode with instanceof
    encode(input, ibase) {
        return encode(input, ibase);
    }

    //- decode with instanceof
    decode(input, obase) {
        return decode(input, obase);
    }

    get(k) {
        return config.get(k);
    }

    set(k, v) {
        return config.set(k, v);
    }

}

module.exports = Base62x;