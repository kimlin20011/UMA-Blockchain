const EthCrypto = require('eth-crypto');


let vrs = EthCrypto.vrs.fromString(`0x50edcf4bf17e6c00c75e5176f0ee732782f013e1585f1718401129309a24d4ff4be7412a7a101c02d699747d6397c0a71ea16f24a34af883de46e0cd9e1ee3bf1b`);
console.log(vrs);