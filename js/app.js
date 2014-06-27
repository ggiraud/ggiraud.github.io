document.addEventListener('DOMContentLoaded', function(e) {

    ////////////////////////////
    // VARIABLES DECLARATIONS //
    ////////////////////////////
    var canvas = document.querySelector('canvas'),
        drawContext = canvas.getContext('2d'),
        midHeight = Math.floor(canvas.height / 2),
        audioContext, source, analyser, timeDataBuffer, frequencyBuffer, decibels,
        sum, mean, attenuation, x, y,
        dbDiv = document.querySelector("#decibels");

    // set canvas width to fit page
    canvas.width = document.body.clientWidth;
    drawContext.translate(0.5, 0.5);

    ///////////////////////////////
    // WEBAUDIO CHECKING PROMISE //
    ///////////////////////////////
    var checkAudioContext = new Promise(function(resolve, reject) {
        window.audioContext = (window.AudioContext || window.webkitAudioContext);

        if (window.audioContext) {
            resolve("web audio API is available");
        } else {
            reject(Error("web audio API is unavailable"));
        }
    });

    ///////////////////////////////////
    // GETUSERMEDIA CHECKING PROMISE //
    ///////////////////////////////////
    var checkGetUserMedia = new Promise(function(resolve, reject) {
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

        if (navigator.getUserMedia) {
            resolve("audio capture is available");
        } else {
            reject(Error("audio capture is unavailable"));
        }
    });

    //////////////////////////////////
    // GETUSERMEDIA SUCCESS HANDLER //
    //////////////////////////////////

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
        timeDataBuffer = new Uint8Array(analyser.frequencyBinCount);
        // create frequency byte buffer
        frequencyBuffer = new Uint8Array(analyser.frequencyBinCount);
        // draw canvas
        window.requestAnimationFrame(draw);
    }

    /////////////////////////////
    // EVALUATE DECIBELS LEVEL //
    /////////////////////////////

    function getDB() {
        sum = 0;
        analyser.getByteFrequencyData(frequencyBuffer);
        for (var i = 0; i < analyser.frequencyBinCount; i++) {
            sum += frequencyBuffer[i];
        }
        mean = sum / analyser.frequencyBinCount;
        decibels = Math.round((mean / 255) * (analyser.maxDecibels - analyser.minDecibels) + analyser.minDecibels);
        dbDiv.textContent = decibels + "dB";
    }

    ///////////////////////////////
    // DRAW SOUND WAVE ON CANVAS //
    ///////////////////////////////

    function draw() {
        analyser.getByteTimeDomainData(timeDataBuffer);

        drawContext.clearRect(0, 0, canvas.width, canvas.height);
        drawContext.strokeStyle = '#4C9ED9';
        drawContext.lineWidth = 3;
        drawContext.beginPath();
        drawContext.moveTo(0, midHeight);
        for (var i = 1; i < timeDataBuffer.length; i++) {
            attenuation = Math.cos(i * (Math.PI * 2) / timeDataBuffer.length) * -0.5 + 0.5;
            x = i * canvas.width / timeDataBuffer.length;
            y = ((timeDataBuffer[i] * canvas.height / 255) - midHeight) * attenuation + midHeight;

            drawContext.lineTo(x, y);
        }
        drawContext.stroke();

        getDB();

        window.requestAnimationFrame(draw);
    }

    ///////////////////////////
    // AUDIO CAPTURE PROMISE //
    ///////////////////////////
    Promise.all([checkAudioContext, checkGetUserMedia]).then(function(msgs) {
        // output log messages
        msgs.forEach(function(v, i, a) {
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
    });

}, false);
