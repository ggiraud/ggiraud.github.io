var request = window.navigator.mozApps.install("http://ggiraud.github.io/manifest.webapp");
request.onsuccess = function() {
	alert("Installation successful");
};

request.onerror = function() {
	alert("Install failed, error: " + this.error.name);
};