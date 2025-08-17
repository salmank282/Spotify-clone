# 🎵 Spotify Clone - Web Music Player

A **Spotify-inspired music player** built using **HTML, CSS, and JavaScript (Vanilla JS)**.  
This project lets you browse albums, view playlists, and play songs directly in the browser with a custom UI similar to Spotify.


**🌐 Demo**

Web view:
<img width="1903" height="861" alt="image" src="https://github.com/user-attachments/assets/8865ab15-efaf-4dc9-9445-9ed02741e7e2" />

Mobile view:

<img width="322" height="696" alt="image" src="https://github.com/user-attachments/assets/1d62533a-dcc0-4f8b-8fc2-01d05abc90c6" />    <img width="324" height="696" alt="image" src="https://github.com/user-attachments/assets/edbd69de-a951-4abe-8215-f41e23ff0d24" />




---

## 🚀 Features

- 🎧 **Music Playback**
  - Play, pause, next, and previous controls
  - Real-time duration and progress updates
  - Seek bar with draggable progress indicator
  - Spacebar → Play/Pause shortcut

- 📂 **Album & Playlist Handling**
  - Albums are loaded dynamically from the `songs/` folder
  - Each album has:
    - `cover.jpg` → album artwork
    - `info.json` → album title & description
    - `.mp3` files → songs
  - Clicking an album loads its tracks into the library
  - Clicking a song plays it immediately

- 🔊 **Volume Control**
  - Volume slider (0–100%)
  - Mute/unmute toggle

- 📱 **Responsive Design**
  - Collapsible sidebar with hamburger/close buttons on mobile
  - Flexible grid for album cards
  - Works on desktop, tablet, and mobile

- ⚡ **UI Elements**
  - Left Sidebar → Home, Search, Library
  - Right Section → Album Cards, Header (Sign Up / Log In), Playbar
  - Footer → Spotify-style legal links

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no frameworks)
- **Audio API:** JavaScript `Audio` object
- **Responsive UI:** Flexbox + Media Queries
- **Assets:** Local images & icons

---

## ⚙️ Setup & Run

1️⃣ **Clone or Download** this repository.  
```bash
git clone https://github.com/your-username/spotify-clone.git
cd spotify-clone

