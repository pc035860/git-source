"use strict";angular.module("gitSourceApp",["ngSelect","hljs","ui.router","ngStorage"]).constant("gsConst",{THEME_MAP:{arta:"dark",ascetic:"light",brown_paper:"dark","default":"light",docco:"light",far:"dark",foundation:"light",github:"light",googlecode:"light",idea:"light",ir_black:"dark",magula:"light","mono-blue":"light",monokai:"dark",monokai_sublime:"dark",obsidian:"dark",pojoaque:"dark",railscasts:"dark",rainbow:"dark",school_book:"dark",solarized_dark:"dark",solarized_light:"light",sunburst:"dark","tomorrow-night-blue":"dark","tomorrow-night-bright":"dark","tomorrow-night-eighties":"dark","tomorrow-night":"dark",tomorrow:"light",vs:"light",xcode:"light",zenburn:"dark"}}).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise(".example"),a.state("main",{url:"/*sourcePath?theme&fontsize&file&line&lang&autogrow&edit&fileselect&result"})}]),angular.module("gitSourceApp").controller("MainCtrl",["$scope","$stateParams","$state","gsConst","$log",function(a,b,c,d){var e={theme:"default",edit:!1,result:!0},f=function(){var a={};return function(b){return angular.equals(b,a)}}();a.$stateParams=b,a.$watch("$stateParams",function(c){if(!f(c)){a.sourcePath=b.sourcePath;var g=angular.copy(c);delete g.sourcePath,a.options={},angular.forEach(g,function(b,c){a.options[c]=angular.isDefined(e[c])&&null===b?e[c]:b}),a.containerTheme="light",a.highlightTheme="default",a.options.theme in d.THEME_MAP&&(a.highlightTheme=a.options.theme,a.containerTheme=d.THEME_MAP[a.options.theme])}},!0)}]),angular.module("gitSourceApp").factory("$interval",["$timeout",function(a){return function(b,c){var d,e=0,f=!1,g=function(){d=a(function(){angular.isFunction(b)&&b(e++),f||g()},c)};return g(),function(){return f=!0,a.cancel(d)}}}]),angular.module("gitSourceApp").factory("gitSourceData",["$http","$q","$log",function(a,b){var c="git-source.json";return function(d){var e;return a.get(d+c).then(function(c){e=c.data;var f=[];return angular.forEach(e.files,function(b){f.push(a.get(d+b))}),b.all(f)}).then(function(a){var b=e.files;return e.files={},angular.forEach(b,function(b,c){e.files[b]={filename:b,content:a[c].data}}),e}).then(null,function(){return null})}}]),angular.module("gitSourceApp").factory("formPostData",["$document",function(a){return function(b,c){var d=angular.element('<form style="display: none;" method="post" action="'+b+'" target="_blank"></form>');angular.forEach(c,function(a){var b=a.name,c=a.value,e=angular.element('<input type="hidden" name="'+b+'">');e.attr("value",c),d.append(e)}),a.find("body").append(d),d[0].submit(),d.remove()}}]),angular.module("gitSourceApp").factory("openPlunker",["formPostData",function(a){return function(b,c,d){var e=[];c=c||"",d=d||[],angular.forEach(b,function(a){e.push({name:"files["+a.filename+"]",value:a.content})}),angular.forEach(d,function(a){e.push({name:"tags[]",value:a})}),e.push({name:"private",value:!0}),e.push({name:"description",value:c}),a("http://plnkr.co/edit/?p=preview",e)}}]),angular.module("gitSourceApp").factory("sendAutogrowMsg",["$window","$location","$document","$log","$interval",function(a,b,c,d,e){var f,g=100,h=10;return function(b){(f||angular.noop)();var d=0,i=-1,j=function(){var e=c.find("iframe")[0],g=c.find("code")[0],j=g||e,k={id:b,height:j.scrollHeight+(j.offsetTop||j.parentElement.offsetTop)};if(0!==k.height){if(k.height===i){if(d++,d>=h)return f(),void 0}else k.height>i&&(d=0,i=k.height);a.parent.postMessage(JSON.stringify(k),"*")}};f=e(j,g),j()}}]),angular.module("gitSourceApp").factory("extToLang",[function(){var a={js:"javascript",html:"xml",htm:"xml",css:"css",json:"json",md:"markdown"};return function(b){return b=b.toLowerCase(),a[b]||null}}]),angular.module("gitSourceApp").directive("gitSource",["gitSourceData","openPlunker","$q","$log","sendAutogrowMsg","$timeout","extToLang","$localStorage","popoutWindow",function(a,b,c,d,e,f,g,h,i){return{restrict:"EA",scope:{sourcePath:"@gitSource",config:"=gitSourceOptions"},templateUrl:"git-source-template.html",link:function(c,d){function j(a){if(a&&(a.fontsize&&d.find("pre").css("font-size",a.fontsize+"px"),c.model.specifiedFileContent=null,a.file&&a.file in c.fileIndex&&(c.model.specifiedFileContent=c.fileIndex[a.file].content,a.line))){var b,e,f=a.line.split("-");f.length<2?b=e=Math.max(1,parseInt(f[0],10)):(b=f[0],e=f[1]);var g=c.model.specifiedFileContent.match(/^.*$/gm);g&&(c.model.specifiedFileContent=g.slice(b-1,e).join("\n"))}}var k="?RESULT?",l=null,m=null,n=!1;c.$localStorage=h,c.RESULT_FILE_NAME=k,c.fileIndex=null,c.files=[],c.model={currentFilename:null,specifiedFileContent:null},c.popoutResult=function(){i(c.resultPath)},c.editOnPlunker=function(){b(l.files,l.description,l.tags)},c.onHighlight=function(){n=!0,j(m),m.autogrow&&e(m.autogrow)},c.$watch("$localStorage.popout",function(a){a&&c.model.currentFilename===k&&c.popoutResult()}),c.$watch("model.currentFilename",function(a){a===k&&m.autogrow&&f(function(){e(m.autogrow)})},!0),c.$watch("sourcePath",function(b){angular.isString(b)&&b&&("."===b.charAt(0)?b=b.substr(1):"/"!==b.charAt(0)&&(b="/"+b),"/"!==b.substr(-1)&&(b+="/"),c.resultPath=b,c.fileIndex={},c.model.currentFilename=null,c.files.length=0,a(b).then(function(a){angular.forEach(a.files,function(a,b){var d=b.substr(b.lastIndexOf(".")+1),e={name:b,content:a.content,lang:g(d)||""};c.files.push(e),c.fileIndex[b]=e}),c.model.currentFilename=c.files[0].name,l=a}))}),c.$watch("config",function(a){angular.isDefined(a)&&angular.isObject(a)&&(m=angular.copy(a),angular.forEach(m,function(a,b){switch(b){case"result":m[b]=c.$eval(a)}}),n&&j(m))},!0)}}}]),angular.module("gitSourceApp").factory("popoutWindow",function(){return function(a){var b,c,d,e="gitsource_popout",f=980,g=.85*screen.availHeight,h={menubar:"no",scrollbars:"no",resizable:"no",width:f,height:g,top:(screen.availHeight-g)/2,left:(screen.availWidth-f)/2},i=[];for(var b in h)c=h[b],i.push(b+"="+c);d=window.open(a,e,i.join(","));try{d.opener||(d.opener=self)}catch(j){}return window.focus&&d.focus(),d}});