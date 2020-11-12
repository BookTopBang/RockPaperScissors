'use strict';

// On this codelab, you will be streaming only video (video: true).
const mediaStreamConstraints = { video: true, };
// Video element where stream will be placed.
const localVideo = document.querySelector('video');
// Local stream that will be reproduced on the video.
let localStream;
// Handles success by adding the MediaStream to the video element.
function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;
}
// Handles error by logging a message to the console with the error message.
function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
}
// Initializes media stream.
navigator.mediaDevices
    .getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream)
    .catch(handleLocalMediaStreamError);

const handpose = require('@tensorflow-models/handpose');
require('@tensorflow/tfjs-backend-webgl');

async function main(){
    const model = await handpose.load();
    const video = document.querySelector("video_id");
    const hands = await model.estimateHands(video);
    
    hands.forEach(hand => console.log(hand.landmarks));
}

main()