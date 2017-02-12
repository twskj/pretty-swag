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

if (!argv["-i"]) {
    console.log("missing input file");
    Console.log("USAGE: pretty-swag -i {inputFile} [-o outputFile]");
    process.exit(1);
}

var inputFile = argv["-i"];
var outputFile = argv["-o"] || "doc.html";
var config = {};

prettySwag.run(inputFile,outputFile,config,function(err,msg){

    console.log("Parsing "+inputFile);
    console.log("Writting to"+ outputFile);
    if(err){
        console.log("Error: "+err);
        process.exit(1);
    }

    console.log("DONE");
    process.exit(0);
});
