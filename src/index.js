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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sui_js_1 = require("@mysten/sui.js");
const bip39_1 = require("./bip39");
const sui_js_2 = require("@mysten/sui.js");
const utils_1 = require("@noble/hashes/utils");
const ts_command_line_args_1 = require("ts-command-line-args");
const os_1 = __importDefault(require("os"));
const exceljs_1 = __importDefault(require("exceljs"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const date_fns_1 = require("date-fns");
class GenSuikey {
    genKey() {
        const mnemonic = (0, bip39_1.generateMnemonic)();
        const ed25519Keypair = sui_js_1.Ed25519Keypair.deriveKeypair(mnemonic);
        const publicKey = ed25519Keypair.getPublicKey();
        const address = publicKey.toSuiAddress();
        const privateKeyStr = `0x${(0, utils_1.bytesToHex)((0, sui_js_2.fromB64)(ed25519Keypair.export().privateKey).slice(0, 32))}`;
        const publicKeyStr = `0x${(0, utils_1.bytesToHex)(publicKey.toBytes())}`;
        return {
            mnemonic: mnemonic,
            address: address,
            privateKey: privateKeyStr,
            publicKey: publicKeyStr,
        };
    }
}
//parse command line argruments
const args = (0, ts_command_line_args_1.parse)({
    filepath: { type: String, alias: 'p', description: 'save file path', optional: true },
    filename: { type: String, alias: 'f', description: 'save file name', optional: true },
    num: { type: Number, alias: 'n', description: 'number of generate key', optional: true },
});
let { filepath, filename, num } = {
    filepath: args.filepath || os_1.default.homedir(),
    filename: args.filename || "sui_key.xlsx",
    num: args.num || 20
};
//gen key
let keyArr = [];
console.log('%s %s %s %s', 'address', 'mnemonic', 'privateKey', 'publicKey');
const genSuiKey = new GenSuikey();
for (let idx = 0; idx < num; idx++) {
    const keyInfo = genSuiKey.genKey();
    console.log('%s "%s" %s %s', keyInfo.address, keyInfo.mnemonic, keyInfo.privateKey, keyInfo.publicKey);
    keyArr.push(keyInfo);
}
let workbook = new exceljs_1.default.Workbook();
let worksheet = workbook.addWorksheet();
worksheet.columns = [
    { header: "MNEMONIC", key: 'mnemonic', width: 90 },
    { header: "ADDRESS", key: 'address', width: 45 },
    { header: "PRIVATE KEY", key: 'privateKey', width: 70 },
    { header: "PUBLIC KEY", key: 'publicKey', width: 70 },
];
// header row set bold and center
let headerRow = worksheet.getRow(1);
headerRow.eachCell(cell => {
    cell.style = {
        font: {
            bold: true,
        },
        alignment: {
            horizontal: 'center',
        },
    };
});
//add data
worksheet.addRows(keyArr);
//.xlsx
if (!filename.endsWith('.xlsx')) {
    filename += '.xlsx';
}
//write file
let writeFilePath = path.join(filepath, filename);
//exist file save new other file
if (fs.existsSync(writeFilePath)) {
    const filenameOption = path.parse(filename);
    filename = filenameOption.name + "_" + (0, date_fns_1.format)(new Date(), 'yyyyMMddHHmmss') + filenameOption.ext;
    writeFilePath = path.join(filepath, filename);
}
//write file
console.log("key file save path: ", writeFilePath);
writeKeyFile(workbook, writeFilePath);
function writeKeyFile(workbook, writeFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield workbook.xlsx.writeFile(writeFilePath);
    });
}
console.log("save key file sucessfully!");
// node .\src\index.js --filepath=C:\Users\cxw\Desktop\ --filename=sui-key.xlsx --num=20
// node .\src\index.js --p=C:\Users\cxw\Desktop\ --f=sui-key --n=20
