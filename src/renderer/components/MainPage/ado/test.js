var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { QueryHelper } from "./connection";
import { resolve } from "path";
import { config } from "dotenv";
config({ path: resolve(__dirname, "../.env.ado") });
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
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let queryHelper = new QueryHelper('jdc35unpwwd6blfevhxmykpycw5paw2f4fhlsmipknuckzpfztja', "CSEng");
        let engagement = yield queryHelper.getWorkItems([225515]);
        console.log(engagement);
        let myEmitter = queryHelper.getEmitter();
        myEmitter.on('getresults', (total, current) => {
            console.log(current + "/" + total);
        });
        myEmitter.on('done', (engagements) => {
            console.log(Object.keys(engagements).length);
        });
        let engagements = yield queryHelper.queryEngagements('Manufacturing & Resources', '2019-09-01', '2019-09-04', null);
        Object.keys(engagements).forEach((id) => {
            console.log(engagements[id].fields["System.Title"]);
            console.log(engagements[id].Organization.fields["System.Title"]);
            console.log(engagements[id].Activity.length);
        });
    });
})();
