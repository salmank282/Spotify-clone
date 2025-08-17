let currentSong = new Audio();
let play = document.getElementById("play");
let previous = document.getElementById("previous");
let next = document.getElementById("next");
let songs = [];
let currFolder = "";
let currentSongName = "";

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3002/songs/${folder}`);
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

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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

  if (!document.querySelector(".volume")) {
    let volume = document.createElement("div");
    volume.className = "volume flex justify-center";
    volume.innerHTML = `
      <img src="./img/volume.svg" alt="volume">
      <input type="range" class="slider" value="100" name="volume" >`;

    if (currentSong.src && currentSong.src !== window.location.href) {
      document.querySelector(".playbar").appendChild(volume);
    }
    
    let mute = false;
    let lastVolume = 1;
    const slider = volume.querySelector(".slider");
    slider.addEventListener("input", (e) => {
      const val = e.target.value;
      currentSong.volume = val / 100;
      lastVolume=currentSong.volume;
      if (val == 0) {
        volume.querySelector("img").src = "./img/mute.svg";
        mute = true;
      } else {
        volume.querySelector("img").src = "./img/volume.svg";
        mute = false;
      }
    });

    volume.querySelector("img").addEventListener("click", (e) => {
      mute = !mute;
      if (mute) {
        e.target.src = "./img/mute.svg";
        lastVolume=currentSong.volume;
        currentSong.volume = 0;
        slider.value = 0;
      } else {
        e.target.src = "./img/volume.svg";
        currentSong.volume = lastVolume;
        slider.value = lastVolume*100;
      }
    });
  }
}

async function displayAlbum() {
  let album = await fetch(`http://127.0.0.1:3002/songs`);
  let response = await album.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".card-container");
  let anchorArr = Array.from(anchors);
  for (let index = 0; index < anchorArr.length; index++) {
    const e = anchorArr[index];
    if (e.href.includes("/songs")) {
      let folderName = e.href.split("/")[4];
      let info = await fetch(
        `http://127.0.0.1:3002/songs/${folderName}/info.json`
      );
      let response = await info.json();
      cardContainer.innerHTML += `
            <div data-folder="${folderName}" class="card">
              <div class="play">
                <img class="cursor-pointer" src="./img/play.svg" alt="play" />
              </div>
              <img
                class="playlist-cover cursor-pointer"
                src="./songs/${folderName}/cover.jpg"
                alt=""
              />
              <p class="song-title">${response.title}</p>
              <p class="song-desc">
                ${response.description}
              </p>
            </div>
            `;
    }
  }
}

async function main() {
  await displayAlbum();
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      let folder = item.currentTarget.dataset.folder;
      songs = await getSongs(folder); //get the list of all songs
      let songList = document.querySelector(".song-list");
      songList.innerHTML = "";
      for (const song of songs) {
        let songName = song.split(`/songs/${folder}/`)[1].replace(".mp3", "");
        songList.innerHTML += `
        <div class="song-item">
            <img src="./img/music.svg" alt="music" />
            <div class="song-det">
                <p>${songName}</p>
                <p>Artist</p>
            </div>
        </div>`;
      }
      firstSongAlbum = songs[0]
        .split(`/songs/${folder}/`)[1]
        .replace(".mp3", "");
      playMusic(firstSongAlbum, songs[0]);
    });
  });

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
      let firstSongName = songs[0]
        .split(`/songs/${currFolder}/`)[1]
        .replace(".mp3", "");
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
        .split(`/songs/${currFolder}/`)[1]
        .replace(".mp3", "");
      playMusic(prevSongName, songs[songIndex - 1]);
    }
  });

  next.addEventListener("click", () => {
    let songIndex = songs.findIndex((song) => song.includes(currentSongName));
    if (songIndex >= 0 && songIndex < songs.length - 1) {
      let nextSongName = songs[songIndex + 1]
        .split(`/songs/${currFolder}/`)[1]
        .replace("mp.3", "");
      playMusic(nextSongName, songs[songIndex + 1]);
    }
  });

  //Event listner for music time
  currentSong.addEventListener("timeupdate", () => {
    document.getElementById("time-progress").textContent = formatTime(
      currentSong.currentTime
    );
    document.getElementById("duration").textContent = formatTime(
      currentSong.duration
    );
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
    document.querySelector(".progress").style.width =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Event listner for Seek bar
  document.querySelector(".seek-bar").addEventListener("click", (e) => {
    const seekBar = e.currentTarget;
    const rect = seekBar.getBoundingClientRect();
    let percent = (e.offsetX / rect.width) * 100;
    if (currentSong.src) {
      document.querySelector(".circle").style.left = percent + "%";
      document.querySelector(".progress").style.width = percent + "%";
      currentSong.currentTime = (currentSong.duration * percent) / 100;
    }
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left-container").style.left = "0%";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left-container").style.left = "-100%";
  });
}

main();
