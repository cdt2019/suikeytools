"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genkey = void 0;
const sui_js_1 = require("@mysten/sui.js");
const bip39_1 = require("./bip39");
const sui_js_2 = require("@mysten/sui.js");
const utils_1 = require("@noble/hashes/utils");
class Genkey {
    static gen() {
        const mnemonic = (0, bip39_1.generateMnemonic)();
        const ed25519Keypair = sui_js_1.Ed25519Keypair.deriveKeypair(mnemonic);
        const publicKey = ed25519Keypair.getPublicKey();
        const address = publicKey.toSuiAddress();
        const privateKeyStr = `0x${(0, utils_1.bytesToHex)((0, sui_js_2.fromB64)(ed25519Keypair.export().privateKey).slice(0, 32))}`;
        const publicKeyStr = `0x${(0, utils_1.bytesToHex)(publicKey.toBytes())}`;
        console.log(mnemonic);
        console.log(publicKeyStr);
        console.log(privateKeyStr);
        console.log(address);
    }
}
exports.Genkey = Genkey;
Genkey.gen();
