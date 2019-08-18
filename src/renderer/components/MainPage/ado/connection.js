var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as azdev from "azure-devops-node-api";
import { resolve } from "path";
import { config } from "dotenv";
config({ path: resolve(__dirname, "../.env.ado") });
let orgUrl = "https://dev.azure.com/csefy19";
export class QueryHelper {
    constructor(token, project) {
        this.token = token;
        this.project = project;
        let authHandler = azdev.getPersonalAccessTokenHandler(token);
        this.connection = new azdev.WebApi(orgUrl, authHandler);
    }
    runQuery(wiql) {
        return __awaiter(this, void 0, void 0, function* () {
            this.workItemTracking = yield this.connection.getWorkItemApi();
            return this.workItemTracking.queryByWiql({ query: wiql });
        });
    }
    getFields() {
        return __awaiter(this, void 0, void 0, function* () {
            this.workItemTracking = yield this.connection.getWorkItemApi();
            return this.workItemTracking.getFields(this.project);
        });
    }
    getField(field) {
        return __awaiter(this, void 0, void 0, function* () {
            this.workItemTracking = yield this.connection.getWorkItemApi();
            return this.workItemTracking.getField(field, this.project);
        });
    }
    getWorkItems(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let authHandler = azdev.getPersonalAccessTokenHandler(this.token);
            let connection = new azdev.WebApi(orgUrl, authHandler);
            let workItemTracking = yield connection.getWorkItemTrackingApi();
            return new Promise(function (resolve, reject) {
                workItemTracking.getWorkItems(ids)
                    .then((result) => {
                    resolve(result);
                }).catch(e => {
                    reject(e);
                });
            });
        });
    }
    loadParticipantByIndustry(industry, startday, endday) {
        return __awaiter(this, void 0, void 0, function* () {
            let authHandler = azdev.getPersonalAccessTokenHandler(this.token);
            let connection = new azdev.WebApi(orgUrl, authHandler);
            let workItemTracking = yield connection.getWorkItemTrackingApi();
            let querystring = `
SELECT
    [System.Id],
    [System.Title],
    [System.WorkItemType]
FROM workitemLinks
WHERE
    (
        [Source].[System.WorkItemType] = 'Organization'
        AND [Source].[CSEngineering-V2-Orgs.CSEIndustry] = '${industry}'
    )
    AND (
        [System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward'
    )
    AND (
        [Target].[System.WorkItemType] = 'Participant'
        AND [Target].[CSEngineering-V2.ParticipationStartDate] >= '${startday}'
        AND [Target].[CSEngineering-V2.ParticipationStartDate] <= '${endday}'
    )
MODE (Recursive)
        
        `;
            let that = this;
            let objects = {};
            let count = 0;
            //let workItemTracking: wita.IWorkItemTrackingApi = await this.connection.getWorkItemApi();
            return new Promise(function (resolve, reject) {
                workItemTracking.queryByWiql({ query: querystring })
                    .then(function (result) {
                    console.log(Object.keys(result));
                    result.workItemRelations.forEach((item, idx) => __awaiter(this, void 0, void 0, function* () {
                        if (item.source != null && !objects[item.source.id]) {
                            objects[item.source.id] = {};
                            objects[item.source.id].value = null;
                            objects[item.source.id].children = [];
                        }
                        if (item.target != null && !objects[item.target.id]) {
                            objects[item.target.id] = {};
                            objects[item.target.id].value = null;
                            objects[item.target.id].children = [];
                            if (item.source != null) {
                                objects[item.source.id].children.push(item.target.id);
                            }
                        }
                    }));
                    resolve(objects);
                    // let keys =  Object.keys(objects)
                    // let count = 0;
                    // keys.forEach((key, idx)=>{
                    //     that.loadWorkItem(key).then(res=>{
                    //         objects[key] = res
                    //         count++;
                    //         console.log(keys[idx] + " loaded! "+count+"/"+keys.length);
                    //         if(count == keys.length) {
                    //             resolve(objects)
                    //         } 
                    //     }).catch(e=>{
                    //         count++;
                    //         console.log(keys[idx] + " not loaded! "+count+"/"+keys.length);
                    //         if(count == keys.length) {
                    //             resolve(objects)
                    //         } 
                    //     })
                    // })
                    // function myloadWorkItem(idx) {
                    //     that.loadWorkItem(keys[idx]).then(res=>{
                    //         objects[keys[idx]] = res
                    //         console.log(keys[idx] + " loaded! "+idx+"/"+keys.length);
                    //         if(idx == keys.length-1) {
                    //             resolve(objects)
                    //         } else {
                    //             myloadWorkItem(idx+1)
                    //         }
                    //     }).catch(e=>{
                    //         console.log(keys[idx] + " not loaded! "+idx+"/"+keys.length);
                    //         if(idx == keys.length-1) {
                    //             resolve(objects)
                    //         } else {
                    //             myloadWorkItem(idx+1)
                    //         }
                    //     })
                    // }
                    // myloadWorkItem(0)
                }).catch(e => {
                    reject(e);
                });
            });
            //return this.runQuery(querystring)
        });
    }
    loadWorkItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let authHandler = azdev.getPersonalAccessTokenHandler(this.token);
            let connection = new azdev.WebApi(orgUrl, authHandler);
            let workItemTracking = yield connection.getWorkItemTrackingApi();
            return new Promise(function (resolve, reject) {
                workItemTracking.getWorkItem(id).then(res => {
                    resolve(res);
                }).catch(e => {
                    reject(e);
                });
            });
        });
    }
    // [CSEngineering-V2.ParticipationStartDate],
    // [CSEngineering-V2.ActivityDuration]
    loadWorkitems(ids, fields, workitemtype) {
        return __awaiter(this, void 0, void 0, function* () {
            let authHandler = azdev.getPersonalAccessTokenHandler(this.token);
            let connection = new azdev.WebApi(orgUrl, authHandler);
            let workItemTracking = yield connection.getWorkItemTrackingApi();
            let querystring = `
        SELECT
    [System.Id],
    [System.Title],
    [System.AssignedTo],
    [System.State],
    ${fields.join(',')}
FROM workitems
WHERE
    [System.WorkItemType] = '${workitemtype}'
    AND [System.Id] IN (${ids.join(",")})`;
            let that = this;
            let objects = {};
            let count = 0;
            //let workItemTracking: wita.IWorkItemTrackingApi = await this.connection.getWorkItemApi();
            return new Promise(function (resolve, reject) {
                workItemTracking.queryByWiql({ query: querystring })
                    .then(function (result) {
                    console.log(Object.keys(result));
                    objects = result;
                    resolve(objects);
                }).catch(e => {
                    reject(e);
                });
            });
            //return this.runQuery(querystring)
        });
    }
}
