import { JsonRpcProvider, Connection } from '@mysten/sui.js';
import Excel from 'exceljs'

async function readKeyFromFile(workbook: Excel.Workbook, filePath: string){
    await workbook.xlsx.readFile(filePath);
}

const provider = new JsonRpcProvider(
    new Connection({fullnode:'https://fullnode.testnet.sui.io',
                     faucet: 'https://faucet.testnet.sui.io/gas'}));

const filename = "C:\\Users\\cxw\\Desktop\\sui_key.xlsx";
const workbook = new Excel.Workbook();
readKeyFromFile(workbook, filename).then(()=>{
   return faucet(workbook);
}).catch(err => {
    console.log(err);
}).finally(()=>{
    console.log("finally")
})

async function faucet(workbook: Excel.Workbook) {
    let worksheet = workbook.getWorksheet(1);
    let rowCount = worksheet.rowCount;
    let rows = worksheet.getRows(1, 3) || [];
    for(let i=0; i< rows.length; i++) {
        let row = rows[i];
        let address = row.getCell(2).text;
        await provider.requestSuiFromFaucet(address).then(result => {
            console.log(result);

        }).catch(err =>{
            throw new Error(`address, "faucet error.", {err}`);
        }).finally(() => {
        });
    }
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

