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
        "underscore": '/bower_components/underscore/underscore-min',
        "hello": '/bower_components/hello/dist/hello.min'
    },
    shim: {
        "hello": {
            exports: 'hello'
        },
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

require(['search/search', 'hello'], function(search, hello) {
    var button = document.createElement('BUTTON');
    document.body.appendChild(button);
    button.textContent = 'github';

    button.addEventListener('click', function(e) {
        console.log('connect to github...');
        hello('github').login();
    }, false);

    hello.on('auth.login', function(auth) {
        // call user information, for the given network
        hello(auth.network).api('/me').then(function(r) {
            // Inject it into the container
            console.log(auth.network, r);
        });
    });

    hello.init({
        github: 'c1882e1253b6b429c0f4',
    });
});
