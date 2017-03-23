var fs = require('fs');
var esprima = require('esprima');
var livedoc = require('livedoc');
var marked = require('marked');
var pluralize = require('pluralize')

var indent_num = 2;

function format(tokens, indent_num) {

    var indents = ['', ' '.repeat(indent_num), ' '.repeat(indent_num * 2), ' '.repeat(indent_num * 3), ' '.repeat(indent_num * 4), ' '.repeat(indent_num * 5)];
    result = "";

    var level = 0;
    var foundKey = false;
    var indent;
    var newline = "\n";
    var tmpLines;
    var foundColon = false;
    var lineLen = 0;
    var braceStack = [];

    for (var i = 2; i < tokens.length; i++) {
        if (level === indents.length) {
            indents.push(' '.repeat(indent_num * level));
        }

        if (tokens[i].value === "{" || tokens[i].value === "[") {
            if (foundColon) {
                result += tokens[i].value;
                lineLen += tokens[i].value.length;
            }
            else {
                indent = indents[level];
                result += indent + tokens[i].value;
            }

            if (tokens[i + 1].type !== "BlockComment") {
                result += newline;
                lineLen = 0;
            }
            level += 1;
            foundColon = false;
            braceStack.push(tokens[i].value);
        }
        else if (tokens[i].value === "}" || tokens[i].value === "]") {
            level -= 1;
            indent = indents[level];
            result += indent + tokens[i].value;
            if (i + 1 < tokens.length && tokens[i + 1].value !== ",") {
                result += newline;
                lineLen = 0;
            }
            braceStack.pop();
        }
        else if (tokens[i].type === "BlockComment") {
            tmpLines = tokens[i].value.split("\n");
            if (tmpLines.length == 1) {
                result += "     /* " + tmpLines[0] + " */" + newline;
            }
            else {
                result += "     /* " + tmpLines[0] + newline;
                indent = ' '.repeat(lineLen + 2);
                for (var j = 1; j < tmpLines.length; j++) {
                    result += indent + "      *" + tmpLines[j] + newline;
                }
                result += indent + "      */" + newline;
            }
            lineLen = 0;
        }
        else if (tokens[i].value === ":") {
            result += ": ";
            foundColon = true;
            lineLen += 2;
        }
        else if (tokens[i].value === ",") {
            result += ",";
            if (tokens[i + 1].type !== "BlockComment") {
                result += newline;
                lineLen = 0;
            }
            else {
                lineLen += 1;
            }
        }
        else {

            indent = foundColon ? '' : indents[level];
            result += indent + tokens[i].value;
            if (i < tokens.length - 1) {
                if ((foundColon && tokens[i + 1].type !== "BlockComment" && tokens[i + 1].value !== ",")
                    || (tokens[i + 1].value !== ',' && braceStack[braceStack.length - 1] === '[')) {
                    result += newline;
                    lineLen = 0;
                }
                else {
                    lineLen += tokens[i].value.length;
                }
            }
            foundColon = false;
        }
    }
    return result;
}

function computeSchema(schema, def, context) {
    if (typeof schema === "string") {
        if (schema === "array") {
            if (context.items) {
                if (context.items.enum) {
                    if (context.items.type === "string") {
                        return "[" + context.items.enum.map(function (x) {
                            return '"' + x + '"';
                        }).join(",") + "]";
                    }
                    else {
                        return "[" + context.items.enum + "]";
                    }
                }
                else {
                    return "[" + context.items.type + "]";
                }
            }
            else {
                return "[]";
            }
        }
        else {
            return schema;
        }
    }
    var src = "a=" + resolveNested(schema, def);
    var tokens = esprima.tokenize(src, { comment: true });
    tmp = format(tokens, indent_num);
    return tmp;
}

/**
sort capital letter first
**/
function sortTags(tagA, tagB) {

    if ((tagA[0] === tagA[0].toUpperCase()) && (tagB[0] !== tagB[0].toUpperCase())) {
        return 1;
    }
    else if ((tagA[0] !== tagA[0].toUpperCase()) && (tagB[0] === tagB[0].toUpperCase())) {
        return -1;
    }
    else {
        return tagA < tagB;
    }
}

function replace(target, newVal, src) {

    for (var i = 0; i < src.length; i++) {
        if (src[i].indexOf(target) == -1) {
            continue;
        }

        src[i] = src[i].split(target).join(newVal);
    }

    return src;
}

