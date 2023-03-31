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
exports.Faucet = void 0;
const sui_js_1 = require("@mysten/sui.js");
const exceljs_1 = __importDefault(require("exceljs"));
const date_fns_1 = require("date-fns");
function readKeyFromFile(workbook, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield workbook.xlsx.readFile(filePath);
    });
}
const provider = new sui_js_1.JsonRpcProvider(new sui_js_1.Connection({ fullnode: 'https://fullnode.testnet.sui.io', faucet: 'https://faucet.testnet.sui.io/gas' }));
const INIT_ROW_INDEX = 2;
const ADDRESS_CELL_INDEX = 2;
const FAUCET_CELL_INDEX = 5;
class Faucet {
    constructor(keyFile, maxFaucet = 2, maxRowPerFaucet = 5, callback = () => { }) {
        this.keyFile = keyFile;
        this.maxFaucet = maxFaucet;
        this.maxRowPerFaucet = maxRowPerFaucet;
        this.callback = callback;
    }
    run() {
        console.log((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd hh:mm:ss'), "start run faucet script.");
        const workbook = new exceljs_1.default.Workbook();
        readKeyFromFile(workbook, this.keyFile).then(() => {
            console.log((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd hh:mm:ss'), "load key file sucessfully.");
            return this.faucet(workbook, this.keyFile);
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            console.log((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd hh:mm:ss'), "faucet script run done.");
            //执行回调
            this.callback();
        });
    }
    faucet(workbook, keyFile) {
        return __awaiter(this, void 0, void 0, function* () {
            let worksheet = workbook.getWorksheet(1);
            let rowCount = worksheet.rowCount;
            let rows = worksheet.getRows(INIT_ROW_INDEX, rowCount - 1) || [];
            let faucet_address_count = 1;
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                let address = row.getCell(ADDRESS_CELL_INDEX).text;
                let faucetCount = this.getFaucetCount(address, row);
                if (faucetCount >= this.maxFaucet) {
                    continue;
                }
                if (faucet_address_count > this.maxRowPerFaucet) {
                    break;
                }
                yield provider.requestSuiFromFaucet(address).then(result => {
                    console.log((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd hh:mm:ss'), address + " faucet done.");
                    faucet_address_count++;
                    this.updateFaucetCount(address, row);
                }).catch(err => {
                    throw new Error((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd hh:mm:ss') + " " + address + "faucet error." + err);
                }).finally(() => {
                });
            }
            console.log((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd hh:mm:ss'), "faucet done, will save key file.");
            //save file
            yield workbook.xlsx.writeFile(keyFile);
            console.log((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd hh:mm:ss'), "save key file sucessful!");
        });
    }
    /**
     * update faucet count
     * @param address
     * @param row
     */
    updateFaucetCount(address, row) {
        let faucetCell = row.getCell(FAUCET_CELL_INDEX);
        let faucetCount = this.getFaucetCount(address, row);
        faucetCell.value = faucetCount + 1;
        row.commit();
    }
    /**
     * get address faucet count
     * @param address
     * @param row
     * @returns
     */
    getFaucetCount(address, row) {
        let faucetCell = row.getCell(FAUCET_CELL_INDEX);
        let facunt_count = 0;
        if (faucetCell.value) {
            try {
                facunt_count = Number.parseInt(faucetCell.toString());
            }
            catch (err) {
                console.log((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd hh:mm:ss'), ' read ' + address + " faucet error. " + err);
                facunt_count = 0;
            }
        }
        else {
            facunt_count = 0;
        }
        return facunt_count;
    }
}
exports.Faucet = Faucet;
