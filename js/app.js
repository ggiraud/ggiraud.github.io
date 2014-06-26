var checkAudioContext = new Promise(function(resolve,reject) {
	window.audioContext = (window.AudioContext || window.webkitAudioContext);

	if (window.audioContext) {
		resolve("web audio API is available");
	} else {
		reject("web audio API is unavailable");
	}
});

var checkGetUserMedia = new Promise(function(resolve,reject) {
	navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia
		|| navigator.mozGetUserMedia || navigator.msGetUserMedia);

	if (navigator.getUserMedia) {
		resolve("audio capture is available");
	} else {
		reject("audio capture is unavailable");
	}
});

function onAudioCaptureSuccess(stream) {
	var canvas = document.querySelector('canvas');
	var drawContext = canvas.getContext('2d');

	var audioContext = new window.audioContext();
	var source = audioContext.createMediaStreamSource(stream);
	var analyser = audioContext.createAnalyser();
	analyser.fftSize = 512;
	analyser.smoothingTimeConstant = 0.8;
	source.connect(analyser);

	var buffer = new Uint8Array(analyser.frequencyBinCount);
	console.log(buffer);

	function draw() {
		var midHeight = Math.floor(canvas.height / 2);
		analyser.getByteTimeDomainData(buffer);

		drawContext.clearRect(0,0,canvas.width,canvas.height);

		drawContext.strokeStyle = '#4C9ED9';
		drawContext.lineWidth = 4;
		drawContext.beginPath();
		drawContext.moveTo(0, midHeight);
		for (var i = 1; i < buffer.length; i++) {
			var attenuation = Math.cos(i * (Math.PI * 2) / buffer.length) * -0.5 + 0.5,
				x = i * canvas.width / buffer.length,
				y = ((buffer[i] * canvas.height / 255) - midHeight) * attenuation + midHeight;

			drawContext.lineTo(x, y);
		}
		drawContext.stroke();

		window.requestAnimationFrame(draw);
	}
	window.requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', function(e) {
	Promise.all([checkAudioContext,checkGetUserMedia]).then(function() {
		navigator.getUserMedia({audio: true}, onAudioCaptureSuccess, function(err) {
			console.log(err);
		});
	}).catch(function(err) {
		alert(err);
	})
}, false);
