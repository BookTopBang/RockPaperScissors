let context, 
    canvas, 
    ANCHOR_POINTS,
    fingerLookupIndices = {
        thumb: [0, 1, 2, 3, 4],
        indexFinger: [0, 5, 6, 7, 8],
        middleFinger: [0, 9, 10, 11, 12],
        ringFinger: [0, 13, 14, 15, 16],
        pinky: [0, 17, 18, 19, 20]
    };


async function main() {
    const backend = 'webgl'
    await tf.setBackend(backend);
    
    let video;
    try {
        video = await loadVideo();
    } catch (e) {
        throw e;
    }

    let videoWidth = video.videoWidth;
    let videoHeight = video.videoHeight;

    canvas = document.getElementById('my_canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    video.width = videoWidth;
    video.height = videoHeight;

    context = canvas.getContext('2d');
    context.clearRect(0, 0, videoWidth, videoHeight);
    context.strokeStyle = 'pink';
    context.fillStyle = 'black';

    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    ANCHOR_POINTS = [
        [          0,           0, 0], 
        [          0, -videoWidth, 0], 
        [-videoWidth,           0, 0],
        [-videoWidth, -videoWidth, 0]
    ];

    landmarksRealTime(video);
}

async function loadVideo() {
    const video = await setupCamera();
    video.play();
    return video;
}

async function setupCamera() {
    const video = document.getElementById('my_video');
    const mediaStreamConstraints = { video: true };

    navigator.mediaDevices
        .getUserMedia(mediaStreamConstraints)
        .then(gotLocalMediaStream)
        .catch(handleLocalMediaStreamError)

    function gotLocalMediaStream(mediaStream) {
        video.srcObject = mediaStream;
    }

    function handleLocalMediaStreamError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }
    
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {resolve(video);};
    });
}

const landmarksRealTime = async (video) => {
    const model = await handpose.load();
    async function frameLandmarks() {
        context.drawImage(
            video,
            0, 0,  video.width,  video.height, 
            0, 0, canvas.width, canvas.height);

        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            const keypoints = predictions[0].landmarks;

            for(let i = 0; i < keypoints.length; i++){
                const [x, y, z] = keypoints[i];
                drawPoint(x, y, 3);
            }

            const fingers = Object.keys(fingerLookupIndices);
            for (let i = 0; i < fingers.length; i++) {
                const finger = fingers[i];
                const points = fingerLookupIndices[finger].map(idx => keypoints[idx]);
                drawPath(points, false);
            }
        }
        requestAnimationFrame(frameLandmarks);
    };
    frameLandmarks();
};

function drawPoint(x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.fill();
}

function drawPath(points, closePath) {
    const region = new Path2D();
    region.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        region.lineTo(point[0], point[1]);
    }

    if (closePath) {
        region.closePath();
    }
    context.stroke(region);
}

main();
