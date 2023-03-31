import { JsonRpcProvider, Connection } from '@mysten/sui.js';
import Excel from 'exceljs'
import {format} from 'date-fns';

async function readKeyFromFile(workbook: Excel.Workbook, filePath: string){
    await workbook.xlsx.readFile(filePath);
}

const provider = new JsonRpcProvider(
    new Connection({fullnode:'https://fullnode.testnet.sui.io',faucet: 'https://faucet.testnet.sui.io/gas'}));

const INIT_ROW_INDEX = 2;
const ADDRESS_CELL_INDEX = 2;
const FAUCET_CELL_INDEX = 5;

export class Faucet {
    keyFile: string;
    maxFaucet: number;
    maxRowPerFaucet: number;
    callback: Function;
    constructor(keyFile:string, maxFaucet=2, 
                maxRowPerFaucet=5, callback = ()=>{}) {
        this.keyFile = keyFile;
        this.maxFaucet = maxFaucet;
        this.maxRowPerFaucet = maxRowPerFaucet;
        this.callback = callback;
    }

    run():void{
        console.log(format(new Date(), 'yyyy-MM-dd hh:mm:ss'), "start run faucet script.")
        const workbook = new Excel.Workbook();
       
        readKeyFromFile(workbook, this.keyFile).then(()=>{
            console.log(format(new Date(), 'yyyy-MM-dd hh:mm:ss'), "load key file sucessfully.")
            return this.faucet(workbook, this.keyFile);
        }).catch(err => {
            console.log(err);
        }).finally(()=>{
            console.log(format(new Date(), 'yyyy-MM-dd hh:mm:ss'), "faucet script run done.");
            //执行回调
            this.callback();
        })
    }

    async faucet(workbook: Excel.Workbook, keyFile: string) {
        let worksheet = workbook.getWorksheet(1);
        let rowCount = worksheet.rowCount;
        let rows = worksheet.getRows(INIT_ROW_INDEX, rowCount -1) || [];
        let faucet_address_count = 1;
        for(let i=0; i< rows.length; i++) {
            let row = rows[i];
            let address = row.getCell(ADDRESS_CELL_INDEX).text;
            let faucetCount = this.getFaucetCount(address, row);
            if(faucetCount >= this.maxFaucet) {
                continue;
            }
            if(faucet_address_count > this.maxRowPerFaucet) {
                break;
            }
            await provider.requestSuiFromFaucet(address).then(result => {
                console.log(format(new Date(), 'yyyy-MM-dd hh:mm:ss'), address + " faucet done.");
                faucet_address_count++;
                this.updateFaucetCount(address, row);
            }).catch(err =>{
                throw new Error(format(new Date(), 'yyyy-MM-dd hh:mm:ss')+" "+ address+" faucet error." + err);
            }).finally(() => {
            });
        }
        console.log(format(new Date(), 'yyyy-MM-dd hh:mm:ss'), "faucet done, will save key file.");
        //save file
        await workbook.xlsx.writeFile(keyFile);
        console.log(format(new Date(), 'yyyy-MM-dd hh:mm:ss'), "save key file sucessful!");
    }

    /**
     * update faucet count
     * @param address 
     * @param row 
     */
    updateFaucetCount(address: string, row: Excel.Row) {
        let faucetCell =  row.getCell(FAUCET_CELL_INDEX);
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
    getFaucetCount(address: string, row: Excel.Row): number {
        let faucetCell =  row.getCell(FAUCET_CELL_INDEX);
        let facunt_count = 0;
        if(faucetCell.value) {
            try{
                facunt_count = Number.parseInt(faucetCell.toString());
            }catch(err)  {
                console.log(format(new Date(), 'yyyy-MM-dd hh:mm:ss'), ' read ' + address + " faucet error. " + err);
                facunt_count = 0;
            }
        } else {
            facunt_count = 0;
        }
        return facunt_count;
    }
}


