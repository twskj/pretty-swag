var esprima = require('esprima');
var livedoc = require('livedoc');
var marked = require('marked');
var pluralize = require('pluralize');

var indent_num = 3;

function format(tokens, indent_num) {

    var indents = ['', ' '.repeat(indent_num), ' '.repeat(indent_num * 2), ' '.repeat(indent_num * 3), ' '.repeat(indent_num * 4), ' '.repeat(indent_num * 5)];
    result = "";

    var level = 0;
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
            if (i + 1 < tokens.length - 1 && tokens[i + 1].type === "String" && tokens[i - 1].type !== "Punctuator") {
                result += ",";
                lineLen += 1;
            }
            tmpLines = tokens[i].value.split("\n");
            if (tmpLines.length == 1) {
                result += "     /* " + tmpLines[0] + " */" + newline;
            }
            else {
                result += "     /* " + tmpLines[0] + newline;
                indent = ' '.repeat(lineLen + ((level - (tokens[i - 1] ? (tokens[i - 1].type === "Punctuator" ? 1 : 0) : 0)) * indent_num));
                for (var j = 1; j < tmpLines.length; j++) {
                    result += indent + "      * " + tmpLines[j] + newline;
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
                        let sep = context.items.enum.length < 4 ? "," : ",\n";

                        return "[" + context.items.enum.map(function (x) {
                            return '"' + x + '"';
                        }).join(sep) + "]";
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
    return unEscapeComment(tmp);
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

function escapeComment(str) {
    return str.replace(/\*\//g, "END-COMMENT-TOKEN");
}

function unEscapeComment(str) {
    return str.replace(/END-COMMENT-TOKEN/g, "*/");
}

function resolveNested(schema, def) {
    var comment = "";
    try {
        var composition_type;

        if ("allOf" in schema) {
            composition_type = "allOf";
        }
        else if ("anyOf" in schema) {
            composition_type = "anyOf";
        }
        else if ("oneOf" in schema) {
            composition_type = "oneOf";
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
        if ("additionalProperties" in schema && schema.type === "object") {

            if (!schema.properties) {
                schema.properties = {};
            }
            let additionalProperties = {};
            let key = schema.additionalProperties["__pretty-swag-name__"] ? schema.additionalProperties["__pretty-swag-name__"] : "additionalProperty_1";

            if (schema.additionalProperties.type === "object") {
                additionalProperties[key] = {
                    type: "object"
                    , properties: schema.additionalProperties.properties
                };
            }
            else {
                additionalProperties["additionalProperties_1"] = schema.additionalProperties;
            }
            Object.assign(schema.properties, additionalProperties);
        }
        if (composition_type) {

            var objs = [];
            var arr = schema[composition_type] || [];

            for (var i = 0; i < arr.length; i++) {
                objs.push(resolveNested(arr[i], def));
            }

            if ("properties" in schema) {

                // clone without the composition part
                var tmp = JSON.parse(JSON.stringify(schema))
                delete tmp[composition_type];
                objs.push(resolveNested(tmp));
            }

            if (objs.length == 1) {
                return objs[0];
            }

            return merge(objs);
        }
        else if ("type" in schema || "properties" in schema) {
            if (schema.type === "array") {
                var resolvedItems = [];
                comment = schema.description ? "/*" + escapeComment(schema.description) + "*/" : "";
                if (Array.isArray(schema.items)) {
                    for (var item in schema.items) {
                        resolvedItems.push(resolveNested(schema.items[item], def));
                    }
                }
                else {
                    resolvedItems.push(resolveNested(schema.items, def));
                }

                return "[" + comment + resolvedItems.join(",") + "]";
            }
            else if (schema.type === "object" || "properties" in schema) {
                var keyval = [];
                for (var prop in schema.properties) {

                    if (schema.properties[prop].type === "array"
                        || schema.properties[prop].type === "object"
                        || "properties" in schema.properties[prop]
                        || "allOf" in schema.properties[prop]
                        || "anyOf" in schema.properties[prop]
                        || "oneOf" in schema.properties[prop]
                    ) {
                        keyval.push('"' + prop + '":' + resolveNested(schema.properties[prop], def));
                    }
                    else {
                        comment = schema.properties[prop].description ? "/*" + escapeComment(schema.properties[prop].description) + "*/" : "";
                        if (schema.properties[prop].type) {
                            let vartype;
                            if (schema.properties[prop].format && schema.properties[prop].type !== "string") {
                                vartype = schema.properties[prop].format;
                            }
                            else {
                                vartype = schema.properties[prop].type;
                            }
                            keyval.push('"' + prop + '":"' + vartype + '"' + comment);
                        }
                        else {
                            keyval.push('"' + prop + '":""' + comment);
                        }
                    }
                }
                comment = schema.description ? comment = "/*" + escapeComment(schema.description) + "*/" : "";
                return "{" + comment + joinObjectVals(keyval) + "}";
            }
            else {
                comment = schema.description ? comment = "/*" + escapeComment(schema.description) + "*/" : "";
                return '"' + schema.type + '"' + comment;
            }
        }

        else {
            return JSON.stringify(schema);
        }

    }
    catch (err) {
        if (schema.type) {
            return '"' + schema.type + '"';
        }
        return JSON.stringify(schema, null, indent_num);
    }
}

/**
 *
 * @param objs array of objects to be merged
 * @returns json with comment
 */
function merge(objs) {

    var arr = [];
    var val;
    for (var i = 0; i < objs.length; i++) {
        val = objs[i].trim();
        val = val.startsWith("{") ? val.substr(1, val.length - 2) : val;
        arr.push(val);
    }
    return "{" + arr.join('') + "}";
}


function isEmail(text) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(text);
}

function addAnnotation(schema) {

    var keys = Object.keys(schema.definitions);
    for (var i = 0; i < keys.length; i++) {
        schema.definitions[keys[i]]["__pretty-swag-name__"] = keys[i];
    }
}

function parse(src, dst, config, callback) {

    if (typeof src === "object") {
        addAnnotation(src);
        parseV2(src, dst, config, callback);
    }
    else {
        const fs = require('fs');
        fs.readFile(src, { encoding: "utf8" }, function (err, data) {
            if (err) {
                return callback(err);
            }
            try {
                data = JSON.parse(data);
                addAnnotation(data);
                parseV2(data, dst, config, callback);
            }
            catch (err) {
                return callback(err);
            }
        });
    }
}

function parseV2(obj, dst, config, callback) {

    var $RefParser = require('json-schema-ref-parser');

    $RefParser.dereference(obj, function (err, input) {

        if (err) {
            return callback(err);
        }

        try {
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
            marked_opt.renderer.code = function (code, language) {
                hasCodeSection = true;
                if (language) {
                    return '<pre class="hljs"><code class="' + language + '">' + require('highlight.js').highlight(language, code, true).value + '</code></pre>';
                }
                else {
                    return '<pre class="hljs"><code>' + require('highlight.js').highlightAuto(code).value + '</code></pre>';
                }
            };
            marked.setOptions(marked_opt);
            indent_num = config.indent_num || indent_num;

            var result = livedoc.initContainer();
            result.name = input.info.title;
            result.summary = config.markdown ? marked(input.info.description || "") : input.info.description || "";
            if (input.info.version) {
                result.metadata["Version"] = input.info.version;
            }
            if (input.info.contact) {
                if (input.info.contact.email && input.info.contact.url) {
                    result.metadata["Contact"] = '<a href="mailto:' + input.info.contact.email + '">' + input.info.contact.email + '</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + input.info.contact.url + '" target="_blank">' + input.info.contact.url + '</a>';
                }
                else if (input.info.contact.email) {
                    result.metadata["Contact"] = '<a href="mailto:' + input.info.contact.email + '">' + input.info.contact.name ? input.info.contact.name : input.info.contact.email + '</a>';
                }
                else if (input.info.contact.url) {
                    if (isEmail(input.info.contact.name)) {
                        result.metadata["Contact"] = '<a href="mailto:' + input.info.contact.name + '">' + input.info.contact.name + '</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="' + input.info.contact.url + '" target="_blank">' + input.info.contact.url + '</a>';
                    }
                    else {
                        result.metadata["Contact"] = '<a href="' + input.info.contact.url + '" target="_blank">' + input.info.contact.name ? input.info.contact.name : input.info.contact.url + '</a>';
                    }
                }
                else if (input.info.contact.name) {

                    if (input.info.contact.name.toLowerCase().startsWith("http")) {
                        result.metadata["Contact"] = '<a href="' + input.info.contact.name + '" target="_blank">' + input.info.contact.name + '</a>';
                    }
                    else if (isEmail(input.info.contact.name)) {
                        result.metadata["Contact"] = '<a href="mailto:' + input.info.contact.name + '">' + input.info.contact.name + '</a>';
                    }
                    else {
                        result.metadata["Contact"] = input.info.contact.name;
                    }
                }
            }
            if (input.info.license) {

                if (input.info.license.url) {
                    result.metadata["License"] = '<a href="' + input.info.license.url + '" target="_blank">' + input.info.license.name + '</a>';
                }
                else {
                    result.metadata["License"] = input.info.license.name;
                }
            }
            if (input.info.termsOfService) {
                if (input.info.termsOfService.toUpperCase().startsWith("HTTP")) {
                    result.metadata["Terms of service"] = '<a href="' + input.info.termsOfService + '" target="_blank">' + input.info.termsOfService + '</a>';
                }
                else {
                    result.metadata["Terms of service"] = input.info.termsOfService;
                }
            }
            result.host = input.host || "";
            result.basePath = (input.basePath || "").replace(/\/$/, "");
            result.appConfig.showNav = !config.noNav;
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
                    result.appConfig.bgColor = { default: config.theme };
                }
                else {
                    //custom
                    result.appConfig.bgColor = config.theme;
                }
            }
            result.appConfig.fixedNav = config.fixedNav;
            result.appConfig.showDevPlayground = !config.noRequest;

            if (!config.collapse) {
                config.collapse = {};
            }
            for (var path in input.paths) {

                var api = livedoc.initApi();
                result.apis.push(api);
                api.path = path;
                api.showMe = !config.collapse.path;
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
                    method.showMe = !config.collapse.method;
                    if (config.collapse.tool) {
                        method.showTool = !config.collapse.tool;
                    }
                    else {
                        method.showTool = false;
                    }
                    if (config.autoTags == undefined) {
                        config.autoTags = true;
                    }
                    if (config.autoTags) {
                        //tmp_tags is a place holder for token that will not be added to tags
                        var tmp_tags = method.tags.map(function (x) { return pluralize.singular(x.replace(/[ -_]/g, '').toLowerCase()); });

                        method.tags.push(method.name);
                        var segments = path.split("/");
                        segmentLoop:
                        for (var i = 0; i < segments.length; i++) {
                            var seg = segments[i].trim();
                            if (!seg || (seg.startsWith("{") && seg.endsWith("}"))) {
                                continue;
                            }

                            var normed_seg = seg.trim();
                            var singular = pluralize.singular(normed_seg);
                            normed_seg = pluralize.singular(normed_seg.toLowerCase().replace(/[ -_]/g, ''))
                            //don't add placeholder and plural when already have a singular in
                            //var singular = pluralize.singular(normed_seg);
                            if (tmp_tags.indexOf(normed_seg) > -1) {
                                continue;
                            }

                            for (var j = 0; j < method.tags.length; j++) {
                                var longerTag = method.tags[j].toLowerCase();

                                if (longerTag.startsWith(singular) || longerTag.startsWith(normed_seg)) {
                                    continue segmentLoop;
                                }

                            }
                            method.tags.push(singular);
                            tmp_tags.push(normed_seg);
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
                            param.desc = parameter.description ? (config.markdown ? marked(parameter.description) : parameter.description) : "";
                            param.required = parameter.required;
                            param.value = parameter.default || "";
                            param.type = parameter.type || "text";
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
                        if (response.examples && Object.keys(response.examples).length > 0) {
                            hasCodeSection = true;
                            // add example section
                            var allExamples = "";
                            for (var res_type in response.examples) {
                                var isJson = false;
                                allExamples += "*" + res_type + "*\n```";
                                lowered = res_type.toLowerCase();
                                if (lowered.includes("html")) {
                                    allExamples += 'html\n';
                                }
                                else if (lowered.includes("xml")) {
                                    allExamples += 'xml\n';
                                }
                                else if (lowered.includes("json")) {
                                    allExamples += 'json\n';
                                    isJson = true;
                                }
                                else {
                                    allExamples += "\n";
                                }
                                if (isJson && typeof response.examples[res_type] === 'string') {
                                    allExamples += response.examples[res_type];
                                }
                                else {
                                    allExamples += JSON.stringify(response.examples[res_type], null, indent_num);
                                }
                                allExamples += "\n```\n";
                            }
                            method.examples[code] = marked(allExamples.trim());
                        }

                        res.desc = response.description ? (config.markdown ? marked(response.description) : response.description) : "";
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
                , customCSS: config.customCSS
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

            if (config.home) {
                conf.home = config.home;
            }

            livedoc.generateHTML(JSON.stringify(result, null, indent_num), conf, function (err, data) {
                if (dst === null) {
                    return callback(err, data);
                }
                else if (conf.mode === "offline") {
                    return callback(err);
                }
                else {
                    const fs = require('fs');
                    return fs.writeFile(dst, data, 'utf8', function (err) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null);
                    });
                }
            });
        }
        catch (err) {
            callback(err);
        }
    });

}

map = {
    "run": parse
};
module.exports = map;