function joinObjectVals(keyval) {
    if (!keyval || keyval.length == 0) {
        return "";
    }
    var result = "";
    for (var i = 0; i < keyval.length; i++) {
        if (keyval[i].endsWith("*/")) {
            result += keyval[i];
        }
        else {
            result += keyval[i] + ",";
        }
    }
    if (result.endsWith(",")) {
        return result.substr(0, result.length - 1);
    }
    return result;
}
//https://github.com/json-schema/json-schema/wiki/anyOf,-allOf,-oneOf,-not
function resolveNested(schema, def) {
    var comment = "";
    try {
        if ("type" in schema || "properties" in schema) {
            if (schema.type === "array") {
                return "[" + resolveNested(schema.items, def) + "]";
            }
            else if (schema.type === "object" || "properties" in schema) {
                var keyval = [];
                for (var prop in schema.properties) {

                    if (schema.properties[prop].type === "array" || schema.properties[prop].type === "object" || "properties" in schema.properties[prop]) {
                        keyval.push('"' + prop + '":' + resolveNested(schema.properties[prop], def));
                    }
                    else {
                        comment = schema.properties[prop].description ? "/*" + schema.properties[prop].description + "*/" : "";
                        keyval.push('"' + prop + '":"' + schema.properties[prop]["type"] + '"' + comment);
                    }
                }
                comment = schema.description ? comment = "/*" + schema.description + "*/" : "";
                return "{" + comment + joinObjectVals(keyval) + "}";
            }
            else {
                comment = schema.description ? comment = "/*" + schema.description + "*/" : "";
                return '"' + schema.type + '"' + comment;
            }
        }

        //idea
        /**
        * keyword | Array Represent |                            plain object |
        * ------- | --------------- | --------------------------------------- |
        *  allOf  |      [[1,2,3]]  |                          merge property |
        *  anyOf  |        [1,2,3]  |                                  merge? |
        *  oneOf  |      [[1],[2]]  | [ ]array of multiple objects?  [x]merge |
        **/
        //NOTE usually these keywords uses in a list of validation conditions
        //allOf = all
        //anyOf = > 0
        //oneOf = ==1
        else if ("anyOf" in schema || "allOf" in schema || "oneOf" in schema) {
            var objs = [];
            var arr = schema["anyOf"] || schema["allOf"] || schema["oneOf"] || [];
            var tmp;
            for (var i = 0; i < arr.length; i++) {
                objs.push(resolveNested(arr[i], def));
            }
            return format(merge(objs), indent_num);
        }
        // else if ("not" in schema) {
        //     //TODO return an object with one in direction call not? { "not": {...} }
        // }
        else {
            return JSON.stringify(schema, null, indent_num);
        }

    }
    catch (err) {
        if (schema.type) {
            return '"' + schema.type + '"';
        }
        return JSON.stringify(schema, null, indent_num);
    }
}

function merge(objs) {
    var result = {};
    for (var i = 0; i < objs.length; i++) {
        for (var prop in objs[i]) {
            if (prop in result) {
                if (Array.isArray(result[prop])) {
                    result[prop] = [result[prop]];
                }
                result[prop].push(objs[i][prop]);
            }
            else {
                result[prop] = objs[i][prop];
            }
        }
    }
    return result;
}

