var uid = new ShortUniqueId();
const captureBtnCont = document.querySelector(".capture-btn-cont");
const captureBtn = document.querySelector(".capture-btn");
const recordBtnCont = document.querySelector(".record-btn-cont");
const recordBtn = document.querySelector(".record-btn");
const timerCont = document.querySelector(".timer-cont");
const timer = document.querySelector(".timer");
const video = document.querySelector("video");
const galleryCont = document.querySelector(".gallery");

let filterColor = "transparent";

//media devices t hat you want to use in your application.
let constraints = {
    video : true,
    audio : true
};

//object of mediaRecord which is used to record the stream of data.
let mediaRecorder = null;
//it stored the bolb object that comes from the dataavailable event
let chunks = [];

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);

    //this event is fired when the start method is called or recording is started.
    mediaRecorder.addEventListener("start", (event) => {
        console.log("Starting the recording!!");
    });

    //this event fire when data/or bits of stream comes from the input device camera or media devive
    mediaRecorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
    });

    //this event is fired when the stop method is called or recording is stopped.
    mediaRecorder.addEventListener("stop", (event) => {
        console.log("Recording is stopped!!");
        
        //it will return the stitch data after transform chunks data that are in blob oject form
        const blob = new Blob(chunks, {type: "video/mp4"});

        let videoURL = URL.createObjectURL(blob);

        //how to download a video in javaScript.
        // let a = document.createElement("a");
        // a.href = videoURL;
        // a.download = "myVideo.mp4";
        // a.click();

        if(db) {
            //we need to create a transaction to operate on the data.
            let dbTransaction = db.transaction("video", "readwrite");
            // get an videoStore object store to operate on it.
            let videoStore = dbTransaction.objectStore("video");
    
            let videodID = uid();
    
            let videoEntry = {
            id : videodID,
            url : blob,
            };
    
            let addRequest = videoStore.add(videoEntry);
            
            //it is same as a addEventListner by addRequest on success event.
            addRequest.onsuccess = function() {
                console.log("VideoEntry added to the videoStore", addRequest.result);
            };
        };
    });
});

let isRecording = false;
recordBtnCont.addEventListener("click", function() {

    if(!isRecording) {
        
        mediaRecorder.start();
        startTimer();
        //we have to record
        recordBtn.classList.add("scale-record");

        //we can use flex or block to display the timer.
        // timer.style.display = "flex";
        timer.style.display = "block";
    } else {

        mediaRecorder.stop();
        stopTimer();
        //stop the recording
        recordBtn.classList.remove("scale-record");
        timer.style.display = "none";
    }
    isRecording = !isRecording;
});

captureBtnCont.addEventListener("click", function() {
    
    //canvas is used to take a screen shot from the video.
    let canvas = document.createElement("canvas");
    //this will tell us we draw a 2D image.
    let context = canvas.getContext("2d");

    // set the height and width of the canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    //this will draw the image with given co-ordinates.
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    context.fillStyle = filterColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL("image/jpeg");

    //to download the image.
    // let a = document.createElement("a");
    // a.href = image;
    // a.download = "myPicture.jpeg";
    // a.click();
    
    //add an images in indexedDB database. 
    if(db) {
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        
        let imageID = uid();
        
        let imageEntry = {
            id : `img-${imageID}`,
            url : imageURL,
        };

        let addRequest = imageStore.add(imageEntry); 

        //it is same as a addEventListner by addRequest on success event.
        addRequest.onsuccess = function() {
            console.log("imageEntry added to the imageStore", addRequest.result);
        };

    };

    captureBtn.classList.add("scale-capture");

    //we remove this class after 1 second.
    setTimeout( () => {
        captureBtn.classList.remove("scale-capture");
    }, 1000);
}); 

//this function control the timer of recording using setInterval.
let timeOutId = null;
let counter = 0;
function startTimer() {
    timer.style.display = "block";
    function displayTimer() {
    
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;
    }
    //it always return the an ID when it by using that id we can stop this function.
    timeOutId = setInterval(displayTimer, 1000);
};

//this function is used to stop the setInterval.
function stopTimer() {
    clearInterval(timeOutId);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
};

const allFilters = document.querySelectorAll(".filter");
const filterLayer = document.querySelector(".filter-layer");
allFilters.forEach((filterElement) => {
    filterElement.addEventListener("click", () => {
        filterColor = window.getComputedStyle(filterElement).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = filterColor;
    });
});

//it will take to the gallery page when we click on it.
galleryCont.addEventListener("click", () => {
    location.assign("./gallery.html");
});
