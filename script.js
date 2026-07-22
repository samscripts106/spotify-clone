console.log('Lets write Javascript')
let currentSong = new Audio();
let songs;

function formatTime(seconds) {
    // Handle invalid input
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // Calculate minutes and remaining seconds
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Add leading zeros if needed
    mins = String(mins).padStart(2, "0");
    secs = String(secs).padStart(2, "0");

    return `${mins}:${secs}`;
}

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
const playMusic = (track, pause=false) => {
    // Set the audio source (path to the selected song).
    // If track = "Believer.mp3"
    // currentSong.src becomes "/songs/Believer.mp3"
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play();
        play.src = "pause.svg" // Change the play button icon to the pause icon because the song is now playing.
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track) //Update the current playbar UI to display the current song
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
    songs = await getSongs()
    playMusic(songs[0], true)

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
    // HTMLCollection is converted into an Array so that we can use the forEach() method.
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

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%"
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent)/100;
    })

    //Add an event listener for hamburger 
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })

    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-130%";
    })

    //Add event listener to prev 
    previous.addEventListener("click", ()=>{
        console.log("Previous clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        console.log(songs, index)
        if((index-1)>=0){
            playMusic(songs[index-1])
        } else {
            playMusic(songs[songs.length-1])
        }
    })

     //Add event listener to next
    next.addEventListener("click", ()=>{
        console.log("Next clicked")
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        console.log(songs, index)
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }else {
            playMusic(songs[0])
        }
    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("Setting volume to", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value)/100
    })
}

main()
