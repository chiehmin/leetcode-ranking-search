(function(t){function e(e){for(var s,i,o=e[0],l=e[1],c=e[2],f=0,d=[];f<o.length;f++)i=o[f],Object.prototype.hasOwnProperty.call(n,i)&&n[i]&&d.push(n[i][0]),n[i]=0;for(s in l)Object.prototype.hasOwnProperty.call(l,s)&&(t[s]=l[s]);u&&u(e);while(d.length)d.shift()();return a.push.apply(a,c||[]),r()}function r(){for(var t,e=0;e<a.length;e++){for(var r=a[e],s=!0,o=1;o<r.length;o++){var l=r[o];0!==n[l]&&(s=!1)}s&&(a.splice(e--,1),t=i(i.s=r[0]))}return t}var s={},n={index:0,not_found:0},a=[];function i(e){if(s[e])return s[e].exports;var r=s[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=s,i.d=function(t,e,r){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(r,s,function(e){return t[e]}.bind(null,s));return r},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/leetcode-ranking-search/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],l=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var u=l;a.push([0,"chunk-vendors"]),r()})({0:function(t,e,r){t.exports=r("56d7")},4678:function(t,e,r){var s={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn-bd":"9686","./bn-bd.js":"9686","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-in":"ec2e","./en-in.js":"ec2e","./en-nz":"6f50","./en-nz.js":"6f50","./en-sg":"b7e9","./en-sg.js":"b7e9","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-mx":"b5b7","./es-mx.js":"b5b7","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fil":"d69a","./fil.js":"d69a","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-deva":"aaf2","./gom-deva.js":"aaf2","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./oc-lnc":"167b","./oc-lnc.js":"167b","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tk":"5aff","./tk.js":"5aff","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf755","./tlh.js":"cf755","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-mo":"3a6c","./zh-mo.js":"3a6c","./zh-tw":"90ea","./zh-tw.js":"90ea"};function n(t){var e=a(t);return r(e)}function a(t){if(!r.o(s,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return s[t]}n.keys=function(){return Object.keys(s)},n.resolve=a,t.exports=n,n.id="4678"},"56d7":function(t,e,r){"use strict";r.r(e);r("e260"),r("e6cf"),r("cca6"),r("a79d");var s=r("2b0e"),n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"app"}},[t._m(0),r("router-view")],1)},a=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"px-5 pt-2"},[r("a",{staticClass:"github-button",attrs:{href:"https://github.com/chiehmin","data-size":"large","data-show-count":"true","aria-label":"Follow @chiehmin on GitHub"}},[t._v("Follow @chiehmin")]),r("a",{staticClass:"github-button",attrs:{href:"https://github.com/chiehmin/leetcode-ranking-search","data-icon":"octicon-star","data-size":"large","data-show-count":"true","aria-label":"Star chiehmin/leetcode-ranking-search on GitHub"}},[t._v("Star")])])}],i=r("2877"),o={},l=Object(i["a"])(o,n,a,!1,null,null,null),c=l.exports,u=r("5f5b"),f=r("b1e0"),d=(r("f9e3"),r("2dd8"),r("8c4f")),b=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"px-5",attrs:{id:"app"}},[r("b-navbar",{staticClass:"mb-2",attrs:{toggleable:"lg",type:"dark",variant:"info"}},[r("b-navbar-brand",{attrs:{href:"#"}},[t._v("Leetcode contest ranking searcher")])],1),r("b-container",{staticClass:"p-0",attrs:{fluid:""}},[r("b-row",{attrs:{"align-h":"between"}},[r("b-col",{attrs:{sm:"5"}},[r("b-pagination",{attrs:{"total-rows":t.total,"per-page":t.perPage,"aria-controls":"contest-table"},model:{value:t.currentPage,callback:function(e){t.currentPage=e},expression:"currentPage"}})],1),r("b-col",{attrs:{sm:"3"}},[r("b-form-input",{attrs:{type:"search",placeholder:"Search a contest..."},model:{value:t.filterContest,callback:function(e){t.filterContest=e},expression:"filterContest"}})],1),r("b-col",{attrs:{sm:"4"}},[r("b-input-group",[r("b-form-input",{attrs:{type:"search",placeholder:"Search user contest history..."},nativeOn:{keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.searchUserHistory.apply(null,arguments)}},model:{value:t.filterUser,callback:function(e){t.filterUser=e},expression:"filterUser"}}),r("b-input-group-append",[r("b-button",{attrs:{id:"user-history-submit",type:"submit",variant:"primary"},on:{click:t.searchUserHistory}},[t._v("Submit")])],1)],1)],1)],1)],1),r("b-table",{attrs:{hover:"",id:"contest-table",items:t.contests,fields:t.fields,"per-page":t.perPage,"current-page":t.currentPage,filter:t.filterContest,"filter-included-fields":t.filteredOn,busy:t.isBusy},on:{filtered:t.onFiltered},scopedSlots:t._u([{key:"head(title)",fn:function(){return[t._v(" Contest ")]},proxy:!0},{key:"cell(title)",fn:function(e){return[r("router-link",{attrs:{to:e.item.href}},[t._v(t._s(e.item.title))])]}},{key:"cell(startTime)",fn:function(e){return[t._v(" "+t._s(t.timestampToDate(e.item.startTime))+" ")]}}])}),r("b-modal",{ref:"user-history-modal",attrs:{"no-close-on-backdrop":"","hide-footer":!0,title:t.userContestHistoryTitle}},[r("b-table",{attrs:{hover:"",items:t.userContestHistory,fields:t.userContestHistoryFields,busy:t.userContestBusy,"sort-by":"startTime","sort-desc":!0,"show-empty":"","empty-text":"no contest data found."},scopedSlots:t._u([{key:"table-busy",fn:function(){return[r("div",{staticClass:"text-center text-danger my-2"},[r("b-spinner",{staticClass:"align-middle"}),r("strong",[t._v("Loading "+t._s(t.retrievedCnt)+" / "+t._s(t.totalContests)+"...")])],1)]},proxy:!0}])})],1)],1)},h=[],p=r("b85c"),g=(r("99af"),r("c1df")),m=r.n(g),j=r("bc3a"),y=r.n(j),v=y.a.create({baseURL:"./",withCredentials:!1,headers:{Accept:"application/json","Content-Type":"application/json"}}),k={getAllContestInfo:function(){return v.get("data/contests.json")},getCountry:function(){return v.get("country.json")},getContest:function(t){return v.get("data/"+t+".json")}},C={name:"Main",components:{},data:function(){return{perPage:15,currentPage:1,contests:[],fields:["title","startTime"],filterContest:"",filteredOn:["title"],isBusy:!0,totalRows:null,filterUser:"",userContestHistoryFields:[{key:"contest"},{key:"rank"},{key:"percentile"},{key:"participants"}],retrievedCnt:0,userContestHistory:[],userContestBusy:!1}},computed:{total:function(){return this.totalRows||this.contests.length},totalContests:function(){return this.contests.length},userContestHistoryTitle:function(){return this.filterUser+"'s Contest History"}},created:function(){this.contests=[{title:"Global Ranking",href:"global_ranking",startTime:0}],k.getAllContestInfo().then(function(t){this.contests=this.contests.concat(t.data),this.isBusy=!1}.bind(this))},methods:{timestampToDate:function(t){return m.a.unix(t).format("YYYY-MM-DD hh:mm:ss")},onFiltered:function(t){this.currentPage=1,this.totalRows=t.length},searchUserHistory:function(){this.userContestHistory=[],this.userContestBusy=!0,this.$refs["user-history-modal"].toggle("user-history-submit");var t=new Worker("scripts/get_user_rank.worker.js");this.retrievedCnt=0,t.onmessage=function(t){t.data.contest&&this.userContestHistory.push(t.data),this.retrievedCnt++,this.retrievedCnt==this.contests.length&&(this.userContestBusy=!1)}.bind(this);var e,r=Object(p["a"])(this.contests);try{for(r.s();!(e=r.n()).done;){var s=e.value;"Global Ranking"!==s.title&&t.postMessage([this.filterUser,s.title,s.startTime])}}catch(n){r.e(n)}finally{r.f()}}}},_=C,w=Object(i["a"])(_,b,h,!1,null,null,null),P=w.exports,x=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"px-5",attrs:{id:"app"}},[r("b-navbar",{staticClass:"mb-2",attrs:{toggleable:"lg",type:"dark",variant:"info"}},[r("b-navbar-brand",{attrs:{href:"#"}},[t._v(t._s(t.unSlugTitle))]),r("b-navbar-nav",[r("b-nav-item",{attrs:{to:"/"}},[t._v("All Contests")])],1)],1),r("b-container",{staticClass:"p-0",attrs:{fluid:""}},[r("b-row",{attrs:{"align-h":"between"}},[r("b-col",{attrs:{sm:"5"}},[r("b-pagination",{attrs:{"total-rows":t.total,"per-page":t.perPage,"aria-controls":"rank-table"},model:{value:t.currentPage,callback:function(e){t.currentPage=e},expression:"currentPage"}})],1),r("b-col",{attrs:{sm:"3"}},[r("b-row",{attrs:{"align-h":"end"}},[r("b-form-select",{attrs:{options:t.countryList},model:{value:t.countryFilter,callback:function(e){t.countryFilter=e},expression:"countryFilter"}})],1)],1),r("b-col",{attrs:{sm:"4"}},[r("b-form-input",{attrs:{debounce:"500",type:"search",placeholder:"Search a user..."},model:{value:t.userFilter,callback:function(e){t.userFilter=e},expression:"userFilter"}})],1)],1)],1),r("b-table",{attrs:{hover:"",id:"rank-table",fields:t.fields,items:t.rank,"per-page":t.perPage,"current-page":t.currentPage,busy:t.isBusy,filter:t.filterTrigger,"filter-function":t.filterFunc,"filter-included-fields":t.filteredOn},on:{filtered:t.onFiltered},scopedSlots:t._u([{key:"table-busy",fn:function(){return[r("div",{staticClass:"text-center text-danger my-2"},[r("b-spinner",{staticClass:"align-middle"}),r("strong",[t._v("Loading...")])],1)]},proxy:!0},{key:"cell(username)",fn:function(e){return[r("b-link",{attrs:{href:t.profileLink(e.value,e.item.data_region),target:"_blank"}},[t._v(t._s(e.value))])]}}])})],1)},F=[],O=r("3835"),L=(r("ac1f"),r("1276"),r("a15b"),r("4fad"),r("4e82"),r("d3b7"),r("3ca3"),r("ddb0"),r("2b3d"),r("841c"),r("2ca0"),{name:"Contest",components:{},data:function(){return{title:"",perPage:25,currentPage:1,fields:["rank","username","country_name","score","finish_time","data_region"],rank:[],userFilter:"",filteredOn:["username","country_name"],totalRows:null,isBusy:!0,countryFilter:"All",countryList:["All"]}},computed:{total:function(){return this.totalRows||this.rank.length},unSlugTitle:function(){for(var t=this.title.split("-"),e=0;e<t.length;e++)t[e]=t[e].charAt(0).toUpperCase()+t[e].substr(1);return t.join(" ")},filterTrigger:function(){return this.countryFilter+this.userFilter}},created:function(){this.loadCountry(),this.loadData()},methods:{loadCountry:function(){k.getCountry().then(function(t){for(var e=[],r=0,s=Object.entries(t.data);r<s.length;r++){var n=Object(O["a"])(s[r],2),a=n[1];e.push(a)}e.sort(),this.countryList=this.countryList.concat(e)}.bind(this))},loadData:function(){var t=new URLSearchParams(new URL(document.URL).search).get("contest");t=t||"latest",k.getContest(t).then(function(t){this.isBusy=!1,this.rank=t.data}.bind(this)),this.title=t},filterFunc:function(t){return this.filterUser(t)&&this.filterCountry(t)},filterUser:function(t){return!!t.username.toLowerCase().startsWith(this.userFilter.toLowerCase())},filterCountry:function(t){return"All"===this.countryFilter||null!=t.country_name&&t.country_name.toLowerCase()===this.countryFilter.toLowerCase()},onFiltered:function(t){this.currentPage=1,this.totalRows=t.length},profileLink:function(t,e){return"CN"==e?"https://leetcode-cn.com/u/".concat(t):"https://leetcode.com/".concat(t)}}}),z=L,R=Object(i["a"])(z,x,F,!1,null,null,null),T=R.exports,U=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"px-5",attrs:{id:"app"}},[r("b-navbar",{staticClass:"mb-2",attrs:{toggleable:"lg",type:"dark",variant:"info"}},[r("b-navbar-brand",{attrs:{href:"#"}},[t._v("Global Ranking")]),r("b-navbar-nav",[r("b-nav-item",{attrs:{to:"/"}},[t._v("All Contests")])],1)],1),r("b-container",{staticClass:"p-0",attrs:{fluid:""}},[r("b-row",{attrs:{"align-h":"between"}},[r("b-col",{attrs:{sm:"5"}},[r("b-pagination",{attrs:{"total-rows":t.totalRows,"per-page":t.perPage,"aria-controls":"rank-table"},model:{value:t.currentPage,callback:function(e){t.currentPage=e},expression:"currentPage"}})],1),r("b-col",{attrs:{sm:"3"}},[r("b-row",{attrs:{"align-h":"end"}},[r("b-form-select",{attrs:{options:t.countryList},model:{value:t.countryFilter,callback:function(e){t.countryFilter=e},expression:"countryFilter"}})],1)],1),r("b-col",{attrs:{sm:"4"}},[r("b-form-input",{attrs:{debounce:"500",type:"search",placeholder:"Search a user..."},model:{value:t.userFilter,callback:function(e){t.userFilter=e},expression:"userFilter"}})],1)],1)],1),r("b-table",{attrs:{hover:"",id:"rank-table",fields:t.fields,items:t.rankProvider,"per-page":0,"current-page":t.currentPage,filter:t.filterTrigger},scopedSlots:t._u([{key:"table-busy",fn:function(){return[r("div",{staticClass:"text-center text-danger my-2"},[r("b-spinner",{staticClass:"align-middle"}),r("strong",[t._v("Loading...")])],1)]},proxy:!0},{key:"cell(username)",fn:function(e){return[r("b-link",{attrs:{href:t.profileLink(e.value),target:"_blank"}},[t._v(t._s(e.value))])]}},{key:"cell(rating)",fn:function(e){return[t._v(" "+t._s(Math.round(e.value))+" ")]}}])})],1)},S=[],H=(r("fb6a"),r("4de4"),{name:"GlobalRanking",components:{},data:function(){return{perPage:25,currentPage:1,fields:["globalRanking","username","realName","rating","country"],rank:[],filteredRank:[],userFilter:"",lastFilter:"All",totalRows:0,countryFilter:"All",countryList:["All"]}},computed:{filterTrigger:function(){return this.countryFilter+this.userFilter}},created:function(){this.loadCountry()},methods:{rankProvider:function(t){if(0===this.rank.length)return k.getContest("global-ranking").then(function(t){this.rank=t.data,this.filteredRank=this.rank,this.totalRows=this.rank.length;var e=(this.currentPage-1)*this.perPage;return this.rank.slice(e,this.perPage)}.bind(this));this.lastFilter!=t.filter&&(this.currentPage=1,t.currentPage=1,this.filteredRank=this.rank.filter(this.filterFunc),this.totalRows=this.filteredRank.length,this.lastFilter=t.filter);var e=(t.currentPage-1)*this.perPage;return this.filteredRank.slice(e,e+this.perPage)},loadCountry:function(){k.getCountry().then(function(t){for(var e=[],r=0,s=Object.entries(t.data);r<s.length;r++){var n=Object(O["a"])(s[r],2),a=n[1];e.push(a)}e.sort(),this.countryList=this.countryList.concat(e)}.bind(this))},filterFunc:function(t){return this.filterUser(t)&&this.filterCountry(t)},filterUser:function(t){return!!t.username.toLowerCase().startsWith(this.userFilter.toLowerCase())},filterCountry:function(t){return"All"===this.countryFilter||null!=t.country&&t.country.toLowerCase()===this.countryFilter.toLowerCase()},profileLink:function(t){return"https://leetcode.com/".concat(t)}}}),A=H,M=Object(i["a"])(A,U,S,!1,null,null,null),B=M.exports;s["default"].use(d["a"]);var D=[{path:"/",name:"Main",component:P},{path:"/contest",name:"Contest",component:T},{path:"/global_ranking",name:"GlobalRanking",component:B}],E=new d["a"]({mode:"history",base:"/leetcode-ranking-search/",routes:D}),G=E;s["default"].use(u["a"]),s["default"].use(f["a"]),s["default"].config.productionTip=!1,new s["default"]({router:G,render:function(t){return t(c)}}).$mount("#app")}});
//# sourceMappingURL=index.451974df.js.map