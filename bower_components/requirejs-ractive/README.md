# rv.js

The rv plugin for [RequireJS](requirejs.org) allows you to load Ractive.js templates from HTML files, and optimise them as part of your build. This means you don't need to use multiline strings in your JavaScript, or load files with AJAX or embed templates in `<script>` tags.

It's basically the older (and, frankly, less clever and good-looking) brother of [rvc](https://github.com/ractivejs/rvc) - whereas rvc can convert [component files](https://github.com/ractivejs/component-spec) with encapsulated styles and behaviours, rv only handles templates.

[You should probably check out rvc first](https://github.com/ractivejs/rvc), and come back here if you only want the template parsing stuff.


## Installation

Grab [rv.js](https://raw.githubusercontent.com/ractivejs/rv/master/rv.js) or install it with npm (`npm i rv`) or bower (`bower i rv`).


## Usage

First, RequireJS needs to be able to find `rv.js` and `ractive.js`. Either it should be in the root of your project (or whatever `baseUrl` is configured to be), or you'll need to set up the `paths` config (obviously, change the paths as appropriate):

```js
require.config({
  paths: {
    ractive: 'lib/ractive',
    rv: 'plugins/rv'
  }
});
```

Once RequireJS is configured, you can import components like so:

```js
// At the top-level of your app, e.g. inside your main.js file
require([ 'ractive', 'rv!template' ], function ( Ractive, parsedTemplate ) {
  var ractive = new Ractive({
    el: 'body',
    template: parsedTemplate
  });
});

// Inside a module
define([ 'ractive', 'rv!template' ], function ( Ractive, parsedTemplate ) {
  var ractive = new Ractive({
    el: 'body',
    template: parsedTemplate
  });
});
```

Note that the `.html` file extension is omitted - this is assumed.

Template paths work just like regular module paths, so they can be relative (`rv!../template`), or below an entry in the paths config:

```js
require.config({
  paths: {
    ractive: 'lib/ractive',
    rv: 'plugins/rv',
    templates: 'path/to/ractive_templates'
  }
});

require([ 'ractive', 'rv!templates/foo' ], function ( Ractive, fooTemplate ) {
  var ractive = new Ractive({
    el: 'body',
    template: fooTemplate
  });
});
```


## Optimisation

The great feature of RequireJS is that while you can develop your app without having to rebuild it every time you change a file, you can also bundle it into a single file for production using the [optimiser](http://requirejs.org/docs/optimization.html).

In addition to this 'inlining' of your templates, rv will parse them so that no additional computation needs to happen in the browser.

Once your project is optimised, you don't need the plugin itself, so add `rv` to the `stubModules` option:

```js
// optimiser config
{
  paths: {
    ractive: 'lib/ractive',
    rv: 'plugins/rv'
  },
  stubModules: [ 'rv' ]
}
```

Consult the [documentation](http://requirejs.org/docs/optimization.html) for more information on using the optimiser.


## Changelog

* 0.1.6 - rvc.js and rv.js now live in separate repos. Switch to using toSource for rv.js instead of JSON.stringify
* 0.1.5 - rewrote loader to use [ractivejs/rcu](https://github.com/ractivejs/rcu), plus [toSource](https://github.com/marcello3d/node-tosource) by [marcello3d](https://github.com/marcello3d). CSS is now minified (a bit) on build.
* 0.1.4 - switched from text plugin to Guy Bedford's [amd-loader][https://github.com/guybedford/amd-loader] plugin, and added the `rvc.js` loader
* 0.1.3 - file extension bug fix
* 0.1.2 - Updated to use Ractive 0.3.0 API
* 0.1.1 - renamed. Anglebars is now Ractive
* 0.1.0 - first version


## Credits

Many thanks to Guy Bedford for creating [amd-loader](https://github.com/guybedford/amd-loader), and Marcello Bastéa-Forte for [tosource](https://github.com/marcello3d/node-tosource).


## License

MIT.
