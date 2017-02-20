#!/usr/bin/env node

var prettySwag = require('../pretty-swag');
var fs = require('fs');

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

if (process.argv.indexOf("-h") > -1 || process.argv.indexOf("--help") > -1) {
    printHelp();
    process.exit(0);
}

if (!argv["-i"]) {
    console.log("missing input file");
    printHelp();
    process.exit(1);
}

function printHelp() {
    console.log();
    console.log("USAGE: pretty-swag -i {inputFile} [-o (doc.html*|outputFile)] [-f (singleFile*|offline|embeded)] [-m (true|false)] [-th (blue|red|indigo)] [-c {config file}] [-fixedNav]");
    console.log("-i input");
    console.log("-o output");
    console.log("-f format");
    console.log("-m markDown enable");
    console.log("-th theme color");
    console.log("-c config file");
    console.log("-fixedNav fixed top navigation bar");
    console.log();
}

var inputFile = argv["-i"];
var outputFile = argv["-o"] || "doc.html";
var format = argv["-f"] || "singleFile";
var markdown = argv["-m"] === "true" || false;
var theme = argv["-th"];
var configFile = argv["-c"];
var fixedNav = "-fixedNav" in argv;

if (theme && theme.startsWith("{")) {
    try {
        theme = JSON.parse(theme);
    }
    catch (err) {
        theme = "blue";
        console.log("cannot parse theme. Use default (" + theme + ")");
    }
}
var config = {};
if (configFile) {
    var json = fs.readFileSync(configFile, 'utf8');
    json = JSON.parse(json);
    var keys = Object.keys(json);
    config.theme = {};
    for (var i = 0; i < keys.length; i++) {
        config.theme[keys[i]] = json[keys[i]];
    }
}

config["format"] = format;
config["markdown"] = markdown;
config["theme"] = theme || config.theme || "blue";
config["fixedNav"] = fixedNav;


console.log("Source: " + inputFile);
console.log("Dest: " + outputFile);
console.log("Format: ", format);
console.log("MarkDown: ", markdown ? "Enable" : "Disable");
if (typeof config.theme === "object") {
    console.log("Theme: " + JSON.stringify(config.theme, null, 2));
}
else {
    console.log("Theme: " + config.theme);
}
prettySwag.run(inputFile, outputFile, config, function (err, msg) {

    if (err) {
        console.log("Error: " + err);
        process.exit(1);
    }

    console.log("DONE");
    process.exit(0);
});
