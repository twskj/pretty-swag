# pretty-swag

pretty-swag is a UI for [Swagger Specification V2](https://github.com/OAI/OpenAPI-Specification). It is inspired by [Swagger Editor](http://swagger.io/swagger-editor/).

An example of the generated html from [petstore spec](http://petstore.swagger.io/v2/swagger.json) can be found [here](http://htmlpreview.github.com/?https://raw.githubusercontent.com/twskj/pretty-swag/gh-pages/examples/pet.html)

*Bugs filing and suggestions are always welcome.*

## Changelog
Can be found [here](CHANGELOG.md)

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

| Switch  | Name     | Optional | Description                                                                          |
| ------- | -------- | -------- | ------------------------------------------------------------------------------------ |
|   -i    | Input    |       No | Location of a Swagger spec file(can be JSON or YAML)                                 |
|   -o    | Output   |      Yes | Location of generated document(s). Default to doc.html                               |
|   -f    | Format   |      Yes | Format of the output (`singlefile`, `offline`, `embedded`). Default to `singlefile`  |
|   -m    | Markdown |      Yes | Render Summary & Description as markdown. `true` or `false`. Default to `false`      |
|   -th   | Theme    |      Yes | One of the [supported colors](#available-colors) or pre-defined theme `colors`           |
|   -c    | Config   |      Yes | Location of a configuration file                                                     |
|   -nav  | FixedNav |      Yes | Include this to have navigation bar always on screen                                 |


## Configuration File

Valid keys are:
 - Input
 - Output
 - Format
 - Markdown
 - Theme
 - FixedNav

**Example of Configuration file**
```javascript
{
  "Input": "/tmp/petstore.json",
  "Output": "/tmp/petstore.html",
  "Format": "singlefile",
  "Markdown": true,
  "Theme": {
    "default": "orange",
    "GET": "deep-purple",
    "POST": "indigo",
    "DELETE": "red",
    "PUT": "amber"
  },
  "FixedNav": true
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

- Support `allOf`, `anyOf`, `oneOf` keywords

## Filtering

- Use prefix `-` to exclude unwanted tags. For example `-store` will exclude api that contain `store` tag.
