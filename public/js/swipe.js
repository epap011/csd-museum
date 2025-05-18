let startX = 0;
let endX = 0;

document.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const threshold = 50;
  if (startX - endX > threshold) {
    showNextSlide();
  } else if (endX - startX > threshold) {
    showPreviousSlide();
  }
}

function showNextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  loadSlide(currentSlide);
}

function showPreviousSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  loadSlide(currentSlide);
}