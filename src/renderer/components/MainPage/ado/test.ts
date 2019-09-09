import {QueryHelper} from "./connection";

import { resolve } from "path"

import { config } from "dotenv"
import { totalmem } from "os";

config({ path: resolve(__dirname, "../.env.ado") })

console.log(process.env.ADO_TOKEN);



// queryHelper.getField("CSEIndustry").then(function(result){
//     console.log(result);
// });
// queryHelper.loadParticipantByIndustry('Manufacturing & Resources', '7/1/2019', '7/10/2019').then(function(result){
//         //console.log(result);
//     });






    // queryHelper.getWorkItems([225515]).then(function(result){
    //     console.log(result);
    // });

(async function(){
    let queryHelper = new QueryHelper(process.env.ADO_TOKEN, "CSEng")
    let engagement = await queryHelper.getWorkItems([225515])
    console.log(engagement);
    let myEmitter = queryHelper.getEmitter()
    myEmitter.on('getresults', (total, current)=>{
        console.log(current+"/"+total);
    })
    myEmitter.on('done', (engagements)=>{
        console.log(Object.keys(engagements).length);
    }) 
    let engagements = await queryHelper.queryEngagements('Manufacturing & Resources', '2019-09-01', '2019-09-04', null)  as Array<any>
    Object.keys(engagements).forEach((id)=>{
        console.log(engagements[id].fields["System.Title"])
        console.log(engagements[id].Organization.fields["System.Title"])
        console.log(engagements[id].Activity.length)
    })
})()
    
    