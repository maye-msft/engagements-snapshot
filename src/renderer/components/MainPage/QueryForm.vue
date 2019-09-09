<template>
  <div>
    <el-form :label-position="'Top'" :model="queryForm">
      <el-row :gutter="5">
        <el-col :xs="24">
          <el-date-picker
            v-model="queryForm.fromDate"
            type="date"
            placeholder="From"
            style="width:100%"
          ></el-date-picker>
        </el-col>
        <el-col :xs="24">
          <el-date-picker
            v-model="queryForm.toDate"
            type="date"
            placeholder="To"
            style="width:100%"
          ></el-date-picker>
        </el-col>

        <el-col :xs="24">
          <el-select v-model="queryForm.industry" placeholder="Industry" style="width:100%">
            <el-option v-for="item in industryitems" :label="item" :value="item" v-bind:key="item"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24">
          <el-progress :text-inside="true" :stroke-width="24" :percentage="progressvalue"></el-progress>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" @click="onSubmit" style="width:100%">Search</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-form :label-position="'Top'">
      <el-row>
        <el-col :xs="24">
          <el-select
            multiple
            filterable
            v-model="columnOption"
            placeholder="Columns"
            style="width:100%"
            @change="setSelectedColumns(columnOption)"
          >
            <el-option v-for="item in columns" :label="item" :value="item" :key="item"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="24">
          <el-input placeholder="Text Filter" v-model="textfilter">
            <el-button slot="append" icon="el-icon-search" @click="textSearch()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-button type="success" @click="exportCSV" style="width:100%">Export</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { QueryHelper } from "./ado/connection";
