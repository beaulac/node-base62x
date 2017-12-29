# node-base62x

[Base62x](http://ieeexplore.ieee.org/document/6020065/?arnumber=6020065) is an alternative to Base64 that does not use any non-alphanumeric symbols in output. Instead, an alphanumeric 'tag' symbol ('x' by default) is chosen. This tag symbol is removed from the encoding alphabet, and no longer used alone to represent a value. This leaves alphanumeric values representing values from 0-60. Values 61, 62, and 63 are represented by x1, x2, x3, respectively. 

This node implementation was inspired by [wadelau's polyglot Base62x repository](https://github.com/wadelau/Base62x).

## Usage

```javascript
var base62x = require('base62x');

var encoded = base62x.encode('hello');
var decodedBuffer = base62x.decode(encoded);
var decodedString = base62x.decodeString(encoded);
```

#### Methods

##### encode(string | Buffer): string
##### decode(string): Buffer
##### decodeString(string): string

## Config

Set the 'xtag' property to any alphanumeric value to choose it as the 'tag' value. The alphabet / lookup tables are automagically computed.
```javascript
base62x.config.xtag = 'w';
```

