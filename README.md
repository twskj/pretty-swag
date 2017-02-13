# pretty-swag

pretty-swag is a UI for Swagger Specification. It is inspired by Swagger Editor.

## Installation

```Shell
npm install pretty-swag -g
```

## Example

```Shell
pretty-swag -i swagger.json -o doc.html
```

## Command switch
- -i **I**nput location of a Swagger spec file(can be JSON or YAML)
- -o **O**utput location of generated document(s).
- -f **F**ormat of the output (singlefile|offline|embedded)

## Output format

 - SingleFile(Default) - A single html but need the internet connection to download libraries from CDN.
 - Offline - Self Hosted files in a directory.
 - Embedded - A single html but without the material icons.
 
 

## TODO:
- [ ] handle ref loop?


