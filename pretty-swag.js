var livedoc = require('livedoc');
var fs = require('fs');

var indent_num = 4;

function computeSchema(schema,def) {
    if (typeof schema === "string")
        return schema;
    var tmp = JSON.parse(resolveNested(schema, def));
    return JSON.stringify(tmp, null, indent_num);
}

function resolveNested(schema,def) {
    try {
        if ("type" in schema) {

            if (schema.type === "array") {
                //need to loop
                return "[" + resolveNested(schema.items, def) + "]";
            }
            else if (schema.type === "object") {
                var keyval = [];
                for (var prop in schema.properties) {

                    if ("$ref" in schema.properties[prop]) {
                        keyval.push('"' + prop + '":' + resolveNested(schema.properties[prop],def));
                    }
                    else if (schema.properties[prop].type === "array" || schema.properties[prop].type === "object") {
                        keyval.push('"' + prop + '":' + resolveNested(schema.properties[prop],def));
                    }
                    else {
                        keyval.push('"' + prop + '":"' + schema.properties[prop]["type"] + '"');
                    }
                }
                return "{" + keyval.join(",") + "}";
            }
            else {
                return '"'+schema.type+'"';
            }
        }
        else if ("$ref" in schema) {
            return resolveNested(def[schema["$ref"].substr(14)], def); //remove #/definitions
        }
        else {
            JSON.stringify(schema, null, indent_num);
        }

    }
    catch (err) {
        if (schema.type) {
            return '"'+schema.type+'"';
        }
        return JSON.stringify(schema, null, indent_num);
    }
}

function parse(src,dst,config,callback) {

    fs.readFile(src, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }

        var input;
        try {
            input = JSON.parse(data);
        }
        catch(json_err){
            var yaml = require('js-yaml');
            try {
                input = yaml.safeLoad(data);
            } catch (yaml_err) {
                console.log(yaml_err);
                process.exit(1);
            }
        }

        var result = livedoc.initContainer();
        result.name = input.info.title;
        result.summary = input.info.description;
        result.version = input.info.version;
        result.host = input.host;
        result.basePath = input.basePath;

        for (var path in input.paths) {

            var api = livedoc.initApi();
            result.apis.push(api);
            api.path = path;
            for (var method_name in input.paths[path]) {
                var method = livedoc.initMethod();
                api.methods.push(method);
                var input_method = input.paths[path][method_name];
                method.name = method_name;
                method.tags = input_method.tags;
                method.summary = input_method.summary;
                method.desc = input_method.description;

                if (input_method.parameters) {
                    for (var i = 0; i < input_method.parameters.length; i++) {
                        var param = livedoc.initParam();
                        method.params.push(param);
                        var parameter = input_method.parameters[i];
                        param.name = parameter.name;
                        param.location = parameter.in;
                        param.desc = parameter.description;
                        param.required = parameter.required;
                        if(parameter.schema){
                            param.schema = computeSchema(parameter.schema, input.definitions);
                        }
                        else if(parameter.type){
                            param.schema = computeSchema(parameter.type, input.definitions);
                        }
                    }
                }

                for (var code in input_method.responses) {
                    var res = livedoc.initResponse();
                    method.responses.push(res);
                    var response = input_method.responses[code];
                    res.code = code;
                    res.desc = response.description;
                    if(response.schema){
                        res.schema = computeSchema(response.schema, input.definitions);
                    }
                }
            }
        }
        var conf = {
            mode: config.format
            ,footer: 'Generated __GENERATED_DATE__ by <a href="https://github.com/twskj/pretty-swag">pretty-swag</a>'
            ,pathParamLeftToken: "{"
            ,pathParamRightToken: "}"
            ,formDataToken: "formData"
        };
        if(config.format === "offline"){
            conf.outputFilename = dst;
        }
        livedoc.generateHTML(JSON.stringify(result, null, indent_num), conf,function(err,data){
            fs.writeFile(dst,data,function(err){
                if(err){
                    callback(err);
                    return;
                }
                callback(null);
                return;
            });
        });
    });
}

map = {
    "run":parse
};
module.exports = map;


