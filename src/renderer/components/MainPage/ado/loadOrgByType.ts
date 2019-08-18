import {QueryHelper} from "./connection";
import { resolve } from "path"

import { config } from "dotenv"

config({ path: resolve(__dirname, "../.env.ado") })



let queryHelper = new QueryHelper(process.env.ADO_TOKEN, "CSEng")

queryHelper.runQuery(`SELECT
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
MODE (Recursive)`).then(function(result){
    console.log(result.columns);
});