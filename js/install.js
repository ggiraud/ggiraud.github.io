var button = document.querySelector('button#install');

button.addEventListener('click', function(e) {
    new Promise(function(resolve, reject) {
        var request = navigator.mozApps.checkInstalled("http://ggiraud.github.io/manifest.webapp");
        request.onsuccess = function() {
            reject(new Error('application already installed'));
        };
        request.onerror = function() {
            resolve('application not installed');
        };
    }).then(function() {
        var request = window.navigator.mozApps.install("http://ggiraud.github.io/manifest.webapp");
        return new Promise(function(resolve, reject) {
            request.onsuccess = function() {
                resolve("Installation successful");
            };
            request.onerror = function(err) {
                reject(new Error("Install failed, error: " + this.error.name));
            };
        });
    }).then(function(msg) {
        alert(msg);
    }).catch (function(msg) {
        alert(msg);
    });
}, false);
