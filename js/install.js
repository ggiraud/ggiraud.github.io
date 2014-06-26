var button = document.querySelector('button#install');

button.addEventListener('click', function(e) {
    new Promise(function(resolve, reject) {
        // var request = navigator.mozApps.checkInstalled("http://ggiraud.github.io/manifest.webapp");
        var request = navigator.mozApps.checkInstalled("http://localhost:9001/manifest.webapp");
        request.onsuccess = function() {
            if (this.result) {
                reject(new Error('Application is already installed'));
            } else {
            	resolve('Application is not installed');
            }
        };
        request.onerror = function() {
        	reject(this.error);
        };
    }).then(function() {
        return new Promise(function(resolve, reject) {
            // var request = window.navigator.mozApps.install("http://ggiraud.github.io/manifest.webapp");
            var request = window.navigator.mozApps.install("http://localhost:9001/manifest.webapp");
            request.onsuccess = function() {
                resolve("Installation successful");
            };
            request.onerror = function(err) {
                reject(new Error("Install failed, error: " + this.error.name));
            };
        });
    }).then(function(msg) {
        alert(msg);
    }).catch (function(err) {
        alert(err.message);
    });
}, false);
