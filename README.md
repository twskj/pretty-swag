# pretty-swag

pretty-swag is a UI for Swagger Specification. It is inspired by [Swagger Editor](http://swagger.io/swagger-editor/).

## Installation

```Shell
npm install pretty-swag -g
```

## Example

```Shell
pretty-swag -i input.json
```

```Shell
pretty-swag -i input.json -o output.html
```

```Shell
pretty-swag -i input.json -o output.html -f offline
```

## Command switch

| Switch |  Name  | Optional | Description                                                                          |
| ------ | ------ | -------- | ------------------------------------------------------------------------------------ |
|   -i   | Input  |       No | Location of a Swagger spec file(can be JSON or YAML)                                 |
|   -o   | Output |      Yes | Location of generated document(s). Default to doc.html                               |
|   -f   | Format |      Yes | Format of the output (`singlefile`, `offline`, `embedded`). Default to `singlefile`  |

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
