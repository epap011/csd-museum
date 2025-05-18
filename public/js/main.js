// main.js
import { loadSlides, getSlides, getCurrentSlideIndex, setCurrentSlideIndex, loadSlide } from './slides.js';
import { togglePause } from './timer.js';

document.getElementById('prev-button').addEventListener('click', () => {
  if (getSlides().length === 0) return;
  let newIndex = (getCurrentSlideIndex() - 1 + getSlides().length) % getSlides().length;
  setCurrentSlideIndex(newIndex);
  loadSlide(newIndex);
});

document.getElementById('next-button').addEventListener('click', () => {
  if (getSlides().length === 0) return;
  let newIndex = (getCurrentSlideIndex() + 1) % getSlides().length;
  setCurrentSlideIndex(newIndex);
  loadSlide(newIndex);
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePause();
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault();
    if (getSlides().length === 0) return;
    let newIndex = (getCurrentSlideIndex() - 1 + getSlides().length) % getSlides().length;
    setCurrentSlideIndex(newIndex);
    loadSlide(newIndex);
  } else if (e.code === 'ArrowRight') {
    e.preventDefault();
    if (getSlides().length === 0) return;
    let newIndex = (getCurrentSlideIndex() + 1) % getSlides().length;
    setCurrentSlideIndex(newIndex);
    loadSlide(newIndex);
  }
});

loadSlides('manifest.json').then(() => {
  loadSlide(getCurrentSlideIndex());
});