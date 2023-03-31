
import { parse } from 'ts-command-line-args';
import { Faucet } from "./faucet";

interface FaucetOption{
    keyFile: string;
    maxFaucet?: number;
    maxRow?: number;
    waitTime?: number;
}

const args = parse<FaucetOption>({
    keyFile: {type: String, alias: 'k', description: 'key file path'},
    maxFaucet: {type: Number, alias: 'f', description: 'max faucet count per address', optional: true},
    maxRow:  {type: Number, alias: 'r', description: 'max rows of per faucet round ', optional: true},
    waitTime:  {type: Number, alias: 'w', description: 'wait time for next round faucet ', optional: true},
});

let { keyFile, maxFaucet, maxRow, waitTime} =  {
    keyFile: args.keyFile,
    maxFaucet: args.maxFaucet,
    maxRow: args.maxRow,
    waitTime: args.waitTime || 1000 * 60 * 30, //30 minute
}

const tiemer = () => {
    console.log("wait a fews minute for new round faucet.");
    setTimeout(()=>{
        new Faucet(keyFile, maxFaucet, maxRow, tiemer).run();
    }, waitTime);
    return ;
};

let faucet = new Faucet(keyFile, maxFaucet, maxRow, tiemer);
faucet.run();

// class TestCase{
//     callback: Function;
//     constructor(callback=()=>{}) {
//         this.callback = callback;
//     }
//     test(){
//         console.log("test");
//         this.callback();
//     }
// }
// const tiemer = () => {
//     setTimeout(()=>{
//         new TestCase(tiemer).test();
//     },1000);
//     return ;
// };
// let  testCase = new TestCase(tiemer).test();


// node .\src\faucetTask.js --keyFile=C:\Users\cxw\Desktop\sui_key.xlsx --maxFaucet=5 --maxRow=5
// node .\src\faucetTask.js --keyFile=C:\Users\chen\Desktop\sui_key.xlsx --maxFaucet=5 --maxRow=5 --waitTime=1000
