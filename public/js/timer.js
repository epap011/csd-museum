import { loadSlide, getSlides, getCurrentSlideIndex } from './slides.js';
import { isMobile } from './utils.js';

const progressBar = document.getElementById('progress-bar');

let slideTimeout;
let progressAnimationFrame;
let paused = false;
let startTime = null;
let elapsedBeforePause = 0;

const normalDuration = 10000;
const shortDuration = 3000;

export function startTimer() {
  const slides = getSlides();
  const currentSlide = getCurrentSlideIndex();
  const current = slides[currentSlide];
  if (!current) return;

  const duration = current.type === 'year' ? shortDuration : normalDuration;

  resetProgressBar();
  startTime = Date.now();
  elapsedBeforePause = 0;

  scheduleNextSlide(duration);
  updateProgressBar(slides, currentSlide);
}

function scheduleNextSlide(remaining) {
  clearTimeout(slideTimeout);
  if (paused) return;

  const slides = getSlides();
  const currentSlide = getCurrentSlideIndex();

  slideTimeout = setTimeout(() => {
    const nextSlide = (currentSlide + 1) % slides.length;
    loadSlide(nextSlide);
  }, remaining);
}

export function togglePause() {
  const slides = getSlides();
  const currentSlide = getCurrentSlideIndex();
  const current = slides[currentSlide];
  if (!current) return;

  const duration = current.type === 'year' ? shortDuration : normalDuration;

  if (!paused) {
    paused = true;
    clearTimeout(slideTimeout);
    cancelAnimationFrame(progressAnimationFrame);
    elapsedBeforePause += Date.now() - startTime;
  } else {
    paused = false;
    startTime = Date.now();
    const remaining = duration - elapsedBeforePause;
    scheduleNextSlide(remaining);
    updateProgressBar(slides, currentSlide);
  }
}

export function isPaused() {
  return paused;
}

function resetProgressBar() {
  if (isMobile()) return;
  progressBar.value = 0;
  elapsedBeforePause = 0;
  startTime = Date.now();
}

function updateProgressBar(slides, currentSlide) {
  if (isMobile()) return;

  const current = slides[currentSlide];
  if (!current) return;

  const duration = current.type === 'year' ? shortDuration : normalDuration;

  const elapsed = paused
    ? elapsedBeforePause
    : (Date.now() - startTime) + elapsedBeforePause;

  const progress = (elapsed / duration) * 100;
  progressBar.value = Math.min(progress, 100);

  if (!paused && progress < 100) {
    progressAnimationFrame = requestAnimationFrame(() => {
      updateProgressBar(slides, currentSlide);
    });
  }
}