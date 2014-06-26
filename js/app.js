document.addEventListener('DOMContentLoaded', function(e) {

    // Promise that checks if webAudio is available
    var checkAudioContext = new Promise(function(resolve, reject) {
        window.audioContext = (window.AudioContext || window.webkitAudioContext);

        if (window.audioContext) {
            resolve("web audio API is available");
        } else {
            reject(Error("web audio API is unavailable"));
        }
    });

    // Promise that checks if getUserMedia is available
    var checkGetUserMedia = new Promise(function(resolve, reject) {
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

        if (navigator.getUserMedia) {
            resolve("audio capture is available");
        } else {
            reject(Error("audio capture is unavailable"));
        }
    });

    // success function for getUserMedia call

    function onAudioCaptureSuccess(stream) {
        // create WebAudio nodes
        audioContext = new window.audioContext();
        source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.8;
        // connect nodes
        source.connect(analyser);
        // create time data byte buffer
        buffer = new Uint8Array(analyser.frequencyBinCount);
        // draw canvas
        window.requestAnimationFrame(draw);
    }

    // draw sound wave on canvas

    function draw() {
        analyser.getByteTimeDomainData(buffer);

        var currentTime = Date.now(),
        	step = 1000 / 20,
        	delta = currentTime - previousTime;

        if (delta > step) {
            drawContext.clearRect(0, 0, canvas.width, canvas.height);
            drawContext.strokeStyle = '#4C9ED9';
            drawContext.lineWidth = 3;
            drawContext.beginPath();
            drawContext.moveTo(0, midHeight);
            for (var i = 1; i < buffer.length; i++) {
                var attenuation = Math.cos(i * (Math.PI * 2) / buffer.length) * -0.5 + 0.5,
                    x = i * canvas.width / buffer.length,
                    y = ((buffer[i] * canvas.height / 255) - midHeight) * attenuation + midHeight;

                drawContext.lineTo(x, y);
            }
            drawContext.stroke();
            previousTime = currentTime;
        }

        window.requestAnimationFrame(draw);
    }

    Promise.all([checkAudioContext, checkGetUserMedia]).then(function(msgs) {
    	msgs.forEach(function(v,i,a) {
    		console.log(v);
    	});

        navigator.getUserMedia({
            audio: true
        }, onAudioCaptureSuccess, function(err) {
            console.log(err);
        });
    }).
    catch (function(err) {
        alert(err);
    })

    var canvas = document.querySelector('canvas'),
        drawContext = canvas.getContext('2d'),
        midHeight = Math.floor(canvas.height / 2),
        audioContext, source, analyser, buffer,
        previousTime = Date.now();

}, false);
