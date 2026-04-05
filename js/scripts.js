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

// ===== VIDEO =====
document.querySelectorAll('.yt-facade').forEach(facade => {
  facade.addEventListener('click', () => {
    const id = facade.dataset.id;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'width:100%;height:100%;border:none;';
    facade.innerHTML = '';
    facade.appendChild(iframe);
  });
});

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

// ===== DISCURSIVE ACTIVITY =====
function respondDiscursive() {
  const txt = document.getElementById("discursiveText").value.trim();
  if (!txt) return;
  document.getElementById("discursiveText").disabled = true;
  document.getElementById("discursiveRespond").disabled = true;
  document.getElementById("discursiveAlter").style.display = "inline-flex";
  document.getElementById("discursiveFeedback").style.display = "block";
  sessionStorage.setItem("disc_answer", txt);
  sessionStorage.setItem("disc_submitted", "1");
}
function alterDiscursive() {
  document.getElementById("discursiveText").disabled = false;
  document.getElementById("discursiveRespond").disabled = false;
  document.getElementById("discursiveAlter").style.display = "none";
  document.getElementById("discursiveFeedback").style.display = "none";
  sessionStorage.removeItem("disc_submitted");
}

// ===== OBJECTIVE ACTIVITY =====
let selectedChoice = null;
function selectChoice(el, idx) {
  if (document.getElementById("objectiveRespond").disabled) return;
  document
    .querySelectorAll(".choices li")
    .forEach((li) => li.classList.remove("selected"));
  el.classList.add("selected");
  selectedChoice = idx;
  sessionStorage.setItem("obj_choice", idx);
}
function respondObjective() {
  if (selectedChoice === null) return;
  document
    .querySelectorAll(".choices li")
    .forEach((li) => (li.style.pointerEvents = "none"));
  document.getElementById("objectiveRespond").disabled = true;
  document.getElementById("objectiveAlter").style.display = "inline-flex";
  document.getElementById("objectiveFeedback").style.display = "block";
  sessionStorage.setItem("obj_submitted", "1");
}
function alterObjective() {
  document
    .querySelectorAll(".choices li")
    .forEach((li) => (li.style.pointerEvents = ""));
  document.getElementById("objectiveRespond").disabled = false;
  document.getElementById("objectiveAlter").style.display = "none";
  document.getElementById("objectiveFeedback").style.display = "none";
  sessionStorage.removeItem("obj_submitted");
}

// ===== FAQ =====
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isActive = item.classList.contains("active");
  document
    .querySelectorAll(".faq-item")
    .forEach((i) => i.classList.remove("active"));
  if (!isActive) item.classList.add("active");
}

// ===== SESSION STORAGE RESTORE =====
(function restoreSession() {
  // Discursive
  const discAns = sessionStorage.getItem("disc_answer");
  if (discAns) document.getElementById("discursiveText").value = discAns;
  if (sessionStorage.getItem("disc_submitted")) respondDiscursive();
  // Objective
  const choice = sessionStorage.getItem("obj_choice");
  if (choice !== null) {
    const items = document.querySelectorAll(".choices li");
    if (items[+choice]) selectChoice(items[+choice], +choice);
  }
  if (sessionStorage.getItem("obj_submitted")) respondObjective();
})();