function parse(src, dst, config, callback) {

    var $RefParser = require('json-schema-ref-parser');
    $RefParser.dereference(src, function (err, input) {

        if (err) {
            throw err;
        }

        var marked_opt = {
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        };

        var hasCodeSection = false;
        if(!config.NoHighlight){
            marked_opt.renderer.code = function(code, language) {

                hasCodeSection = true;
                if(language){
                    return '<pre class="hljs"><code class="'+language+'">'+require('highlight.js').highlight(language,code,true).value+'</code></pre>';
                }
                else{
                    return '<pre class="hljs"><code class="'+language+'">'+require('highlight.js').highlightAuto(code).value+'</code></pre>';
                }
            };
        }
        marked.setOptions(marked_opt);

        var result = livedoc.initContainer();
        result.name = input.info.title;
        result.summary = config.markdown ? marked(input.info.description || "") : input.info.description || "";
        result.version = input.info.version || "";
        result.host = input.host || "";
        result.basePath = input.basePath || "";
        result.showNav = !config.hideNav;
        if (config.theme) {
            if (config.theme === "default") {
                result.bgColor = {
                    default: "blue"
                    , GET: "blue"
                    , HEAD: "cyan"
                    , POST: "teal"
                    , PUT: "deep-purple"
                    , DELETE: "red"
                    , CONNECT: "purple"
                    , OPTIONS: "light-blue"
                    , TRACE: "blue-grey"
                    , PATCH: "deep-purple"
                };
            }
            else if (typeof config.theme === "string") {
                result.bgColor = { default: config.theme };
            }
            else {
                //custom
                result.bgColor = config.theme;
            }
        }
        result.fixedNav = config.fixedNav;

        for (var path in input.paths) {

            var api = livedoc.initApi();
            result.apis.push(api);
            api.path = path;
            var path_params = [];
            if ("parameters" in input.paths[path]) {
                var path_scope_params = input.paths[path]["parameters"]; //array
                for (var i = 0; i < path_scope_params.length; i++) {
                    var path_param = livedoc.initParam();
                    var input_path_param = path_scope_params[i];
                    if ("$ref" in input_path_param) {
                        input_path_param = input.parameters[input_path_param["$ref"].substr(13)]; //remove "#/parameters/" portion
                    }
                    path_param.name = input_path_param.name;
                    path_param.location = input_path_param.in;
                    path_param.desc = input_path_param.description;
                    path_param.required = input_path_param.required;
                    if (input_path_param.schema) {
                        path_param.schema = computeSchema(input_path_param.schema, input.definitions);
                    }
                    else if (input_path_param.type) {
                        path_param.schema = computeSchema(input_path_param.type, input.definitions, input_path_param);
                    }
                    if (path_param.name && path_param.location) {
                        path_params.push(path_param);
                    }
                }
            }
            for (var method_name in input.paths[path]) {

                if (method_name === "parameters") {
                    continue;
                }
                var method = livedoc.initMethod();
                api.methods.push(method);
                var input_method = input.paths[path][method_name];
                method.name = method_name.toUpperCase();
                method.tags = input_method.tags || [];
                if (config.autoTags || true) {
                    var tmp_tags = method.tags.map(function (x) { return x.toLowerCase().trim() });
                    method.tags.push(method.name);
                    var segments = path.split("/");
                    segmentLoop:
                    for (var i = 0; i < segments.length; i++) {
                        var seg = segments[i].trim();
                        if (!seg || (seg.startsWith("{") && seg.endsWith("}"))) {
                            continue;
                        }
                        var norm_seg = seg.toLowerCase();
                        //don't add placeholder and plural when already have a singular in
                        var singular = pluralize.singular(norm_seg);
                        if (tmp_tags.indexOf(norm_seg) > -1 || tmp_tags.indexOf(singular) > -1) {
                            continue;
                        }

                        for (var j = 0; j < method.tags.length; j++) {
                            var longerTag = method.tags[j].toLowerCase();

                            if (longerTag.startsWith(singular) || longerTag.startsWith(norm_seg)) {
                                continue segmentLoop;
                            }

                        }
                        method.tags.push(singular);
                        tmp_tags.push(norm_seg);
                    }
                }
                method.tags = replace(' ', '-', method.tags);
                method.tags.sort(sortTags);
                input_method.summary = input_method.summary || "";
                input_method.description = input_method.description || "";
                method.summary = config.markdown ? marked(input_method.summary) : input_method.summary;
                method.desc = config.markdown ? marked(input_method.description) : input_method.description;

                if (path_params.length > 0) {
                    method.params = method.params.concat(path_params);
                }
                if (input_method.parameters) {
                    for (i = 0; i < input_method.parameters.length; i++) {
                        var param = livedoc.initParam();
                        method.params.push(param);
                        var parameter = input_method.parameters[i];
                        param.name = parameter.name;
                        param.location = parameter.in;
                        param.desc = parameter.description;
                        param.required = parameter.required;
                        param.value = parameter.default || "";
                        if (parameter.schema) {
                            param.schema = computeSchema(parameter.schema, input.definitions);
                        }
                        else if (parameter.type) {
                            param.schema = computeSchema(parameter.type, input.definitions, parameter);
                        }
                    }
                }

                for (var code in input_method.responses) {
                    var res = livedoc.initResponse();
                    method.responses.push(res);
                    var response = input_method.responses[code];
                    res.code = code;
                    res.desc = response.description;
                    if (response.schema) {
                        res.schema = computeSchema(response.schema, input.definitions);
                    }
                }
            }
        }
        var conf = {
            mode: config.format
            , pathParamLeftToken: "{"
            , pathParamRightToken: "}"
            , formDataToken: "formData"
            , allowHtml: config.markdown
            , syntaxHighlight: hasCodeSection

        };
        var footer = "";
        if (!config.noDate) {
            footer = ' __GENERATED_DATE__';
        }
        if (!config.noCredit) {
            footer = footer + ' by <a href="https://github.com/twskj/pretty-swag">pretty-swag</a>'
        }
        if (footer) {
            conf.footer = "Generated" + footer;
        }
        else {
            conf.noFooter = true;
        }
        if (config.format === "offline") {
            conf.outputFilename = dst;
        }
        try {
            if (typeof result.bgColor === "object") {
                conf.mainColor = result.bgColor.default
            }
            else {
                conf.mainColor = result.bgColor;
            }
        }
        catch (err) {
            conf.mainColor = 'blue';
        }
        livedoc.generateHTML(JSON.stringify(result, null, indent_num), conf, function (err, data) {
            fs.writeFile(dst, data, 'utf8', function (err) {
                if (err) {
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
    "run": parse
};
module.exports = map;