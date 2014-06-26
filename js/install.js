var button = document.querySelector('button#install'),
    origin = window.location.origin;

new Promise(function(resolve, reject) {
    var request = navigator.mozApps.checkInstalled(origin + "/manifest.webapp");
    request.onsuccess = function() {
        if (this.result) {
            button.textContent = "update app";
            resolve('Application is already installed');
        } else {
            button.textContent = "install app";
            resolve('Application is not installed');
        }
    };
    request.onerror = function() {
        reject(this.error);
    };
}).then(function() {
    button.addEventListener('click', function(e) {
        new Promise(function(resolve, reject) {
            var request = window.navigator.mozApps.install(origin + "/manifest.webapp");
            request.onsuccess = function() {
                resolve("Installation successful");
            };
            request.onerror = function(err) {
                reject(new Error("Install failed, error: " + this.error.name));
            };
        }).then(function(msg) {
            alert(msg);
        }, function(err) {
            alert(err.message);
        });
    }, false);
}).catch(function(err) {
	alert(err.msg);
});
