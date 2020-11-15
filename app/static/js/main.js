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


async function estimate() {
    // Load the MediaPipe handpose model assets.
    const model = await handpose.load();

    // Pass in a video stream to the model to obtain 
    // a prediction from the MediaPipe graph.
    const video = localVideo;
    const predictions = await model.estimateHands(video);

    // Each hand object contains a `landmarks` property,
    // which is an array of 21 3-D landmarks.
    // predictions.forEach(hand => console.log(hand.landmarks));

    if (predictions.length > 0) {
        for (let i = 0; i < predictions.length; i++) {
            const keypoints = predictions[i].landmarks;
            
            // Log hand keypoints.
            for (let i = 0; i < keypoints.length; i++) {
                const [x, y, z] = keypoints[i];
                console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
            }
        }
    }

}

const sleep = (ms) => {
    console.log(`time`)
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


async function main(){
    for(let i = 0; i < 5; i++){
        estimate()
        await sleep(5000);
    }
}

main()
