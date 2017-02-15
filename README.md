# pretty-swag

pretty-swag is a UI for [Swagger Specification V2](https://github.com/OAI/OpenAPI-Specification). It is inspired by [Swagger Editor](http://swagger.io/swagger-editor/).

An example of the generated html from [petstore spec](http://petstore.swagger.io/v2/swagger.json) can be found [here](http://htmlpreview.github.com/?https://raw.githubusercontent.com/twskj/pretty-swag/gh-pages/examples/pet.html)

## Installation

```Shell
npm install pretty-swag -g
```

## Usage

```Shell
pretty-swag -i input.json
```

```Shell
pretty-swag -i input.json -o output.html
```

```Shell
pretty-swag -i input.json -o output.html -f offline
```

```Shell
pretty-swag -i input.json -o output.html -f offline -m true
```

## Command switch

| Switch | Name     | Optional | Description                                                                          |
| ------ | -------- | -------- | ------------------------------------------------------------------------------------ |
|   -i   | Input    |       No | Location of a Swagger spec file(can be JSON or YAML)                                 |
|   -o   | Output   |      Yes | Location of generated document(s). Default to doc.html                               |
|   -f   | Format   |      Yes | Format of the output (`singlefile`, `offline`, `embedded`). Default to `singlefile`  |
|   -m   | Markdown |      Yes | Render Summary & Description as markdown. `true` or `false`. Default to `false`      |

## Output format

 - SingleFile - A single html but need the internet connection to download libraries from CDN (Default).
 - Offline - Self Hosted files in a directory.
 - Embedded - A single html but without the material icons.

## Features

**Search by Tag**
![Image shows search feature](https://raw.githubusercontent.com/twskj/pretty-swag/gh-pages/images/search.gif?raw=true)

---------------------------------------

**Collapsible Panel**
![Image shows search feature](https://raw.githubusercontent.com/twskj/pretty-swag/gh-pages/images/collapsible.gif?raw=true)

---------------------------------------

**Fold / Unfold Schema**
![Image shows search feature](https://raw.githubusercontent.com/twskj/pretty-swag/gh-pages/images/foldable.gif?raw=true)

---------------------------------------

**Live Request / Response Feedback**
![Image shows search feature](https://raw.githubusercontent.com/twskj/pretty-swag/gh-pages/images/liveReqRes.gif?raw=true)

---------------------------------------
