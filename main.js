import playlistData from "./constants.js";

const audio = document.querySelector("audio");
const img = document.querySelector("img");
const title = document.querySelector(".m-player__title");
const artist = document.querySelector(".m-player__artist");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const progressBar = document.querySelector(".m-player__progress-bar");
const progress = document.querySelector(".m-player__progress");
const startTime = document.querySelector(".m-player__start-time");
const totalTime = document.querySelector(".m-player__total-time");

/*==================== SET INITIAL ====================*/

let counter = 0;
let totalSongs = playlistData.length;
let play = false;
let interval;

/*==================== UPDATE TIMES ====================*/

const updateTotalTime = () => {
  if (!audio.duration) {
    totalTime.textContent = "N/A";
    return;
  }

  const minutes = Math.floor(audio.duration / 60);
  const seconds = Math.floor(audio.duration % 60);
  totalTime.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const updateTime = () => {
  if (!play) {
    return;
  }

  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime % 60);

  startTime.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  requestAnimationFrame(updateTime);
};

/*================= SET DATA FROM PLAYLIST ARRAY =================*/

const setDetails = (count) => {
  audio.src = playlistData[count].url;
  img.src = playlistData[count].artwork;
  title.textContent = playlistData[count].title;
  artist.textContent = `${playlistData[count].artist} . ${playlistData[count].album}`;

  updateTotalTime();
};
setDetails(counter);

/*==================== UPDATE PROGRESS BAR ====================*/

progressBar.addEventListener("click", function (e) {
  if (!play) {
    return;
  }

  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

/*==================== BUTTONS ====================*/

const playPause = () => {
  if (play) {
    audio.pause();

    clearInterval(interval);
    play = false;

    playBtn.querySelector("i.fas").classList.add("fa-play");
    playBtn.querySelector("i.fas").classList.remove("fa-pause");
  } else {
    audio.play();

    interval = setInterval(updateTime, 1000);
    play = true;

    playBtn.querySelector("i.fas").classList.remove("fa-play");
    playBtn.querySelector("i.fas").classList.add("fa-pause");
  }
};

const nextSong = () => {
  if (counter === totalSongs - 1) {
    counter = 0;
  } else {
    counter += 1;
  }

  setDetails(counter);
  play = false;
  playPause();
};

const prevSong = () => {
  if (counter === 0) {
    counter = totalSongs - 1;
  } else {
    counter -= 1;
  }

  setDetails(counter);
  play = false;
  playPause();
};

/*==================== EVENT LISTENERS ====================*/

audio.addEventListener("loadedmetadata", updateTotalTime);
audio.addEventListener("ended", nextSong);
audio.volume = 0.2;

playBtn.addEventListener("click", (e) => {
  playPause();
});

prevBtn.addEventListener("click", (e) => prevSong());
nextBtn.addEventListener("click", (e) => nextSong());
