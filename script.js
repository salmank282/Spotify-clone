async function getSongs() {
  let a = await fetch("http://127.0.0.1:3002/songs");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href);
    }
  }
  return songs;
}

async function main() {
  //get the list of all songs
  let songs = await getSongs();
  console.log(songs);
  let songList = document.querySelector(".song-list");
  for (const song of songs) {
    let songName = song.split("/songs/")[1].split(".mp3");
    songList.innerHTML += `<div class="song-item">
              <img src="./img/music.svg" alt="music" />
              <div class="song-det"><p>${songName}</p><p>Artist</p></div>
            </div>`;
  }
  // Create a button for user interaction
  let playButton = document.getElementById("play");

  // Add event listener to play audio on button click
  playButton.addEventListener("click", () => {
    var audio = new Audio(songs[0]);
    audio.play();
    audio.addEventListener("loadeddata", () => {
      let duration = audio.duration;
      console.log(duration);
    });
  });
}

main();
