"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var azdev = require("azure-devops-node-api");
// your collection url
var orgUrl = "https://dev.azure.com/csefy19";
var path_1 = require("path");
var dotenv_1 = require("dotenv");
dotenv_1.config({ path: path_1.resolve(__dirname, "../.env.ado") });
var token = process.env.ADO_TOKEN;
var authHandler = azdev.getPersonalAccessTokenHandler(token);
var connection = new azdev.WebApi(orgUrl, authHandler);
function runWorkItemTracking() {
    return __awaiter(this, void 0, void 0, function () {
        var project, workItemTracking, queryString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    project = "CSEng";
                    return [4 /*yield*/, connection.getWorkItemTrackingApi()];
                case 1:
                    workItemTracking = _a.sent();
                    queryString = "SELECT\n    [System.Title],\n    [System.AssignedTo],\n    [CSEngineering-V2.ParticipationStartDate],\n    [Custom.Region],\n    [CSEngineering-V2.CountrySelection],\n    [System.State],\n    [System.Tags],\n    [System.Id]\nFROM workitemLinks\nWHERE\n    (\n        [Source].[System.TeamProject] = 'Organizations'\n        AND [Source].[System.WorkItemType] = 'Organization'\n        AND (\n            [Source].[System.Title] = 'TSMC'\n        )\n    )\n    AND (\n        [System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward'\n    )\n    AND (\n        [Target].[System.WorkItemType] = 'Participant'\n        AND [Target].[System.State] <> 'Removed'\n    )\nORDER BY [System.Title] DESC\nMODE (Recursive)";
                    //  `SELECT
                    //                         [System.Title],
                    //                         [System.AssignedTo],
                    //                         [Custom.Region],
                    //                         [CSEngineering-V2.CountrySelection],
                    //                         [System.State],
                    //                         [System.Tags],
                    //                         [System.Id],
                    //                         [CSEngineering-V2-Orgs.CSEIndustry],
                    //                         [System.Description],
                    //                         [System.CreatedDate],
                    //                         [CSEngineering-V2.SEIorSEDWR],
                    //                         [CSEngineering-V2-Orgs.T400],
                    //                         [CSEngineering-V2.VMProjectACR]
                    //                     FROM workitemLinks
                    //                     WHERE
                    //                         (
                    //                             [Source].[System.TeamProject] = 'Organizations'
                    //                             AND [Source].[System.WorkItemType] = 'Organization'
                    //                             AND [Source].[CSEngineering-V2-Orgs.CSEIndustry] = 'Manufacturing & Resources'
                    //                             AND [Source].[CSEngineering-V2-Orgs.T400] = true
                    //                         )
                    //                         AND (
                    //                             [System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward'
                    //                         )
                    //                         AND (
                    //                             [Target].[System.WorkItemType] = 'Engagement'
                    //                             AND [Target].[System.State] <> 'Removed'
                    //                             AND [Target].[System.State] <> 'Disengaged'
                    //                             AND [Target].[System.State] <> 'On Hold'
                    //                             AND [Target].[System.CreatedDate] > @StartOfDay('-365d')
                    //                         )
                    //                     ORDER BY [System.Title] DESC
                    //                     MODE (Recursive)`;
                    workItemTracking.queryByWiql({ query: queryString })
                        .then(function (result) {
                        console.log(result.columns);
                        // console.log(result.workItemRelations);
                        result.workItemRelations.forEach(function (item) {
                            item.rel;
                            console.log(item.rel);
                            console.log(item.source);
                            if (item.target != null) {
                                workItemTracking.getWorkItem(item.target.id).then(function (result2) {
                                    console.log(result2);
                                });
                                // workItemTracking.getComments("CSEng", item.target.id).then((result2)=>{
                                //     console.log(result2);
                                // })
                            }
                            // if(item.source!=null) {
                            //     axios.get(item.source.url)
                            //     .then(function (response) {
                            //         // handle success
                            //         console.log(response);
                            //     })
                            //     .catch(function (error) {
                            //         // handle error
                            //         console.log(error);
                            //     })
                            //     .finally(function () {
                            //         // always executed
                            //     });
                            // }
                            //console.log(item.target);
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var project, build, defs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    project = "CSEng";
                    return [4 /*yield*/, connection.getBuildApi()];
                case 1:
                    build = _a.sent();
                    return [4 /*yield*/, build.getDefinitions(project)];
                case 2:
                    defs = _a.sent();
                    defs.forEach(function (defRef) {
                        console.log(defRef.name + " (" + defRef.id + ")");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
runWorkItemTracking();
