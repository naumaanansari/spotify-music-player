console.log("Script Added");
document.title = "Spotify – Web Player";

let currentSong = new Audio(); // Defines current song running in the background
let songs;
let currFolder;
//Seconds to minutes: seconds format
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Function to get songs from songs folder
async function getSongs(folder) {
  currFolder = folder;
  // Getting song by fetching songs folder
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  // console.log(response);

  //Create a div that contains all songs
  let div = document.createElement("div");
  div.innerHTML = response;
  // console.log(div);

  //Targeting songs link through getElementByTagName
  let As = div.getElementsByTagName("a");
  songs = [];

  //Running For loop to add songs in songs[] array
  for (let index = 0; index < As.length; index++) {
    const element = As[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]); // When We split a link it'll will be divided into two portion before and after we're using [1] to get after portion only
    }
  }



  //To show all the songs in the playlist
  let songUL = document
    .querySelector(".songlists")
    .getElementsByTagName("ul")[0];

  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `
        <li>
                  <img src="/Assets/SVG/music.svg" alt="Mp3">
                  <div class="info">
                    <div class="songName">${song.replaceAll("%20", " ")}</div> 
                    <div class="artist">Nauman's Playlist</div>
                  </div>
                  <div class="playNow">
                    <span>Play Now</span>
                    <img src="/Assets/SVG/play.svg" alt="">
                  </div>
              </li>`; //Replacing all the %20 sign with the _ space
  }

  // Attach an eventlistener to each song
  Array.from(
    document.querySelector(".songlists").getElementsByTagName("li")
  ).forEach((e) => {
    //add an event listener "Click" to target song
    e.addEventListener("click", (element) => {

      //running a function that play song on click
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

//playMusic function to play music onClick event
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/Assets/SVG/pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  // console.log(a);
  
  //Create a div that contains all songs
  let div = document.createElement("div");
  div.innerHTML = response;
  

  let anchors = div.getElementsByTagName("a");

  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    // console.log(e.href);
    
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      console.log(folder);
      
      //get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      // console.log(response);
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
      <div class="play">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 168 168"
          width="34"
          height="34"
        >
          <circle cx="84" cy="84" r="84" fill="#1FDF64" />
          <path d="M64.5 40.5v87l57-43.5z" fill="#000" />
        </svg>
      </div>
      <img
        src="/songs/${folder}/cover.jpeg"
        alt=""
      />
      <h2>${response.title}</h2>
      <p>${response.description}</p>
    </div>`;
    }
  } ;

  //load the playlist whenever Card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });

  
}

async function main() {
  //Get the list of all songs
  await getSongs("songs/ncs");
  playMusic(songs[0], true);

  // Display All The Albums
  displayAlbums();
  // Attach an eventlistener to play, next & previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/Assets/SVG/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/Assets/SVG/play.svg";
    }
  });

  // listen For Time Update Event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left = `
    ${(currentSong.currentTime / currentSong.duration) * 100}%`;
  });

  // Add an EventListener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let seekPercent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.querySelector(".circle").style.left = `${seekPercent}%`;
    currentSong.currentTime = (currentSong.duration * seekPercent) / 100;
  });
}
// Add an eventlistener for hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});

// Add an eventlistener for close
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";
});

// Add an eventlistener for previous
previous.addEventListener("click", () => {
  console.log("Previous Clicked");

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

  if (index - 1 >= length) {
    playMusic(songs[index - 1]);
  }
});

// Add an eventlistener for Next
next.addEventListener("click", () => {
  console.log("Next Clicked");

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

  if (index + 1 < songs.length) {
    playMusic(songs[index + 1]);
  } else {
    playMusic(songs[0]);
  }
});

//Add an eventlistener for volume
volRange.addEventListener("change", (e) => {
  console.log("Setting Volume to:", e.target.value);
  currentSong.volume = parseInt(e.target.value) / 100;
});



//Add an eventlistener to mute the volume
let volIcon = document.querySelector(".volume>img").addEventListener("click", e=>{
  
  if (e.target.src.includes("volume.svg")) {
    e.target.src = e.target.src.replace("volume.svg", "mute.svg")
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value =0;
  }
  else{
    e.target.src = e.target.src.replace( "mute.svg", "volume.svg",)
    currentSong.volume = 0.50;
    document.querySelector(".range").getElementsByTagName("input")[0].value =50;
  }
  
})


main();

