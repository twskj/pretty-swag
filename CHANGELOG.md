# Change Log
### version 0.2.2 [Feb 26, 2019]
- Update highlight.js

### version 0.2.1 [Feb 17, 2019]
- Stretch console to right most

### version 0.2.0 [Dec 15, 2018]
- display base URL by default
- move charset next to <head>
- update dependencies: marked
- start doing prpper sem ver

### version 0.1.154 [July 27, 2018]
- remove js-yaml

### version 0.1.153 [July 27, 2018]
- Fix YAML bug introduce in 0.1.150

### version 0.1.152 [July 15, 2018]
- Syntax Highlight
- Support schema level required fields

### version 0.1.151 [July 2, 2018]
- Limit array inline syntax to 3
- Render specific variable type e.g. int64, int32 if available

### version 0.1.150 [July 1, 2018]
- Fix `additionalProperties` interpretation
- Api now can take either object to path to input file

### version 0.1.149 [July 1, 2018]
- Improve search functionalities
- Click on tags default to toggle on/off

### version 0.1.148 [Jun 27, 2018]
- Fix display file upload as text input

### version 0.1.147 [Jun 27, 2018]
- Suppress other parameters when one of them has `in` property as `body`

### version 0.1.146 [YANKED]

### version 0.1.145 [Jun 21, 2018]
- Handle "additionalProperties" when base type is object

### version 0.1.144 [Jan 4, 2018]
- Update dependencies

### version 0.1.143 [Dec 25, 2017]
- fix file upload placeholder contains p tag

### version 0.1.142 [YANKED]
### version 0.1.141 [YANKED]
### version 0.1.140 [YANKED] 
### version 0.1.139 [Dec 25, 2017]
 - add border to request/response panel

### version 0.1.138 [Dec 3, 2017]
 - Update dependencies
 
### version 0.1.136 [Dec 1, 2017]
 - Fix data alignment

### version 0.1.135 [Nov 30, 2017]
 - Fix generating error html when data contain $

### version 0.1.134 [Oct 10, 2017]
 - Add package-lock.json to play nice with npm 5

### version 0.1.131 [Oct 9, 2017]
 - Default radio button color from blue to grey

### version 0.1.131 [Oct 9, 2017]
 - Fix default to "Try this operation"

### version 0.1.130 [Oct 9, 2017]
 - Fix conf.mode undefined

### version 0.1.129 [Oct 9, 2017]
 - Fix Offline mode overwrite result file with undefined

### version 0.1.128 [Oct 9, 2017]
 - Fix Offline mode never calls callback

Add missing callback call in offline mode
 ### version 0.1.126 [Sep 16, 2017]
 - Fix Offline mode missing Path
### version 0.1.125 [Sep 16, 2017]
 - Add User-Agent header

### version 0.1.124 [Aug 9, 2017]
 - Improve download filename
 - Always show response body

### version 0.1.123 [yank]
### version 0.1.122 [yank]

### version 0.1.121 [Aug 9, 2017]
 - Update livedoc to embeded all resources

### version 0.1.120 [Aug 7, 2017]
 - Move require('fs') down the line to help browser based app

### version 0.1.120 [Jul 30, 2017]
 - Make IE less complain about missing tag

### version 0.1.119 [Jul 29, 2017]
 - Trim trailing backslash of base path

### version 0.1.118 [Jul 29, 2017]
 - Add JSON previewer

### version 0.1.114 [Jul 28, 2017]
 - Add Preview and Download Response

### version 0.1.113 [Jul 23, 2017]
 - Support parameter type `file`

### version 0.1.112 [Jul 11, 2017]
 - Add esprima as a direct dependency

### version 0.1.111 [Jun 11, 2017]
 - json response example can now be object and string

### version 0.1.110 [Jun 11, 2017]
 - Default font color now 53,53,53,.087

### version 0.1.109 [Jun 10, 2017]
 - Add Response Example Section

### version 0.1.107 [Jun 10, 2017]
 - Adjust email first then link in contact section

