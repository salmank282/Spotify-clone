let currentSong = new Audio();
let play = document.getElementById("play");
let previous = document.getElementById("previous");
let next = document.getElementById("next");
let songs = [];
let currentSongName = "";

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3002/songs");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songsArray = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith("mp3")) {
      songsArray.push(element.href);
    }
  }
  return songsArray;
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

function playMusic(songName, track) {
  let div = document.querySelector(".playbar .song-title");
  if (!div) {
    let div = document.createElement("div");
    // div.innerHTML = `<div class="song-title">${songName}</div>`;
    div.className = "song-title";
    div.textContent = songName;
    document.querySelector(".playbar").prepend(div);
  } else {
    div.textContent = songName;
  }

  currentSong.src = track;
  currentSong.play();
  play.src = "/img/pause.svg";
  currentSongName = songName;
}

async function main() {
  songs = await getSongs(); //get the list of all songs
  let songList = document.querySelector(".song-list");
  for (const song of songs) {
    let songName = song.split("/songs/")[1].replace(".mp3", "");
    songList.innerHTML += `
    <div class="song-item">
        <img src="./img/music.svg" alt="music" />
        <div class="song-det">
            <p>${songName}</p>
            <p>Artist</p>
        </div>
    </div>`;
  }

  document.querySelector(".song-list").addEventListener("click", (e) => {
    if (e.target.closest(".song-item")) {
      let songItem = e.target.closest(".song-item");
      let songName = songItem.querySelector(".song-det p").innerText;
      console.log(`Playing song: ${songName}`);
      let songIndex = songs.findIndex((song) => song.includes(songName));
      if (songIndex !== -1) {
        playMusic(songName, songs[songIndex]);
      } else {
        console.log("Song not found in the list.");
      }
    }
  });

  play.addEventListener("click", () => {
    if (!currentSong.src || currentSong.src === window.location.href) {
      let firstSongName = songs[0].split("/songs/")[1].replace(".mp3", "");
      playMusic(firstSongName, songs[0]);
    } else if (currentSong.paused) {
      currentSong.play();
      play.src = "/img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/img/play.svg";
    }
  });

  previous.addEventListener("click", () => {
    let songIndex = songs.findIndex((song) => song.includes(currentSongName));
    if (songIndex > 0) {
      let prevSongName = songs[songIndex - 1]
        .split("/songs/")[1]
        .replace(".mp3", "");
      playMusic(prevSongName, songs[songIndex - 1]);
    }
  });

  next.addEventListener("click", () => {
    let songIndex = songs.findIndex((song) => song.includes(currentSongName));
    if (songIndex>=0 && songIndex < songs.length-1) {
      let nextSongName = songs[songIndex + 1]
        .split("/songs/")[1]
        .replace("mp.3", "");
      playMusic(nextSongName, songs[songIndex + 1]);
    }
  });

  currentSong.addEventListener("timeupdate",()=>{
    document.getElementById("time-progress").textContent=formatTime(currentSong.currentTime);
    document.getElementById("duration").textContent=formatTime(currentSong.duration);
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration *100) + "%"
  })
}

main();
