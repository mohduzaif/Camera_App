const openRequest = indexedDB.open("myDatabase");

let db;
openRequest.addEventListener("success", () => {
    console.log("Connected with database successfully");
    db = openRequest.result;
    // continue working with database using db object
});

openRequest.addEventListener( "upgradeneeded", () => {
    // triggers if the client had no database
    // ...perform initialization...
    console.log("Version outdated OR Initialisation of version");
    db = openRequest.result;
    db.createObjectStore("video", {keyPath: "id"});
    db.createObjectStore("image", {keyPath : "id"});
});
  
openRequest.addEventListener("error", () => {
    console.log("Opening failed to database");
    console.error("Error", openRequest.error);
});

// schema-> blue print -> how does my db look like , what all i can store in my db