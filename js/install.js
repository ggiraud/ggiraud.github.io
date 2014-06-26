var button = document.querySelector('button#install'),
	origin = window.location.origin;

button.addEventListener('click', function(e) {
    new Promise(function(resolve, reject) {
        var request = navigator.mozApps.checkInstalled(origin + "/manifest.webapp");
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
            var request = window.navigator.mozApps.install(origin + "/manifest.webapp");
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
