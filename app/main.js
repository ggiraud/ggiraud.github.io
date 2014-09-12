require.config({
    paths: {
        "hello": "/bower_components/hello/dist/hello.all",
        "es6-promise": "/bower_components/es6-promise/promise.min",
        "jquery": "/bower_components/jquery/dist/jquery.min",
        "bacon": "/bower_components/bacon/dist/Bacon.min",
        "ractive": "/bower_components/ractive/ractive.min",
        "ractive-adaptors-bacon": "/bower_components/ractive-adaptors-bacon/ractive-adaptors-bacon.min",
        "rv": "/bower_components/requirejs-ractive/rv",
        "localforage": "/bower_components/localforage/dist/localforage.min",
        "restyle": "/bower_components/restyle/build/restyle",
        "underscore": "/bower_components/underscore/underscore-min"
    },
    shim: {
        "hello": {
            exports: "hello"
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
    button.textContent = "github";
    document.body.appendChild(button);

    // hello.init({
    //     github: 'c1882e1253b6b429c0f4'
    // },{
    //     redirect_uri: "http://ggiraud.github.io",
    //     response_type: "code"
    // });

    // hello.on('auth.login', function(auth) {
    //     console.log(auth);
    // });

    // button.onclick = function(e) {
    //     hello('github').login().then(function() {
    //         console.log(hello('github').getAuthResponse());
    //     });
    // };

    var github = document.createElement('DIV');

    hello.on('auth.login', function(r){
        // Get Profile
        console.log("auth.login");
        hello.api(r.network+':/me', function(p){
            document.getElementById(r.network).innerHTML = "<img src='"+ p.thumbnail + "' width=24/>Connected to "+ r.network+" as " + p.name;
        });
        hello.api(r.network+':/user/repos', function(r){
            console.log(r);
            for(var i=0;i<r.length;i++){
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.innerHTML = r[i].full_name;
                a.href=r[i].html_url;
                li.appendChild(a);
                document.getElementById('result').appendChild(li);
            }
        });
    });

    hello.init({
        github : 'c1882e1253b6b429c0f4'
    },  {redirect_uri:'../index.html'});

});
