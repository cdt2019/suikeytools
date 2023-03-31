import { Ed25519Keypair } from '@mysten/sui.js';
import { generateMnemonic } from "./bip39";
import { fromB64 } from '@mysten/sui.js';
import { bytesToHex } from '@noble/hashes/utils';

import { parse } from 'ts-command-line-args';
import os from 'os'
import Excel from 'exceljs'
import * as fs from 'fs';
import * as path from 'path';
import {format} from 'date-fns';

interface GenKeyArguments {
    filepath?: string,
    filename?: string,
    num?: number,
}

interface KeyInfo {
    mnemonic: string,
    address: string,
    privateKey: string,
    publicKey: string,
}

class GenSuikey {
    genKey(): KeyInfo {
        const mnemonic = generateMnemonic();
        const ed25519Keypair = Ed25519Keypair.deriveKeypair(mnemonic);
        const publicKey = ed25519Keypair.getPublicKey();
        const address = publicKey.toSuiAddress();
        const privateKeyStr = `0x${bytesToHex(
            fromB64(ed25519Keypair.export().privateKey).slice(0, 32)
        )}`;
        const publicKeyStr =`0x${bytesToHex(publicKey.toBytes())}`;
        return {
            mnemonic: mnemonic,
            address: address,
            privateKey: privateKeyStr,
            publicKey: publicKeyStr,
        }
    }
}

//parse command line argruments
const args = parse<GenKeyArguments>({
    filepath: {type: String, alias: 'p', description: 'save file path', optional: true},
    filename: {type: String, alias: 'f', description: 'save file name', optional: true},
    num:  {type: Number, alias: 'n', description: 'number of generate key', optional: true},
},
// {
//     helpArg: 'help',
//     headerContentSections: [{ header: 'My Example Config', content: 'Thanks for using Our Awesome Library' }],
//     footerContentSections: [{ header: 'Footer', content: `Copyright: Big Faceless Corp. inc.` }],
// }
);

let { filepath, filename, num } =  {
    filepath: args.filepath || os.homedir(),
    filename: args.filename || "sui_key.xlsx",
    num: args.num || 20
}

//gen key
let keyArr: KeyInfo[] = [];
console.log('%s %s %s %s', 'address', 'mnemonic', 'privateKey', 'publicKey');
const genSuiKey = new GenSuikey();
for(let idx = 0; idx < num; idx++) {
    const keyInfo = genSuiKey.genKey();
    console.log('%s "%s" %s %s', keyInfo.address, keyInfo.mnemonic, keyInfo.privateKey, keyInfo.publicKey)
    keyArr.push(keyInfo);
}

let workbook = new Excel.Workbook();
let worksheet = workbook.addWorksheet();
worksheet.columns = [
                    {header: "MNEMONIC", key: 'mnemonic', width:90},
                    {header: "ADDRESS", key: 'address', width: 45},
                    {header: "PRIVATE KEY", key: 'privateKey', width: 70},
                    {header: "PUBLIC KEY", key: 'publicKey', width: 70},
                ];
// header row set bold and center
let headerRow = worksheet.getRow(1);
headerRow.eachCell(cell => {
    cell.style = {
        font: {
            bold: true,
        },
        alignment:{
            horizontal: 'center',
        },
    };
});

//add data
worksheet.addRows(keyArr);

//.xlsx
if(!filename.endsWith('.xlsx')) {
    filename += '.xlsx';
}

//write file
let writeFilePath = path.join(filepath, filename);
//exist file save new other file
if(fs.existsSync(writeFilePath)) {
    const filenameOption = path.parse(filename);    
    filename = filenameOption.name + "_" + format(new Date(), 'yyyyMMddHHmmss') +filenameOption.ext;
    writeFilePath = path.join(filepath, filename);
}

//write file
console.log("key file save path: ", writeFilePath);
writeKeyFile(workbook, writeFilePath);
async function writeKeyFile(workbook: Excel.Workbook, writeFilePath: string){
    await workbook.xlsx.writeFile(writeFilePath);
}
console.log("save key file sucessfully!");

// node .\src\index.js --filepath=C:\Users\cxw\Desktop\ --filename=sui_key.xlsx --num=20
// node .\src\index.js --p=C:\Users\cxw\Desktop\ --f=sui-key --n=20

// npm run build
// npm run start


