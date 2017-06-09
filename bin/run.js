#!/usr/bin/env node

var prettySwag = require('../pretty-swag');
var fs = require('fs');
const Path = require('path')

var lastkey = "";
var argv = {};
for (var i = 0; i < process.argv.length; i++) {
    if (process.argv[i].startsWith("-")) {
        lastkey = process.argv[i];
        argv[lastkey] = "";
    } else {
        if (lastkey) {
            argv[lastkey] = process.argv[i];
            lastkey = "";
        }
    }
}

if (process.argv.indexOf("-v") > -1 || process.argv.indexOf("--version") > -1 || process.argv.indexOf("-version") > -1) {
    printVersion();
    process.exit(0);
}

else if (process.argv.indexOf("-h") > -1 || process.argv.indexOf("--help") > -1) {
    printHelp();
    process.exit(0);
}

function printVersion(){

    try{
        var content = fs.readFileSync(Path.join(__dirname,'..', 'package.json'),'utf8');
        var obj = JSON.parse(content);
        if(obj.version){
            console.log('pretty-swag version "'+obj.version+'"');
        }
    }
    catch(err){
        console.log("cannot read version data");
    }
}


function firstNonUndefineVal(){
    for (i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) {
            return arguments[i];
        }
    }
}

function printHelp() {
    console.log();
    printVersion();
    console.log("USAGE: pretty-swag -i <inputFile> [Options]");
    console.log("Options:");
    console.log("-i <input> Location of the input file.");
    console.log("-o <output> Location of the output file. Default to doc.html");
    console.log('-f (singleFile|lite|offline|noIcon) Mode of the output result');
    console.log("-th <theme> Theme. Default to `blue` for multi-color theme use `-th default`");
    console.log("-c <config file> Location of the configuration file");
    console.log("-m Use this flag to enable MarkDown");
    console.log("-fixedNav Use this flag to fixed the top navigation bar");
    console.log("-autotags (true|false) Use this flag to  turn on / off automatically generate tags by path and method");
    console.log("-noFooter Use this flag to remove footer");
    console.log("-noNav Use this flag to remove navigation bar");
    console.log("-noReq Use this flag to suppress request section");
    console.log("-home.url <url> address of `home` on navigation bar");
    console.log("-home.text <text> Text that will be used for home url. default to `Home`");
    console.log("-home.location <L,RL,RR> Location of home link on navigation bar. default to `RR`");
    console.log("-indent Use this flag to adjust schema indentation. default to 3");
    console.log("-v --version to show version number");
    console.log();
}

var inputFile = argv["-i"];
var outputFile = argv["-o"];
var format = argv["-f"];
var markdown = "-m" in argv ? true : undefined;
var theme = argv["-th"];
var configFile = argv["-c"];
var fixedNav = "-fixedNav" in argv ? true : undefined;
var autoTags = "-autotags" in argv ? argv["-autotags"].toLowerCase() !== "false" : undefined;
var noDate = "-noDate" in argv ? true : undefined;
var noCredit = "-noCredit" in argv ? true : undefined;
var noNav = "-noNav" in argv ? true : "-hideNav" in argv ? true : undefined;
var noRequest = "-noReq" in argv ? true : undefined;
var home_url = argv["-home.url"];
var home_location = argv["-home.location"];
var home_text = argv["-home.text"];

var indent_num = parseInt(argv["-indent"]) || 3;
var collapse;
if("-collapsePath" in argv){
    if(!collapse){
        collapse = {};
    }
    collapse.path = (!argv["-collapsePath"] || argv["-collapsePath"] === "true");
}

if("-collapseMethod" in argv){
    if(!collapse){
        collapse = {};
    }

    collapse.method = (!argv["-collapseMethod"] || argv["-collapseMethod"] === "true");
}

if("-collapseTool" in argv){
    if(!collapse){
        collapse = {};
    }
    collapse.tool = (argv["-collapseTool"] === "true");
}

var config = {};
if (configFile) {
    var json = fs.readFileSync(configFile, 'utf8');
    json = JSON.parse(json);
    var keys = Object.keys(json);
    config.theme = {};
    for (var i = 0; i < keys.length; i++) {
        config[keys[i]] = json[keys[i]];
    }
}

config.input = inputFile || config.input;

if (!config.input) {
    console.log("missing input file");
    printHelp();
    process.exit(1);
}

config.format = format || config.format || "singleFile";

if(markdown){
    config.markdown = argv["-m"].toLowerCase() !== "false";
}
else{
    config.markdown = config.markdown || false;
}

config.theme = theme || config.theme || "blue";
config.fixedNav = firstNonUndefineVal(fixedNav,config.fixedNav,false);
config.output = outputFile || config["output"] || "doc.html";
config.autoTags = firstNonUndefineVal(autoTags,config["autoTags"],true);
config.noDate = firstNonUndefineVal(noDate,config["noDate"],false);
config.noCredit = firstNonUndefineVal(noCredit,config["noCredit"],false);
config.noNav = firstNonUndefineVal(noNav,config["noNav"],config["hideNav"],false);
config.noRequest = firstNonUndefineVal(noRequest,config["noRequest"],false);
config.indent_num = indent_num || config["indent"];
config.collapse = firstNonUndefineVal(collapse,config.collapse,{path:false,method:false,tool:true});

if(home_url || home_location || home_text)
{
    if(config.home){
        config.home.URL = home_url || config.home.URL;
        config.home.location = home_location || config.home.location || "RR";
        config.home.text = home_text || config.home.text || "Home";
    }
    else{
        config.home = {
            URL: home_url
            ,location: home_location || "RR"
            ,text: home_text || "Home"
        };
    }
}

console.log("Source: " + config.input);
console.log("Dest: " + config.output);
console.log("Format: ", config.format);
console.log("MarkDown: ", config.markdown ? "Enable" : "Disable");
console.log("Nav Bar: ", config.noNav ? "Hide" : config.fixedNav ? "Fixed" : "Normal");
console.log("Auto tags: ", config.autoTags ? "Enable" : "Disable");
console.log("Initial Collapse [Path: " + config.collapse.path + ", Method: "+ config.collapse.method + ", Tool :" + config.collapse.tool+"]");

if (typeof config.theme === "object") {
    console.log("Theme: " + JSON.stringify(config.theme, null, 2));
}
else {
    console.log("Theme: " + config.theme);
}
if(noDate){
    console.log("No Date");
}
if(noCredit){
    console.log("No Credit");
}
if(noRequest){
    console.log("No Request Panel");
}

if(config.home){
    console.log("Home: "+JSON.stringify(config.home));
}
prettySwag.run(config.input, config.output, config, function (err, msg) {

    if (err) {
        console.log("Error: " + err);
        process.exit(1);
    }

    console.log("DONE");
    process.exit(0);
});
