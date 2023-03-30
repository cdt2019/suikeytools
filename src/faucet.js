"use strict";
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
const exceljs_1 = __importDefault(require("exceljs"));
function readKeyFromFile(workbook, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield workbook.xlsx.readFile(filePath);
    });
}
const provider = new sui_js_1.JsonRpcProvider(new sui_js_1.Connection({ fullnode: 'https://fullnode.testnet.sui.io',
    faucet: 'https://faucet.testnet.sui.io/gas' }));
const filename = "C:\\Users\\cxw\\Desktop\\sui_key.xlsx";
const workbook = new exceljs_1.default.Workbook();
readKeyFromFile(workbook, filename).then(() => {
    return faucet(workbook);
}).catch(err => {
    console.log(err);
}).finally(() => {
    console.log("finally");
});
function faucet(workbook) {
    return __awaiter(this, void 0, void 0, function* () {
        let worksheet = workbook.getWorksheet(1);
        let rowCount = worksheet.rowCount;
        let rows = worksheet.getRows(1, 3) || [];
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let address = row.getCell(2).text;
            yield provider.requestSuiFromFaucet(address).then(result => {
                console.log(result);
            }).catch(err => {
                throw new Error(`address, "faucet error.", {err}`);
            }).finally(() => {
            });
        }
    });
}
// const main = async () => {
//     const workbook = new Excel.Workbook();
//     //const content = await workbook.xlsx.readFile("D:\\1.xlsx");
//     const content = await workbook.xlsx.readFile("D:\\1.xlsx");
//     const worksheet = content.getWorksheet("Sheet2");
//     console.log(worksheet.rowCount)
//     console.log(worksheet.getRow(1))
//     console.log(worksheet.getRow(2).cellCount)
//     console.log(worksheet.getRow(2).getCell(1).text)
//   };
//   main().then();
