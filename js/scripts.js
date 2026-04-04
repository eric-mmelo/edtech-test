// ===== SLIDER =====
let currentSlide = 0;
const totalSlides = 3;
const track = document.getElementById("sliderTrack");
const dots = document.querySelectorAll(".dot");

function goToSlide(n) {
  currentSlide = n;
  track.style.transform = `translateX(-${n * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle("active", i === n));
}

dots.forEach((d) =>
  d.addEventListener("click", () => goToSlide(+d.dataset.idx)),
);

setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 4000);

// ===== CARDS =====
function toggleCard(idx) {
  const card = document.getElementById(`card-${idx}`);
  card.classList.toggle("open");
}

// ===== AUDIO PLAYER =====
const audio = document.getElementById("audioPlayer");
const playIcon = document.getElementById("playIcon");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

function toggleAudio() {
  if (audio.paused) {
    audio.play();
    playIcon.className = "fa-solid fa-pause";
  } else {
    audio.pause();
    playIcon.className = "fa-solid fa-play";
  }
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

audio.addEventListener("timeupdate", () => {
  const pct = (audio.currentTime / (audio.duration || 1)) * 100;
  progressBar.style.width = pct + "%";
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  playIcon.className = "fa-solid fa-play";
});

function seekAudio(e) {
  const rect = document
    .getElementById("progressWrapper")
    .getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * (audio.duration || 0);
}

// ===== VOLUME =====
let lastVolume = 1;
function setVolume(val) {
  const v = val / 100;
  audio.volume = v;
  lastVolume = v > 0 ? v : lastVolume;

  updateVolumeIcon(v);
  updateVolumeSlider(val);
}

function toggleMute() {
  const slider = document.getElementById("volumeSlider");

  if (audio.volume > 0) {
    lastVolume = audio.volume;
    audio.volume = 0;
    slider.value = 0;

    updateVolumeSlider(0);
    updateVolumeIcon(0);

  } else {
    audio.volume = lastVolume;
    slider.value = lastVolume * 100;

    updateVolumeSlider(lastVolume * 100); 
    updateVolumeIcon(lastVolume);
  }
}

function updateVolumeIcon(v) {
  const icon = document.getElementById("volumeIcon");
  if (v === 0) icon.className = "fa-solid fa-volume-xmark";
  else if (v < 0.4) icon.className = "fa-solid fa-volume-low";
  else icon.className = "fa-solid fa-volume-high";
}

const volumeSlider = document.querySelector(".volume-slider");

volumeSlider.addEventListener("input", function () {
  const value = this.value;

  audio.volume = value / 100;
  updateVolumeSlider(value);
  updateVolumeIcon(audio.volume);
});

function updateVolumeSlider(value) {
  const slider = document.getElementById("volumeSlider");
  slider.style.background = `linear-gradient(to right, #76b900 ${value}%, #e0e0e0 ${value}%)`;
}
