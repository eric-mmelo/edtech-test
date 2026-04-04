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
