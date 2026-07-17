console.log('Lets write Javascript')
let currentSong = new Audio();

async function getSongs(){
    // Send a request to the server asking for the contents
    // of the /songs/ folder.
    // 'await' waits until the server responds.
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text(); //a is response object (extract its body as plain text HTML)
    let div = document.createElement("div") //temporary workspace or scratchpad
    div.innerHTML = response; //take this text and parse it as HTML
    let as = div.getElementsByTagName("a") //gets every anchor tag inside the div & returns a HTML collection
    let songs = []

    //visit every <a> tag one by one
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        //check whether the link points to a mp3
        if(element.href.endsWith(".mp3")){
            // element.href looks like:
            // http://127.0.0.1:3000/songs/GoldenBrown.mp3
            // Split it at "/songs/".
            // Result: ["http://127.0.0.1:3000", "GoldenBrown.mp3"]
            // [1] gives "GoldenBrown.mp3".
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs // returns an array ["GoldenBrown.mp3", "her.mp3"]
}

//function to play the selected song (track is the filename of the song)
const playMusic = (track) => {
    // Set the audio source (path to the selected song).
    // If track = "Believer.mp3"
    // currentSong.src becomes "/songs/Believer.mp3"
    currentSong.src = "/songs/" + track
    currentSong.play();
    play.src = "pause.svg" // Change the play button icon to the pause icon because the song is now playing.
    document.querySelector(".songinfo").innerHTML = track //Update the current playbar UI to display the current song
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00" //Displays time elapsed
}

// main()
// │
// ├── 1. Get all songs from the server
// │
// ├── 2. Create the playlist on the webpage
// │
// ├── 3. Make every song clickable
// │
// └── 4. Make the Play/Pause button work

async function main(){
    //get the list of all the songs from server
    let songs = await getSongs()

    //Show all the songs in the playlist
    // Find the <ul> inside the songList div.
    // We will insert every song as an <li> inside this <ul>.
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    //Loop through all songs in the song array
    for (const song of songs){
        // Add a new <li> to the playlist.
        // song.replaceAll("%20"," ") replaces URL-encoded spaces
        // with normal spaces so the song name looks nice.
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20"," ")} </div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
                        </li>`;
    }

    //Attach an event listener to each song
    // Get all the <li> elements (songs) from the playlist.
    // HTMLCollection is converted into an Array so that we can
    // use the forEach() method.
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            // Get the song name from the first <div> inside the ".info" section.
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            // Remove any extra spaces and play the selected song.
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    //Attach an event listener to play, next and previous
    play.addEventListener("click", ()=>{
        //If the current song is paused, resume playing it
        if(currentSong.paused){
            currentSong.play()
            //change the play icon to pause icon
            play.src = "pause.svg"
        }
        //If the current song is playing, pause it
        else{
            currentSong.pause()
            //change pause button to play
            play.src = "play.svg"
        }
    })
}

main()
