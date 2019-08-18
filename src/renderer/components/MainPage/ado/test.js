import { QueryHelper } from "./connection";
import { resolve } from "path";
import { config } from "dotenv";
config({ path: resolve(__dirname, "../.env.ado") });
let queryHelper = new QueryHelper(process.env.ADO_TOKEN, "CSEng");
// queryHelper.getField("CSEIndustry").then(function(result){
//     console.log(result);
// });
// queryHelper.loadParticipantByIndustry('Manufacturing & Resources', '7/1/2019', '7/10/2019').then(function(result){
//         //console.log(result);
//     });
queryHelper.getWorkItems([225515]).then(function (result) {
    console.log(result);
});
