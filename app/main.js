require.config({
    paths: {
        "es6-promise": "/bower_components/es6-promise/promise.min",
        "jquery": "/bower_components/jquery/dist/jquery.min",
        "bacon": "/bower_components/bacon/dist/Bacon.min",
        "ractive": "/bower_components/ractive/ractive.min",
        "ractive-adaptors-bacon": "/bower_components/ractive-adaptors-bacon/ractive-adaptors-bacon.min",
        "rv": "/bower_components/requirejs-ractive/rv",
        "localforage": "/bower_components/localforage/dist/localforage.min",
        "restyle": "/bower_components/restyle/build/restyle",
        "underscore": '/bower_components/underscore/underscore-min'
    },
    shim: {
        "es6-promise": {
            exports: "Promise"
        },
        "bacon": {
            exports: "Bacon"
        },
        "restyle": {
            exports: "restyle"
        },
        "underscore": {
            exports: "_"
        }
    }
});

require(['search/search', 'git/git'], function(search, git) {
    var button = document.createElement('BUTTON');
    button.textContent = "github";
    document.body.appendChild(button);

    var script = document.createElement('SCRIPT');
    script.setAttribute('src', 'https://github.com/login/oauth/authorize?client_id=c1882e1253b6b429c0f4&callback=jsonpCallback');
    script.setAttribute('type', 'text/javascript');

    button.onclick = function(e) {
        document.head.appendChild(script);
        document.head.removeChild(script);
    };

    function jsonPCallback(val) {
        console.log(val);
    }

    // git.authorize();
});
