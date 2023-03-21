const backBtn = document.querySelector(".back");
const galleryCont = document.querySelector(".gallery-cont");

//it will take to the index.html page when we click on it.
backBtn.addEventListener("click", () => {
    location.assign("./index.html");
});

setTimeout(() => {
    if(db) {
        let imageDBTransaction = db.transaction("image", "readonly");
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
    
        imageRequest.onsuccess = function() {
            if (imageRequest.result !== undefined) {
                // console.log("Images", imageRequest.result);
                let imageResult = imageRequest.result;
    
                imageResult.forEach( (imageObj) => {
                    //create an image container.
                    // console.log(imageObj);
                    let url = imageObj.url;
                    let imageElement = document.createElement("div");
                    imageElement.setAttribute("class", "media-cont");
                    imageElement.setAttribute("id", imageObj.id);
                    //add image to that container.
                    imageElement.innerHTML = `
                        <div class="media">
                            <img src="${url}" alt="No image!">
                        </div>
                        <div class="action-btn delete">DELETE</div>
                        <div class="action-btn download">DOWNLOAD</div>
                    `;
                    //appendchild in gallery-cont.
                    galleryCont.appendChild(imageElement);

                    //delete the video.
                    let deleteBtn = imageElement.querySelector(".delete");
                    deleteBtn.addEventListener("click", deleteListner);

                    //download the video.
                    let downloadBtn = imageElement.querySelector(".download");
                    downloadBtn.addEventListener("click", downloadListner);
                    // another Way
                    // downloadBtn.addEventListener("click", () => {
                    //     downloadListner(imageObj);
                    // });
                });
            } else {
                console.log("No such image found!!");
            };
        };
    };

    let videoDBTransaction = db.transaction("video", "readonly");
    let videoStore = videoDBTransaction.objectStore("video");
    let videoRequest = videoStore.getAll();

    videoRequest.onsuccess = function() {
        if(videoRequest.result !== undefined) {
            let videoResult = videoRequest.result;

            videoResult.forEach( (videoObj) => {
                // create a video conatiner.
                let blob = videoObj.url;
                let url = URL.createObjectURL(blob);

                //we can also create url with a single line.
                // let url = URL.createObjectURL(videoObj.blobData);
                
                let videoElement = document.createElement("div");
                videoElement.setAttribute("class", "media-cont");
                videoElement.setAttribute("id", videoObj.id);
                // add video to that container.
                videoElement.innerHTML = `
                    <div class="media">
                    <video autoplay muted loop src="${url}" alt="No video!">  
                    </div>
                    <div class="action-btn delete">DELETE</div>
                    <div class="action-btn download">DOWNLOAD</div>
                `;
                //appendchild in gallery-cont.
                galleryCont.appendChild(videoElement);
                
                //delete the video.
                let deleteBtn = videoElement.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListner);

                //download the video.
                let downloadBtn = videoElement.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListner);
                // another way
                // downloadBtn.addEventListener("click", () => {
                //     downloadListner(videoObj);
                // });
            });
        };
    };
}, 100);

function deleteListner(event){
    
    // get id from event
    let id = event.target.parentElement.getAttribute("id");
    console.log(id);
    // find the id belong to which store image OR video
    let mediaType = id.split("-")[0];    //["img", generatedID]
    console.log(mediaType);
    // go onto that store and delete it.
    if(mediaType == "img") {
        // image
        let imageDBTransaction = db.transaction("image", "readwrite");
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id);
    } else {
        // video
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);        
    }

    // remove it from the frontend.
    event.target.parentElement.remove();
};

function downloadListner(event) {
        // get id from event
        let id = event.target.parentElement.getAttribute("id");
        console.log(id);
        // find the id belong to which store image OR video
        let mediaType = id.split("-")[0];    //["img", generatedID]
        console.log(mediaType);
        // go onto that store and delete it.
        if(mediaType == "img") {
            // image
            let imageDBTransaction = db.transaction("image", "readonly");
            let imageStore = imageDBTransaction.objectStore("image");
            let imageRequest = imageStore.get(id);
            
            imageRequest.onsuccess = () => {
                let imageResult = imageRequest.result;
                let url = imageResult.url;
                let a = document.createElement("a");
                // console.log(url);
                a.href = url;
                a.download = `${id}.png`;
                a.click();
                a.remove();
            };

        } else {
            // video
            let videoDBTransaction = db.transaction("video", "readonly");
            let videoStore = videoDBTransaction.objectStore("video");
            let videoRequest = videoStore.get(id);
            videoRequest.onsuccess = () => {
                let videoResult = videoRequest.result;
                let blob = videoResult.url;
                let url = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                // console.log(url);
                a.download = `myVideo${id}.mp4`;
                a.click();
                a.remove();
            };
        };
    
        // remove it from the frontend.
        event.target.parentElement.remove();
};

//One way
// function downloadListner(mediaObj) {

//     // get the id of that media.
//     let mediaId = mediaObj.id;
//     let mediaType = mediaId.split("-")[0];
//     console.log(mediaType);
//     // console.log(mediaObj.url);

//     // go onto that store and download it..
//     if(mediaType == "img") {
//         // image URL and download
//         let a = document.createElement("a");
//         a.href = mediaObj.url;
//         a.download = "myPicture.jpeg";
//         a.click();
//     } else {
//         // video URL and download
//         let a = document.createElement("a");
//         let blob = mediaObj.url;
//         let videoURL = URL.createObjectURL(blob);
//         a.href = videoURL;
//         a.download = "myVideo.mp4";
//         a.click();
//     }
// };