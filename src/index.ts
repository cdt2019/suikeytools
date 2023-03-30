import { Ed25519Keypair } from '@mysten/sui.js';
import { generateMnemonic } from "./bip39";
import { fromB64 } from '@mysten/sui.js';
import { bytesToHex } from '@noble/hashes/utils';

export class Genkey {
    static gen() {
        const mnemonic = generateMnemonic();
        const ed25519Keypair = Ed25519Keypair.deriveKeypair(mnemonic);
        const publicKey = ed25519Keypair.getPublicKey();
        const address = publicKey.toSuiAddress();
        const privateKeyStr = `0x${bytesToHex(
            fromB64(ed25519Keypair.export().privateKey).slice(0, 32)
        )}`;
        const publicKeyStr =`0x${bytesToHex(publicKey.toBytes())}`;
        console.log(mnemonic)
        console.log(publicKeyStr)
        console.log(privateKeyStr)
        console.log(address)
    }
}

Genkey.gen()

