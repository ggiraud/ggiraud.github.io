var button = document.querySelector('#install'),
    origin = window.location.origin,
    request = navigator.mozApps.checkInstalled(origin + "/manifest.webapp");


request.onsuccess = function() {
    if (this.result) {
        console.log('Application is already installed');
        button.disabled = true;
    } else {
        console.log('Application is not installed');

        button.addEventListener('click', function(e) {
            var request = window.navigator.mozApps.install(origin + "/manifest.webapp");
            request.onsuccess = function() {
                alert("Installation successful");
                button.disabled = true;
            };
            request.onerror = function(err) {
                alert("Install failed, error: " + this.error.name);
            };
        }, false);
    }
};

request.onerror = function() {
    alert(this.error.message);
};
