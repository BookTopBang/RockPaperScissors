let fingerLookupIndices = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20]
};
const MODE = document.getElementById('mode').innerText

async function main() {
    // Run Tensorflow-WebGL
    const backend = 'webgl'
    await tf.setBackend(backend);
    
    // Setting up camera
    let video = await setupCameraById('my_video');

    // Setting up canvas 
    canvas = document.getElementById('my_canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Get context and set preference drawing style 
    context = canvas.getContext('2d');
    context.strokeStyle = 'pink';
    context.fillStyle = 'black';
    
    // Clear rectangle range (x, y, w, h)
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Reverse horizontal
    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    // Run Finger Estimation 
    landmarksRealTime(video, canvas);
}

const landmarksRealTime = async (video, canvas) => {
    // load handpose estimation model from tensorflow-models/handpose
    const model = await handpose.load();
    context = canvas.getContext('2d');

    let fingerTag = Array();
    if (MODE == 'Debug'){
        fingerTag[0] = document.getElementById('thumb')
        fingerTag[1] = document.getElementById('index')
        fingerTag[2] = document.getElementById('middle')
        fingerTag[3] = document.getElementById('ring')
        fingerTag[4] = document.getElementById('pinky')
    }
    
    const handpoints_index = [
        'WRIST',
        'THUMB_CMC', 'THUMB_MCP', 'THUMB_IP', 'THUMB_TIP',
        'INDEX_MCP', 'INDEX_PIP', 'INDEX_DIP', 'INDEX_TIP',
        'MIDDLE_MCP', 'MIDDLE_PIP', 'MIDDLE_DIP', 'MIDDEL_TIP',
        'RING_MCP', 'RING_PIP', 'RING_DIP', 'RIND_TIP',
        'PINKY_MCP', 'PINKY_PIP', 'PINKY_DIP', 'PINKY_TIP'
    ]
    let handpoints = [
        handpoints_index,
    ]
    
    let csvContent = "data:text/csv;charset=utf-8,";
    frameLandmarks();
    async function frameLandmarks() {
        // Draw a current image frame
        context.drawImage(
            video,
            0, 0, canvas.width, canvas.height);


        // Predict hand's position 
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
            const keypoints = predictions[0].landmarks;

            // Draw a core point
            for (let i = 0; i < keypoints.length; i++) {
                const [x, y, z] = keypoints[i];
                drawPoint(x, y, 5);
            }
            var handpoint = keypoints.join(", ");
            handpoints.push(`\r\n${handpoint}`);

            console.log(handpoints.length)
            if (handpoints.length % 1000 == 0){
                csvContent += handpoints
                var encodedUri = encodeURI(csvContent);

                window.open(encodedUri);
                handpoints = [
                    handpoints_index,
                ]
            }

            // temp code for estimate hand shape
            var thumb = getDistance(keypoints[0], keypoints[4])
            var index = getDistance(keypoints[0], keypoints[8])
            var middle = getDistance(keypoints[0], keypoints[12])
            var ring = getDistance(keypoints[0], keypoints[16])
            var pinky = getDistance(keypoints[0], keypoints[20])
            var pivot = getDistance(keypoints[0], keypoints[9])

            var thumbFold = (thumb/pivot) < 1.2 
            var indexFold = (index/pivot) < 1.3 
            var middleFold = (middle/pivot) < 1.3
            var ringFold = (ring/pivot) < 1.3
            var pinkyFold = (pinky/pivot) < 1.3 

            if (MODE == 'Debug'){
                fingerTag[0].textContent = `엄지 : ${thumbFold} / ${thumb}`
                fingerTag[1].textContent = `검지 : ${indexFold} / ${index}` 
                fingerTag[2].textContent = `중지 : ${middleFold} / ${middle}` 
                fingerTag[3].textContent = `약지 : ${ringFold} / ${ring}` 
                fingerTag[4].textContent = `소지 : ${pinkyFold} / ${pinky}`
            }

            // Handshape to string
            if(thumbFold && indexFold && middleFold && ringFold && pinkyFold){
                handshape.textContent = '주먹'
            }else if(
                ((!thumbFold && !indexFold &&  middleFold) ||
                 ( thumbFold && !indexFold && !middleFold)) && ringFold && pinkyFold){
                handshape.textContent = '가위'
            }else if(!thumbFold && !indexFold && !middleFold && !ringFold && !pinkyFold){
                handshape.textContent = '보'
            }else{
                handshape.textContent = '??'
            }

            // Draw a path between points
            const fingers = Object.keys(fingerLookupIndices);
            for (let i = 0; i < fingers.length; i++) {
                const finger = fingers[i];
                const points = fingerLookupIndices[finger].map(idx => keypoints[idx]);
                drawPath(points, false);
            }
        }
        // Recall
        requestAnimationFrame(frameLandmarks);
    };
    
    function drawPoint(x, y, radius) {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
    }
    
    function drawPath(points) {
        const region = new Path2D();
        region.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            region.lineTo(point[0], point[1]);
        }
        context.stroke(region);
    }
};

async function setupCameraById(videoTag) {
    // Set Video by loading camera 
    const video = document.getElementById(videoTag);
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
        video.onloadedmetadata = () => { resolve(video); };
    });
}

main();


function getDistance(pointA, pointB){
    const [ax, ay, az] = pointA
    const [bx, by, bz] = pointB
    let powered = Math.pow(ax - bx, 2) + Math.pow(ay - by, 2) + Math.pow(az - bz, 2);
    let distance = Math.sqrt(powered)

    return distance
}