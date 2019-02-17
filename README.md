# pretty-swag

pretty-swag is a UI for [Swagger Specification V2](https://github.com/OAI/OpenAPI-Specification). It is inspired by [Swagger Editor](http://swagger.io/swagger-editor/).

An example of the generated html from [petstore spec](http://petstore.swagger.io/v2/swagger.json) can be found [here](https://twskj.github.io/pretty-swag/examples/pet.html)

*Bugs filing and suggestions are always welcome.*

## Changelog
See [CHANGELOG](CHANGELOG.md)

## Requirement
[Node js](https://nodejs.org/en/)

## Installation

```Shell
npm install pretty-swag -g
```

## Usage

```Shell
pretty-swag -i input.json
```

```Shell
pretty-swag -c config.json
```

```Shell
pretty-swag -i input.json -o output.html
```

```Shell
pretty-swag -i input.json -o output.html -f lite
```

```Shell
pretty-swag -i input.json -o output.html -f offline -m true
```

```Shell
pretty-swag -i input.json -o output.html -f offline -m true -th default
```

## API Usage

**Syntax** `prettySwag.run(input,output,config,callback);`

### API Example
```javascript
const prettySwag = require('pretty-swag');

config = {};
config.format = "singleFile";
config.markdown = true;
config.fixedNav = true;
config.autoTags = true;
config.theme = {
    "default": "blue",
    "GET": "blue",
    "POST": "indigo",
    "DELETE": "red",
    "PUT": "amber"
};

input = "input.json";
output = "doc.html";

prettySwag.run(input,output,config,function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("success");
    }
});
```

When `dst` equals `null`, no file will be written and the html will be returned as second parameter.
```javascript
...
prettySwag.run(input,null,config,function(err,data){
    if(err){
        console.log(err);
    }
    else{
        console.log(data); // Plain html
    }
});
```

## Command switch

| Switch         | Name            | Optional | Description                                                                                |
| -------------- | --------------- | -------- | ------------------------------------------------------------------------------------------ |
|      -i        | input           |       No | Location of a Swagger spec file(can be JSON or YAML)                                       |
|      -o        | output          |      Yes | Location of generated document(s). Default to doc.html                                     |
|      -f        | format          |      Yes | Format of the output (`singlefile`, `offline`, `lite`, `noicon`). Default to `singlefile`  |
|      -m        | markdown        |      Yes | Render Summary & Description as markdown. `true` or `false`. Default to `false`            |
|      -th       | theme           |      Yes | One of the [supported colors](#available-colors) or pre-defined theme `default`            |
|      -c        | config          |      Yes | Location of a configuration file                                                           |
|-fixedNav       | fixedNav        |      Yes | Include this flag to fixed the navigation bar on screen                                    |
|-autoTags       | autoTags        |      Yes | Include this flag to turn on/off automatically generate tags by path and method name       |
|-noDate         | noDate          |      Yes | Include this flag to remove generated date                                                 |
|-noCredit       | noCredit        |      Yes | Include this flag to remove credit                                                         |
|-noNav          | noNav           |      Yes | Include this flag to remove navigation bar. Default to `false`                             |
|-noReq          | noRequest       |      Yes | Include this flag to remove request panel. Default to `false`                              |
|-noBaseURL      | noBaseURL       |      Yes | Include this flag to suppress baseURL. Default to `false`                                  |
|-indent         | indent          |      Yes | Include this flag to specify space per indentation. Default to 3                           |
|      -v        | version         |      Yes | To show pertty-swag current version                                                        |
|-collapsePath   | collapse.path   |      Yes | Collapse path by default. `true` or `false`. Default to `false`                            |
|-collapseMethod | collapse.method |      Yes | Collapse method by default. `true` or `false`. Default to `false`                          |
|-collapseTool   | collapse.tool   |      Yes | Collapse tool by default. `true` or `false`. Default to `true`                             |
|-home.url       | home.url        |      Yes | A home URL. Leave it blank to suppress the display                                         |
|-home.location  | home.location   |      Yes | A location on navigation bar. Either L (Left) RL (Right before Expand) RR(Right most)      |
|-home.text      | home.text       |      Yes | A text on navigation bar. Default to `Home`                                                |




## Configuration File

Valid keys are:
 - input
 - output
 - format
 - markdown
 - theme
 - fixedNav
 - hideNav
 - autoTags
 - noDate
 - noCredit
 - noRequest
 - indent
 - collapse
 - customCSS
 - home

**Example of Configuration file**
```javascript
{
  "input": "/tmp/petstore.json",
  "output": "/tmp/petstore.html",
  "format": "singlefile",
  "markdown": true,
  "theme": {
    "default": "blue",
    "GET": "blue",
    "POST": "indigo",
    "DELETE": "red",
    "PUT": "amber"
  },
  "fixedNav": true,
  "autoTags": true,
  "indent": 2,
  "collapse":{
    "path":true
    ,"method":true
    ,"tool":true
  }
  "home":{
      "URL": "https://github.com/twskj/pretty-swag/"
      ,"location": "RR"
      ,"text": "Home"
  }
}
```

## Available Colors

- red
- pink
- purple
- deep-purple
- indigo
- blue
- light-blue
- cyan
- teal
- green
- light-green
- lime
- yellow
- amber
- orange
- deep-orange
- brown
- grey
- blue-grey
- black
- white


## Output format

 - SingleFile - A single html embedded all fonts and icon in one file. (Default).
 - Offline - A html file and a resource folder for css and js.
 - Lite - A single html but need the internet connection to obtain required resources.
 - NoIcon - Does not use Roboto font, and no icons (Useful when dealing with older IEs)


## Features

- Search / Filter by Tag

- Collapsible Panel

- Fold / Unfold Schema

- Live Request / Response Feedback

- Syntax Highlight code block

- Download and Preview response data

## Filtering

- Use prefix `-` to exclude unwanted tags. For example `-store` will exclude api(s) that contain `store` tag.

## Console

- Press `` Ctrl + `  `` to bring up a console
- Press `tab` to auto complete

## Available Console Commands

| Command                             | Description                                    |
| ----------------------------------- | ---------------------------------------------- |
| add header -g \<key\> \<value\>     | Adding the header to all paths/methods         |
| remove header -g \<key\> \<value\>  | Remove a given header from all paths/methods   |



## License

The contents of this repository are covered under the [MIT License](LICENSE)

## Support on Beerpay
Like the project? buy me some :beers:!

[![Beerpay](https://beerpay.io/twskj/pretty-swag/badge.svg?style=beer-square)](https://beerpay.io/twskj/pretty-swag)  [![Beerpay](https://beerpay.io/twskj/pretty-swag/make-wish.svg?style=flat-square)](https://beerpay.io/twskj/pretty-swag?focus=wish)
