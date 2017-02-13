# pretty-swag

pretty-swag is a UI for Swagger Specification. It is inspired by [Swagger Editor](http://swagger.io/swagger-editor/).

## Installation

```Shell
npm install pretty-swag -g
```

## Example

```Shell
pretty-swag -i input.json -o output.html
```

## Command switch
Switch |  Name  | Optional | Description 
-------|--------|----------|--------------------------------------------------------------------------
-i     | Input  |       No | Location of a Swagger spec file(can be JSON or YAML)
-o     | Output |      Yes | Location of generated document(s). Default to doc.html
-f     | Format |      Yes | Format of the output (`singlefile`, `offline`, `embedded`). Default to `singlefile`

## Output format

 - SingleFile - A single html but need the internet connection to download libraries from CDN (Default).
 - Offline - Self Hosted files in a directory.
 - Embedded - A single html but without the material icons.
 
## Features

- Search by Tag

- Collapsible Panel

- Fold / Unfold Schema

- Live Request/Response Feedback