import { mapState, mapMutations, mapActions } from "vuex";
import Fuse from "fuse.js";
import { setInterval } from "timers";
import { Loading } from "element-ui";
// import elasticlunr from "elasticlunr";
import FlexSearch from "flexsearch"
import Papa from "papaparse";
import util from "./util"
function getDate2(dateString) {
  const sdate = dateString.substr(0, 10).split("-");
  return new Date(sdate[0], sdate[1] - 1, sdate[2]).getTime();
}
export default {
  data() {
    return {
      objects: {},
      loading: true,
      progressvalue: 0,
      progresscount: 0,
      // engagements: [],
      categoryinfo: {},
      queryForm: {
        fromDate: new Date(),
        toDate: new Date(),
        industry: "",
        textfilter: null
      },
      // exportForm: {
      //   textfilter: null,
      //   columns: ['C','D'],
      // },
      searchIndex: null,
      industryitems: [
        "Automotive",
        "Education",
        "Financial Services",
        "Government",
        "Health",
        "Manufacturing & Resources",
        "Media & Communications",
        "Other Commercial Industries"
      ],
      textfilter: "",
      columnOption: [],
      queryResults: {}
      // selectedColumns: [

      // ]
    };
  },
  methods: {
    ...mapActions("Engagement", [
      "setEngagements",
      "setObjects",
      "setSelectedColumns"
    ]),
    onSubmit() {
      if(!this.access_token) {
        util.info("Please input AzDO Access Token in the 'Access Token' Panel.")
        return
      }
      let loadingInstance = Loading.service({ fullscreen: true });
      const queryHelper = new QueryHelper(this.access_token, "CSEng");
      let myEmitter = queryHelper.getEmitter();
      let that = this;
      myEmitter.on("getresults", (total, current) => {
        if(current>0)
          loadingInstance.close();
        that.progresscount = current;
        that.progressvalue = Math.round((current / total) * 100);
      });
      myEmitter.on("done", engagements => {
        console.log(Object.keys(engagements).length);
      });

      (async () => {
        this.queryResults = await queryHelper.queryEngagements(
          that.queryForm.industry,
          that.startDate,
          that.endDate,
          null
        );
        that.textSearch()
      })();
    },

    textSearch() {
      var that = this
      let engArray = [];
      Object.keys(that.queryResults).forEach(id => {
        engArray.push(that.queryResults[id]);
      });
      var searchIndex = that.categorizeEngagement(engArray)
      engArray = that.textFilterEngagements(searchIndex, that.textfilter) || engArray
      that.setEngagements(engArray);
    },

    // onSubmit() {
    //   console.log(this.startDate);
    //   console.log(this.endDate);
    //   console.log(this.queryForm.industry);
    //   const queryHelper = new QueryHelper(this.access_token, "CSEng");
    //   var that = this;
    //   that.loading = true;

    //   that.objects = {};
    //   that.progressvalue = 0;
    //   that.progresscount = 0;
    //   that.engagements = [];
    //   that.categoryinfo = {};

    //   let loadingInstance = Loading.service({ fullscreen: true });
    //   this.queryWorkItems(queryHelper)
    //     .then(result => {
    //       that.objects = result;
    //       let keys = Object.keys(that.objects);
    //       let count = 0;
    //       for (let i = 0; i < keys.length; i += 100) {
    //         let ids = keys.slice(i, Math.min(keys.length, i + 100));
    //         that
    //           .loadWorkItems(queryHelper, ids)
    //           .then(result2 => {
    //             that.$nextTick(() => {
    //               loadingInstance.close();
    //             });

    //             that.loading = false;
    //             ids.forEach(id => {
    //               result2.forEach(res => {
    //                 if (res.id == id) that.objects[id].value = res;
    //               });
    //             });

    //             that.progresscount += ids.length;
    //             that.progressvalue = Math.round(
    //               (that.progresscount / keys.length) * 100
    //             );
    //             //console.log(that.progressvalue);

    //             if (that.progresscount == keys.length) {
    //               that.treeitems = that.calctreeitems();
    //               // that.easticsearchBuildIndex(that.engagements);
    //               // that.categoryinfo = that.engagement2Category();
    //               that.setEngagements(that.engagements);
    //               that.setObjects(that.objects);
    //             }
    //           })
    //           .catch(error => {
    //             console.log(error);
    //           });
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    strip(html) {
      html = html || "";

      return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, "").trim();
    },
    queryWorkItems(queryHelper) {
      return queryHelper.loadParticipantByIndustry(
        this.queryForm.industry,
        this.startDate,
        this.endDate
      );
    },
    loadWorkItems(queryHelper, ids) {
      return queryHelper.getWorkItems(ids);
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return [month, day, year].join("/");
    },
    calctreeitems() {
      var keys = Object.keys(this.objects);
      var items = [];
      var that = this;
      keys.forEach(key => {
        var obj = that.objects[key].value;

        if (obj && obj.fields["System.WorkItemType"] == "Organization") {
          var org = {
            id: parseInt(key),
            name: obj.fields["System.Title"],
            label: obj.fields["System.Title"],
            type: "project",
            children: []
          };
          if (obj.fields["CSEngineering-V2-Orgs.AccountOwner"]) {
            org.assignedTo = `<a href="https://csefy19.visualstudio.com/Organizations/_workitems/edit/${key}" target="_blank" >${
              obj.fields["CSEngineering-V2-Orgs.AccountOwner"]["displayName"]
            }</a>`;
          }

          org.label = `<a href="https://csefy19.visualstudio.com/Organizations/_workitems/edit/${key}" target="_blank" >${org.label}</a>`;

          var status = obj.fields["CSEngineering-V2.OverallStatus"];
          org.status = status;
          if (status.indexOf("Yellow") != -1) {
            org.style = {
              base: {
                fill: "orange",
                stroke: "orange"
              }
            };
          } else if (status.indexOf("Green") != -1) {
            org.style = {
              base: {
                fill: "green",
                stroke: "green"
              }
            };
          } else if (status.indexOf("Black") != -1) {
            org.style = {
              base: {
                fill: "black",
                stroke: "black"
              }
            };
          } else if (status.indexOf("Gray") != -1) {
            org.style = {
              base: {
                fill: "gray",
                stroke: "gray"
              }
            };
          }

          that.findchildren(org);
          if (org.children.length > 0) {
            items.push(org);
          }
          org.idlabel = `<a href="https://csefy19.visualstudio.com/Organizations/_workitems/edit/${key}" target="_blank" style="color:#0077c0;">${org.id}</a>`;

          //console.log(JSON.stringify(obj, null ,2));
        }
      });
      return items;
    },
    findchildren(parentobj) {
      let that = this;
      that.objects[parentobj.id].children.forEach(child => {
        if (that.objects[child]) {
          var subobj = that.objects[child].value;
          var childobj = {
            id: parseInt(child),
            name: subobj.fields["System.Title"],
            label: subobj.fields["System.Title"],
            state: subobj.fields["System.State"],
            type: "project",
            children: []
          };
          if (subobj.fields["System.AssignedTo"])
            childobj.assignedTo =
              subobj.fields["System.AssignedTo"]["displayName"];
          that.findchildren(childobj);
          parentobj.children.push(childobj);

          //gantt settings
          if (subobj.fields["System.WorkItemType"] == "Participant") {
            childobj.start = getDate2(
              subobj.fields["CSEngineering-V2.ParticipationStartDate"]
            );
            childobj.duration =
              subobj.fields["CSEngineering-V2.ActivityDuration"] *
              24 *
              60 *
              60 *
              1000;
            childobj.progress = 100;
          }

          childobj.label = `<a href="https://csefy19.visualstudio.com/Organizations/_workitems/edit/${childobj.id}" target="_blank" style="color:#0077c0;">${childobj.label}</a>`;
          childobj.idlabel = `<a href="https://csefy19.visualstudio.com/Organizations/_workitems/edit/${childobj.id}" target="_blank" style="color:#0077c0;">${childobj.id}</a>`;

          if (subobj.fields["System.WorkItemType"] == "Engagement") {
            that.engagements.push({
              id: parseInt(child),
              title: subobj.fields["System.Title"],
              state: subobj.fields["System.State"],
              assignedto: subobj.fields["System.AssignedTo"]
                ? subobj.fields["System.AssignedTo"]["displayName"]
                : "-",
              description: that.strip(subobj.fields["System.Description"]),
              label: childobj.name,
              status: subobj.fields["CSEngineering-V2.OverallStatus"],
              organization: parentobj.name,
              organizationId: parentobj.id,
              organizationUrl: `https://csefy19.visualstudio.com/Organizations/_workitems/edit/${parentobj.id}`,
              engagementUrl: `https://csefy19.visualstudio.com/Organizations/_workitems/edit/${child}`,
              startDate: this.formatDate(new Date(childobj.start)),
              endDate: this.formatDate(
                new Date(childobj.start + childobj.duration)
              )
            });
          }

          var status = subobj.fields["CSEngineering-V2.OverallStatus"];
          childobj.status = status;
          if (status) {
            if (status.indexOf("Yellow") != -1) {
              childobj.style = {
                base: {
                  fill: "orange",
                  stroke: "orange"
                }
              };
            } else if (status.indexOf("Green") != -1) {
              childobj.style = {
                base: {
                  fill: "green",
                  stroke: "green"
                }
              };
            } else if (status.indexOf("Black") != -1) {
              childobj.style = {
                base: {
                  fill: "black",
                  stroke: "black"
                }
              };
            } else if (status.indexOf("Gray") != -1) {
              childobj.style = {
                base: {
                  fill: "gray",
                  stroke: "gray"
                }
              };
            }
          } else {
            childobj.style = {
              base: {
                fill: "#1EBC61",
                stroke: "#0EAC51"
              }
            };
          }

          parentobj.start = Math.min(
            parentobj.start || childobj.start,
            childobj.start
          );
          parentobj.duration =
            Math.max(
              parentobj.start + (parentobj.duration || 0),
              childobj.start + childobj.duration
            ) - parentobj.start;

          childobj.parentId = parseInt(parentobj.id);
          childobj.collapsed = true;
        }
      });
    },
    easticsearchBuildIndex(list) {
      var searchIndex = elasticlunr(function() {
        this.addField("Title");
        this.addField("Description");
      });

      list.forEach(item => {
        searchIndex.addDoc(item);
      });

      this.searchIndex = searchIndex;
    },
    easticsearch(word) {
      return this.searchIndex.search(word);
    },

    fuseSearch(word, list) {
      var options = {
        threshold: 0.5,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["label", "description"],
        id: "id"
      };

      var fuse = new Fuse(list, options); // "list" is the item array
      return fuse.search(word);
    },
    engagememt2Keywords() {
      var that = this;
      var entity2engagements = {};
      this.entities.forEach(entity => {
        var keywords = entity.keywords.split("\n");
        keywords.forEach(keyword => {
          if (keyword.trim() != "") {
            // var engagements = that.fuseSearch(keyword, that.engagements);
            // debugger;
            var engagements2 = that.easticsearch(keyword);
            engagements2.forEach(eng => {
              if (eng.score > 1) {
                entity2engagements[eng.ref] = entity2engagements[eng.ref] || [];
                if (entity2engagements[eng.ref].indexOf(entity.name) == -1) {
                  entity2engagements[eng.ref].push({
                    entity: entity.name,
                    keyword,
                    score: eng.score
                  });
                }
              }
            });
          }
        });
      });
      //console.log(entity2engagements);

      return entity2engagements;
    },
    updateCategory() {
      this.textSearch()
    },
    engagement2Category() {
      var that = this;
      var entity2engagements = this.engagememt2Keywords();
      var categoriesData = {};
      Object.keys(entity2engagements).forEach(function(engagement, idx) {
        var categoryRow = [];
        var entityRow = [];
        that.categories.forEach(function(category) {
          category.rules.forEach(function(rule) {
            var primaryMatched = false;
            var primaryEnt = null;
            if (rule.primaryobjects.length > 0) {
              for (var j = 0; j < entity2engagements[engagement].length; j++) {
                for (var k = 0; k < rule.primaryobjects.length; k++) {
                  if (
                    rule.primaryobjects[k] ==
                    entity2engagements[engagement][j].entity
                  ) {
                    primaryMatched = true;
                    primaryEnt = entity2engagements[engagement][j];
                    break;
                  }
                }
              }
            }

            if (primaryMatched && rule.secondaryobjects.length > 0) {
              entity2engagements[engagement].forEach(function(ent) {
                for (var k = 0; k < rule.secondaryobjects.length; k++) {
                  if (rule.secondaryobjects[k] == ent.entity) {
                    if (categoryRow.indexOf(category.name) == -1)
                      categoryRow.push(category.name);
                    entityRow.push(ent);
                    break;
                  }
                }
              });
            } else if (primaryMatched) {
              if (categoryRow.indexOf(category.name) == -1)
                categoryRow.push(category.name);
              entityRow.push(primaryEnt);
            }
          });
        });

        categoriesData[engagement] = [categoryRow, entityRow];
      });

      that.engagements.forEach(eng => {
        if (categoriesData[eng.id]) {
          eng.category = categoriesData[eng.id][0];
          eng.entity = categoriesData[eng.id][1];
          eng.categories = categoriesData[eng.id][0].join(";");
        } else {
          eng.categories = "";
        }
      });

      console.log(categoriesData);
      return categoriesData;
    },
    categorizeEngagement(engArray) {
      var that = this
      
      var searchIndex = new FlexSearch("speed");
      searchIndex.add(10025, "John Doe");
      engArray.forEach(item => {
        searchIndex.add(item.id, item.Title+'\n'+that.strip(item.Description));
      });
      // var searchIndex = elasticlunr(function() {
      //   this.addField("Title");
      //   this.addField("Description");
      // });

      // engArray.forEach(item => {
      //   searchIndex.addDoc(item);
      // });
      
      var entity2engagements = {};
      this.entities.forEach(entity => {
        var keywords = entity.keywords.split("\n");
        keywords.forEach(keyword => {
          if (keyword.trim() != "") {
            var engagements2 = searchIndex.search(keyword);
            engagements2.forEach(eng => {
              entity2engagements[eng] = entity2engagements[eng] || []
              if (entity2engagements[eng].indexOf(entity.name) == -1) {
                entity2engagements[eng].push({
                    entity: entity.name,
                    keyword
                  });
              }
              // if (eng.score > 1) {
              //   entity2engagements[eng.ref] = entity2engagements[eng.ref] || [];
              //   if (entity2engagements[eng.ref].indexOf(entity.name) == -1) {
              //     entity2engagements[eng.ref].push({
              //       entity: entity.name,
              //       keyword,
              //       score: eng.score
              //     });
              //   }
              // }
            });
          }
        });
      });

      var categoriesData = {};
      Object.keys(entity2engagements).forEach(function(engagement, idx) {
        var categoryRow = [];
        var entityRow = [];
        that.categories.forEach(function(category) {
          category.rules.forEach(function(rule) {
            var primaryMatched = false;
            var primaryEnt = null;
            if (rule.primaryobjects.length > 0) {
              for (var j = 0; j < entity2engagements[engagement].length; j++) {
                for (var k = 0; k < rule.primaryobjects.length; k++) {
                  if (
                    rule.primaryobjects[k] ==
                    entity2engagements[engagement][j].entity
                  ) {
                    primaryMatched = true;
                    primaryEnt = entity2engagements[engagement][j];
                    break;
                  }
                }
              }
            }

            if (primaryMatched && rule.secondaryobjects.length > 0) {
              entity2engagements[engagement].forEach(function(ent) {
                for (var k = 0; k < rule.secondaryobjects.length; k++) {
                  if (rule.secondaryobjects[k] == ent.entity) {
                    if (categoryRow.indexOf(category.name) == -1)
                      categoryRow.push(category.name);
                    entityRow.push(ent);
                    break;
                  }
                }
              });
            } else if (primaryMatched) {
              if (categoryRow.indexOf(category.name) == -1)
                categoryRow.push(category.name);
              entityRow.push(primaryEnt);
            }
          });
        });

        categoriesData[engagement] = [categoryRow, entityRow];
      });

      engArray.forEach(eng => {
        if (categoriesData[eng.id]) {
          eng.Category = categoriesData[eng.id][0];
          eng.Entity = categoriesData[eng.id][1];
          eng.Categories = categoriesData[eng.id][0].join(";");
        } else {
          eng.categories = "";
        }
      });
      return searchIndex;
    },
    textFilterEngagements(searchIndex, text){
      if(text.trim()=='')
        return null
      var keywords = text.split(";");
      var engagements = []
      var engagementsId = []
      var that = this
      keywords.forEach(keyword => {
          if (keyword.trim() != "") {
            var engagements2 = searchIndex.search(keyword.trim());
            engagements2.forEach(eng => {
              if(engagementsId.indexOf(eng)==-1 ) {
                engagementsId.push(eng)
                engagements.push(that.queryResults[eng])
              }
            });
          }
      });
      return engagements;
    },
    calcValue(obj, fields) {
      var fieldArray = fields.split("/")
      for(var i = 0;i<fieldArray.length;i++) {
        if(fieldArray[i]!='')
          obj = obj[fieldArray[i]] 
        if(!obj) {
          return null
        }
      }
      return obj
    },
    exportCSV() {
      const { remote } = require("electron"),
        fs = require("fs"),
        dialog = remote.dialog,
        WIN = remote.getCurrentWindow();
      
      let that = this
      
      let options = {
        //Placeholder 1
        title: "Save File",

        //Placeholder 2
        defaultPath: ".\\results.csv",

        //Placeholder 4
        buttonLabel: "Save CSV File",

        //Placeholder 3
        filters: [
          { name: "CSV", extensions: ["csv"] },
          { name: "All Files", extensions: ["*"] }
        ]
      };

      var exportEng = [];
      that.engagements.forEach(eng=>{
        var row = {id:eng.id}
        that.selectedColumns.forEach((column)=>{
          row[column] = that.calcValue(eng, column)
        })
        exportEng.push(row)
      })
      
      dialog.showSaveDialog(WIN, options, filename => {
        console.log(filename);
        if (filename) {
          var csv = Papa.unparse(exportEng, {
            quotes: false, //or array of booleans
            quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true,
            newline: "\r\n",
            skipEmptyLines: false, //or 'greedy',
            columns: null //or array of strings
          });

          fs.writeFileSync(filename, csv, "utf8");
        }
      });
    }
  },
  computed: {
    ...mapState({
      main: state => state.Counter.main,
      entities: state => state.Entity.entities,
      categories: state => state.Category.categories,
      access_token: state => state.Token.access_token,
      engagements: state => state.Engagement.engagements,
      selectedColumns: state => state.Engagement.selectedColumns
    }),
    startDate() {
      return this.formatDate(this.queryForm.fromDate);
    },
    endDate() {
      return this.formatDate(this.queryForm.toDate);
    },
    monthFirstDate(date) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentDay = 1;
      return new Date(currentYear, currentMonth, currentDay, 0, 0, 0);
    },
    columns() {
      let columns = [];
      if (this.engagements && this.engagements.length > 0) {
        function loadKey(prefix, obj) {
          if (obj) {
            Object.keys(obj).forEach(key => {
              if (Array.isArray(obj[key])) return;
              else if (typeof obj[key] !== "object" || !obj[key])
                columns.push(prefix + "/" + key);
              else if (obj[key] != null && typeof obj[key] !== "undefined")
                loadKey(prefix + "/" + key, obj[key]);
            });
          }
        }
        loadKey("", this.engagements[0]);
      }
      return columns;
      //return ['A', 'B', 'C', 'D']
    }
  },
  mounted() {
    this.queryForm.fromDate = this.monthFirstDate;
    this.queryForm.industry = this.industryitems[5];
    // this.selectedColumns =
    this.columnOption = [];
    this.selectedColumns.forEach(col => {
      this.columnOption.push(col);
    });
    // console.log(this.columns)
    // console.log(this.selectedColumns);
  }
};
</script>

<style>
.el-col {
  margin-top: 10px;
  border-radius: 4px;
}
</style>