### version 0.1.106 [Jun 10, 2017]
 - Add "termsOfService", "contact", "license" information

### version 0.1.105 [Jun 9, 2017]
 - Add Home button

### version 0.1.104 [Jun 3, 2017]
 - Roll out Object Composition (allOf keyword)
 - Array now can show comment

### version 0.1.103 [Jun 2, 2017]
 - Fix Request Panel visibility when Method Folding Flag present

### version 0.1.102 [Jun 2, 2017]
 - Change behavior of auto-tagging faeture

### version 0.1.101 [May 31, 2017]
 - Table column now adjustable

### version 0.1.100 [May 14, 2017]
 - API return html when dst is null

### version 0.1.99 [Apr 15, 2017]
 - enable customCSS

### version 0.1.98 [Apr 15, 2017]
 - wrap main func with try-catch

### version 0.1.97 [Apr 15, 2017]
 - fix undefined collapse configuration bug

### version 0.1.96 [Apr 13, 2017]
 - add collapse configuration

### version 0.1.94 [Apr 09, 2017]
 - change default indent_num to 3
 - fix missing comma in schema when comment present
 - fix block comment indentation

### version 0.1.92 [Apr 09, 2017]
 - add markdown to parameter's description and response's description

### version 0.1.91 [Apr 08, 2017]
 - fix multi-line comment format

### version 0.1.90 [Apr 06, 2017]
 - fix overflow on parameter schema

### version 0.1.89 [Mar 27, 2017]
 - fix noNav issue

### version 0.1.88 [Mar 27, 2017]
 - Introduce -noReq flag to suppress request panel
 - rename -hideNav to -noNav

### version 0.1.87 [Mar 23, 2017]
 - Introduce Syntax Highlighter
 - Fix always generates autotags bug
 - Suppress Available Tags when no tags available

### version 0.1.82 [Mar 22, 2017]
 - Fix markdown console switch
 - Fix bug when no main description
 - Change Bold font weight

### version 0.1.81 [Mar 21, 2017]
 - Add hide navigation bar

### version 0.1.80 [Mar 16, 2017]
 - Add unicode character support

### version 0.1.79 [Mar 11, 2017]
 - Handle space issue in tags

### version 0.1.78 [Mar 11, 2017]
 - changed internal parsing algorithm

### version 0.1.76 [Mar 11, 2017]
 - Fixed generating singular nouns when using auto-tag mode
 - Tags are now starting (left most) with capital letter tag

### version 0.1.74 [Mar 10, 2017]
 - pre-fill param with default value

### version 0.1.73 [Mar 10, 2017]
 - add -v , --version flag to show current version

### version 0.1.72 [Mar 10, 2017]
 - change POST default color to teal

### version 0.1.71 [Mar 10, 2017]
 - Resolve external $ref

### version 0.1.70 [Mar 6, 2017]
 - Make footer optional
 - Make request headers list smaller and horizontal align

### version 0.1.63 [Mar 5, 2017]
 - Fixed https default port show port number :443
 - Fixed Text Input color doesn't change accordingly


### version 0.1.60 [Mar 4, 2017]
 - Fixed Header added by console not reactive


### version 0.1.59 [Mar 3, 2017]
 - Match radio button color and text input color to the main color


### version 0.1.58 [Mar 3, 2017]
 - Introduce Console interface
 - Introduce Adding global header
 - Introduce Removing global header


### version 0.1.56 [Mar 3, 2017]
 - Redo `singleFile` mode to embedded fonts & icons
 - Changed old `singleFile` mode to `lite`
 - Changed `embedded` to `noicon`


### version 0.1.53 [Feb 22, 2017]
 - Support object property description


### version 0.1.51 [Feb 20, 2017]

 - Re-format help screen
 - Introduce autoTags mode
 - Sort tags


#### version 0.1.40 [Feb 19, 2017]

 - Introduce Configuration file
 - Introduce Color theme configuration feature
 - Introduce Navbar fixed | normal feature
 - Make method name uppercased
