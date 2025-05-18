import { renderSlide } from './ui.js';
import { startTimer, isPaused } from './timer.js';

let slides = [];
let currentSlide = 0;

export function getSlides() {
  return slides;
}

export function getCurrentSlideIndex() {
  return currentSlide;
}

export function setCurrentSlideIndex(index) {
  currentSlide = index;
}

export async function loadSlides(url) {
  const response = await fetch(url);
  slides = await response.json();
}

export function loadSlide(index) {
  setCurrentSlideIndex(index);
  const slide = slides[index];
  renderSlide(slide, isPaused(), () => startTimer());
}
