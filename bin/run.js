#!/usr/bin/env node

var prettySwag = require('../pretty-swag');

var lastkey = "";
var argv = {};
for (var i = 0; i < process.argv.length; i++) {
    if (process.argv[i].startsWith("-")) {
        lastkey = process.argv[i];
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
    console.log("USAGE: pretty-swag -i {inputFile} [-o (doc.html*|outputFile)] [-f (singleFile*|offline|embeded)] [-m (true|false)]");
    console.log("-i input");
    console.log("-o output");
    console.log("-f format");
    console.log("-m markDown enable");
    console.log();
}

var inputFile = argv["-i"];
var outputFile = argv["-o"] || "doc.html";
var format = argv["-f"] || "singleFile";
var markdown = argv["-m"] === "true" || false;
var config = {
    "format": format
    ,"markdown": markdown
};

console.log("Source: " + inputFile);
console.log("Dest: " + outputFile);
console.log("Format: ", format);
console.log("MarkDown: ", markdown ? "Enable":"Disable");
prettySwag.run(inputFile, outputFile, config, function (err, msg) {

    if (err) {
        console.log("Error: " + err);
        process.exit(1);
    }

    console.log("DONE");
    process.exit(0);
});
