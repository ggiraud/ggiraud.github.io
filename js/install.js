var button = document.querySelector('button#install'),
    origin = window.location.origin,
    request = navigator.mozApps.checkInstalled(origin + "/manifest.webapp");

request.onsuccess = function() {
    if (this.result) {
        button.textContent = "update app";
        console.log('Application is already installed');
    } else {
        button.textContent = "install app";
        console.log('Application is not installed');
    }

    button.addEventListener('click', function(e) {
        var request = window.navigator.mozApps.install(origin + "/manifest.webapp");
        request.onsuccess = function() {
            alert("Installation successful");
        };
        request.onerror = function(err) {
            alert("Install failed, error: " + this.error.name);
        };
    }, false);
};

request.onerror = function() {
    alert(this.error.message);
};
