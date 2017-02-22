# pretty-swag

pretty-swag is a UI for [Swagger Specification V2](https://github.com/OAI/OpenAPI-Specification). It is inspired by [Swagger Editor](http://swagger.io/swagger-editor/).

An example of the generated html from [petstore spec](http://petstore.swagger.io/v2/swagger.json) can be found [here](http://htmlpreview.github.com/?https://raw.githubusercontent.com/twskj/pretty-swag/gh-pages/examples/pet.html)

*Bugs filing and suggestions are always welcome.*

## Changelog
See [CHANGELOG](CHANGELOG.md)

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
pretty-swag -i input.json -o output.html -f offline
```

```Shell
pretty-swag -i input.json -o output.html -f offline -m true
```

```Shell
pretty-swag -i input.json -o output.html -f offline -m true -th default
```

## Command switch

| Switch  | Name     | Optional | Description                                                                          |
| ------- | -------- | -------- | ------------------------------------------------------------------------------------ |
|   -i    | input    |       No | Location of a Swagger spec file(can be JSON or YAML)                                 |
|   -o    | output   |      Yes | Location of generated document(s). Default to doc.html                               |
|   -f    | format   |      Yes | Format of the output (`singlefile`, `offline`, `embedded`). Default to `singlefile`  |
|   -m    | markdown |      Yes | Render Summary & Description as markdown. `true` or `false`. Default to `false`      |
|   -th   | theme    |      Yes | One of the [supported colors](#available-colors) or pre-defined theme `default`      |
|   -c    | config   |      Yes | Location of a configuration file                                                     |
|   -nav  | fixedNav |      Yes | Include this flag to fixed the navigation bar on screen                              |
|-autoTags| autoTags |      Yes | Include this flag to automatically generate tags by path and method name             |


## Configuration File

Valid keys are:
 - input
 - output
 - format
 - markdown
 - theme
 - fixedNav
 - autoTags

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
  "autoTags": true
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

 - SingleFile - A single html but need the internet connection to download libraries from CDN (Default).
 - Offline - Self Hosted files in a directory.
 - Embedded - A single html but without Material icons.


## Features

- Search / Filter by Tag

- Collapsible Panel

- Fold / Unfold Schema

- Live Request / Response Feedback

## Filtering

- Use prefix `-` to exclude unwanted tags. For example `-store` will exclude api that contain `store` tag.
