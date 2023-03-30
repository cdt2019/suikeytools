"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertBytes = exports.toEntropy = exports.entropyToSerialized = exports.normalizeMnemonics = exports.validateMnemonics = exports.validateEntropy = exports.getRandomEntropy = exports.entropyToMnemonic = exports.mnemonicToEntropy = exports.generateMnemonic = void 0;
// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
const utils_1 = require("@noble/hashes/utils");
const bip39 = __importStar(require("@scure/bip39"));
const english_1 = require("@scure/bip39/wordlists/english");
/**
 * Generate mnemonics as 12 words string using the english wordlist.
 *
 * @returns a 12 words string separated by spaces.
 */
function generateMnemonic() {
    return bip39.generateMnemonic(english_1.wordlist);
}
exports.generateMnemonic = generateMnemonic;
/**
 * Converts mnemonic to entropy (byte array) using the english wordlist.
 *
 * @param mnemonic 12-24 words
 *
 * @return the entropy of the mnemonic (Uint8Array)
 */
function mnemonicToEntropy(mnemonic) {
    return bip39.mnemonicToEntropy(mnemonic, english_1.wordlist);
}
exports.mnemonicToEntropy = mnemonicToEntropy;
/**
 * Converts entropy (byte array) to mnemonic using the english wordlist.
 *
 * @param entropy Uint8Array
 *
 * @return the mnemonic as string
 */
function entropyToMnemonic(entropy) {
    return bip39.entropyToMnemonic(entropy, english_1.wordlist);
}
exports.entropyToMnemonic = entropyToMnemonic;
/**
 * Generate random byte to be used as entropy for the mnemonic
 * @param strength defaults to 128 to generate 12-word mnemonic that now is the default for the wallet
 * @returns
 */
function getRandomEntropy(strength = 128) {
    return (0, utils_1.randomBytes)(strength / 8);
}
exports.getRandomEntropy = getRandomEntropy;
/**
 * Validates entropy see https://github.com/paulmillr/scure-bip39/blob/4b4a17f13862da0b7ff3db1ef9d1bb3c2fc05e14/src/index.ts#L27
 * @param entropy
 * @returns {boolean} true
 * @throws if entropy is invalid
 */
function validateEntropy(entropy) {
    assertBytes(entropy, 16, 20, 24, 28, 32);
    return true;
}
exports.validateEntropy = validateEntropy;
/**
 * Validate a mnemonic string in the BIP39 English wordlist.
 *
 * @param mnemonics a words string split by spaces of length 12/15/18/21/24.
 *
 * @returns true if the mnemonic is valid, false otherwise.
 */
function validateMnemonics(mnemonics) {
    return bip39.validateMnemonic(mnemonics, english_1.wordlist);
}
exports.validateMnemonics = validateMnemonics;
/**
 * Sanitize the mnemonics string provided by user.
 *
 * @param mnemonics a 12-word string split by spaces that may contain mixed cases
 * and extra spaces.
 *
 * @returns a sanitized mnemonics string.
 */
function normalizeMnemonics(mnemonics) {
    return mnemonics
        .trim()
        .split(/\s+/)
        .map((part) => part.toLowerCase())
        .join(' ');
}
exports.normalizeMnemonics = normalizeMnemonics;
/**
 * Serializes entropy
 * @param entropy
 * @returns {string} the serialized value
 */
function entropyToSerialized(entropy) {
    return (0, utils_1.bytesToHex)(entropy);
}
exports.entropyToSerialized = entropyToSerialized;
/**
 *
 * @param serializedEntropy the serialized value of entropy (produced by {@link entropyToSerialized})
 * @returns the entropy bytes
 */
function toEntropy(serializedEntropy) {
    return (0, utils_1.hexToBytes)(serializedEntropy);
}
exports.toEntropy = toEntropy;
// ported from https://github.com/paulmillr/noble-hashes/blob/main/src/_assert.ts#L9
function assertBytes(b, ...lengths) {
    if (!(b instanceof Uint8Array))
        throw new TypeError('Expected Uint8Array');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new TypeError(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
exports.assertBytes = assertBytes;
