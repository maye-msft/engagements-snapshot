import * as azdev from "azure-devops-node-api";
import axios  from "axios";

// your collection url
let orgUrl = "https://dev.azure.com/csefy19";

import { resolve } from "path"

import { config } from "dotenv"

config({ path: resolve(__dirname, "../.env.ado") })


let token: string = process.env.ADO_TOKEN

let authHandler = azdev.getPersonalAccessTokenHandler(token); 
let connection = new azdev.WebApi(orgUrl, authHandler);    

import * as ba from "azure-devops-node-api/BuildApi";
import * as wita from "azure-devops-node-api/WorkItemTrackingApi";

import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";

async function runWorkItemTracking() {
    let project: string = "CSEng";
    let workItemTracking: wita.IWorkItemTrackingApi = await connection.getWorkItemTrackingApi();

    // let types = await workItemTracking.getWorkItemTypes(project);

    // types.forEach((type) => {
    //     console.log(`${type.name} ${type.referenceName}`);
    // });    

    let queryString:string =`SELECT
    [System.Title],
    [System.AssignedTo],
    [CSEngineering-V2.ParticipationStartDate],
    [Custom.Region],
    [CSEngineering-V2.CountrySelection],
    [System.State],
    [System.Tags],
    [System.Id]
FROM workitemLinks
WHERE
    (
        [Source].[System.TeamProject] = 'Organizations'
        AND [Source].[System.WorkItemType] = 'Organization'
        AND (
            [Source].[System.Title] = 'TSMC'
        )
    )
    AND (
        [System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward'
    )
    AND (
        [Target].[System.WorkItemType] = 'Participant'
        AND [Target].[System.State] <> 'Removed'
    )
ORDER BY [System.Title] DESC
MODE (Recursive)`;

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

                        
    workItemTracking.queryByWiql({query:queryString})
    .then(function(result){
        console.log(result.columns);
        // console.log(result.workItemRelations);
        result.workItemRelations.forEach((item)=>{
            item.rel
            console.log(item.rel);
            console.log(item.source);
            if(item.target!=null) {
                workItemTracking.getWorkItem(item.target.id).then((result2)=>{
                    console.log(result2);
                    
                })

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
    })

    
}

async function run() {
    let project: string = "CSEng";
    let build: ba.IBuildApi = await connection.getBuildApi();
    let defs: bi.DefinitionReference[] = await build.getDefinitions(project);

    defs.forEach((defRef: bi.DefinitionReference) => {
        console.log(`${defRef.name} (${defRef.id})`);
    });    
}

runWorkItemTracking();


