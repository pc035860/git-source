# git-source

`git-source` shows off your github pages hosted source codes and examples.

<img src="https://raw.github.com/pc035860/git-source/master/screenshots/tomorrow.png" alt="theme tomorrow" width="550">

#### Features

* Example view & single-file view
* Support 31 syntax highlight themes via [Highlight.js](http://softwaremaniacs.org/soft/highlight/en/)
* "Edit" on [Plunker](http://plnkr.co)
* Planty of options for better custimization
* Support autogrow functionality with a tiny script plugin
* Built with [AngularJS](http://angularjs.org)

#### Demos

* [Basic](http://pc035860.github.io/git-source/)
* [Embed](http://pc035860.github.io/git-source/embed_test.html)
* [Live on my `ng-noob` blog](http://ng-noob.tumblr.com)

## Getting started

#### Setup your own `git-source`

In order to retrieve source codes hosted in your [GitHub Pages](http://pages.github.com/), you'll need to:

1. Fork this repo
2. Clone it to local
3. [Make a push commit to inform github that you want to setup your `git-source` in GitHub Pages.](http://stackoverflow.com/questions/8587321/github-pages-in-forked-repo)

If you got it right, you'll have your version of `git-source` available at [http://{USERNAME}.github.io/git-source/](http://{USERNAME}.github.io/git-source/).

And you're good to go!!


#### Host your examples

To host an example repo in [GitHub Pages](http://pages.github.com/), here is an example available at [https://github.com/pc035860/ng-noob.tumblr.com](https://github.com/pc035860/ng-noob.tumblr.com).

#### Embed with `<iframe>`

Extracted from the [ng-noob blog post](http://ng-noob.tumblr.com/post/61650112265/ngqueue):

```html
<iframe frameborder="0" src="http://pc035860.github.io/git-source/#/ng-noob.tumblr.com/examples/09-18-2013/ngqueue/?theme=monokai_sublime&fontsize=14&edit=1" width="680" height="600"></iframe>
```

Read the [usage](#usage) section for configuration details.

## Usage

### git-source.json (required)

`git-source.json` gives `git-source` informations about your source codes, in the following format:

```json
{
  "name": "name",
  "description": "description",
  "tags": ["tags", "will", "appear", "in plunker editor"],
  "files": [
  	"a.html", "b.js", "c.css"
  ]
}
```

Here's an [example from my ng-noob blog]([http://pc035860.github.io/git-source/#/ng-noob.tumblr.com/examples/09-07-2013/programmatical-form-submission/?theme=tomorrow&fontsize=14&edit=1](http://pc035860.github.io/git-source/#/ng-noob.tumblr.com/examples/09-07-2013/programmatical-form-submission/?theme=tomorrow&fontsize=14&edit=1).

```json
{
  "name": "AngularJS submitIt directive",
  "description": "AngularJS submitIt directive",
  "tags": ["angularjs", "form"],
  "files": [
  	"index.html", "app.js", "submitIt.js"
  ]
}
```


### Source path

Specify your `git-source.json` directory path with the route after `#`.

For the example available at 

http://pc035860.github.io/ng-noob.tumblr.com/examples/09-18-2013/ngqueue/

, the `git-source` url will look like this:

http://pc035860.github.io/git-source/#/ng-noob.tumblr.com/examples/09-18-2013/ngqueue/

**pro-tip:** Simply add `/git-source/#` at `http://{your username}.github.io{HERE}/{original path}`.


### Autogrow plugin

To enable the autogrow functionality, add the autogrow plugin script to the web page.

```html
<script type="text/javascript" src="http://pc035860.github.io/git-source/plugin/git-source.autogrow.js"></script>
```

Then specify the `autogrow` option for each `git-source` iframe you want to enable the autogrow functionality with unique string as ID.

Example `autogrow` IDs:

* 10
* A
* 09-07-2013.1
* d41d8cd98f00b204e9800998ecf8427e
* da39a3ee5e6b4b0d3255bfef95601890afd80709


### Options

#### theme

Type: `string` Default: `default` View: `example & single-file`

The syntax highlight theme. All available themes can be found [here](https://github.com/pc035860/git-source/tree/master/app/lastest_highlightjs_styles).


#### fontsize

Type: `number` Default: `null` View: `example & single-file`

Source code font size.


#### result

Type: `boolean` Default: `true` View: `example`

Shows the "Result" button to watch the result.


#### edit

Type: `boolean` Default: `false` View: `example`

Show the "Edit" button to edit on plunker.


#### fileselect

Type: `boolean` Default: `null` View: `example`

Use an HTML `<select>` to display file list rather than tabs. Useful when there are too much file to display.


#### autogrow

Type: `string` Default: `null` View: `example & single-file`

Specify an unique ID on the same page for autogrow plugin script to work.


#### file

Type: `string` Default: `null` View: `single-file`

Specify a filename in the `git-source.json`'s file list. Enter single-file view.


#### line

Type: `number or string` Default: `null` View: `single-file`

* `number` for single line display
* `{number1}-{number2}` to display a range for line `number1` to line `number2`


#### lang

Type: `string` Default: `null` View: `single-file`

Force the Highlight.js to highlight the code with specified language.


#### init

Type: `string` Default: `null` View: `example`

The first file should be displayed after example initialization.

`Result` can be set with special name `!result`.
