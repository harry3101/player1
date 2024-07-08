console.log('lets write javascript');

let currentSong = new Audio();
let song = [];
let currfolder = "";

function SecondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let lis = div.getElementsByTagName("a");
  song = [];

  for (let index = 0; index < lis.length; index++) {
    const element = lis[index];
    if (element.href.endsWith(".mp3")) {
      song.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document.querySelector(".songplaylist").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const songs of song) {
    songUL.innerHTML += `<li> 
                            <img src="music.svg" alt="">
                            <div class="info">
                            <div>${songs.replaceAll("%20", " ")}</div>
                                <div>xamm</div>
                            </div>
                           <div class="playnow">
                            <span>play now</span>
                            <img class="invert" src="play.svg" alt="">
                           </div>
                         </li>`;
  }

  Array.from(document.querySelector(".songplaylist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}


const playmusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

 
  async function displayalbums() {
    let a = await fetch(`/song/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
      }
 
  }
  async function main(){
    let a = await getSongs("song/cs");
    playmusic(song[0], true);
  
    displayalbums();
  
    play.addEventListener("click", () => {
      if (currentSong.paused) {
        currentSong.play();
        play.src = "pause.svg";
      } else {
        currentSong.pause();
        play.src = "play.svg";
      }
    });
    

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${SecondsToMinutesSeconds(currentSong.currentTime)}/${SecondsToMinutesSeconds(currentSong.duration)}`;
  });

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  });

  previous.addEventListener("click", () => {
    currentSong.pause();
    let index = song.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index > 0) {
      playmusic(song[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentSong.pause();
    let index = song.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index < song.length - 1) {
      playmusic(song[index + 1]);
    }
  });

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async items => {
      await getSongs(`song/${items.currentTarget.dataset.folder}`);
    });
  });
}



main();

