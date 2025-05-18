let slides = [];
let currentSlide = 0;
let slideTimeout;
let startTime;
let paused = false;
let elapsedBeforePause = 0;
let progressAnimationFrame;

const normalDuration = 10000;
const shortDuration = 3000;
const fadeDuration = 1000;

const progressBar = document.getElementById('progress-bar');
const slideContainer = document.getElementById('slide-container');

document.getElementById('prev-button').addEventListener('click', () => {
  if (slides.length === 0) return;
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  loadSlide(currentSlide);
});

document.getElementById('next-button').addEventListener('click', () => {
  if (slides.length === 0) return;
  currentSlide = (currentSlide + 1) % slides.length;
  loadSlide(currentSlide);
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePause();
  }
});

fetch('manifest.json')
  .then(res => res.json())
  .then(data => {
    slides = data;
    startSlideShow();
  });

function resetProgressBar() {
  if (isMobile()) return;
  progressBar.value = 0;
  elapsedBeforePause = 0;
  startTime = Date.now();
}

function updateProgressBar() {
  if (isMobile()) return;

  const elapsed = Date.now() - startTime + elapsedBeforePause;
  const current = slides[currentSlide];
  const duration = current.type === "year" ? shortDuration : normalDuration;
  const progress = (elapsed / duration) * 100;
  progressBar.value = progress;

  if (!paused && progress < 100) {
    progressAnimationFrame = requestAnimationFrame(updateProgressBar);
  }
}

function scheduleNextSlide(remaining) {
  clearTimeout(slideTimeout);
  if (paused) return;

  slideTimeout = setTimeout(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    loadSlide(currentSlide);
  }, remaining);
}

function startTimer() {
  const current = slides[currentSlide];
  const duration = current.type === "year" ? shortDuration : normalDuration;

  resetProgressBar();
  startTime = Date.now();
  scheduleNextSlide(duration);
  updateProgressBar();
}

function togglePause() {
  if (!paused) {
    paused = true;
    clearTimeout(slideTimeout);
    cancelAnimationFrame(progressAnimationFrame);

    elapsedBeforePause += Date.now() - startTime;
  } else {
    paused = false;

    const current = slides[currentSlide];
    const duration = current.type === "year" ? shortDuration : normalDuration;

    const remaining = duration - elapsedBeforePause;
    startTime = Date.now();
    scheduleNextSlide(remaining);
    updateProgressBar();
  }
}

function loadSlide(index) {
  const slide = slides[index];
  slideContainer.style.opacity = 0;

  setTimeout(() => {
    if (slide.type === "content") {
      fetch(slide.path)
        .then(res => res.text())
        .then(md => {
          const html = marked.parse(md);
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;

          const allElements = Array.from(tempDiv.children);
          const imageEl = allElements.find(el => el.tagName === 'P' && el.querySelector('img'));
          const textEls = allElements.filter(el => el !== imageEl);

          const headerEl = textEls.find(el => el.tagName.startsWith('H'));
          const bodyTextEls = textEls.filter(el => el !== headerEl);

          const headerHTML = headerEl ? headerEl.outerHTML : '';
          const textHTML = bodyTextEls.map(el => el.outerHTML).join('');
          const imageHTML = imageEl ? imageEl.outerHTML : '';

          slideContainer.innerHTML = `
            <div class="slide-content">
              <div class="header">${headerHTML}</div>
              <div class="body">
                <div class="text">${textHTML}</div>
                <div class="image">${imageHTML}</div>
              </div>
            </div>
          `;

          slideContainer.style.opacity = 1;

          if (!paused) startTimer();
        });
    } else if (slide.type === "year") {
      slideContainer.innerHTML = `
        <div class="year-slide">
          <h1 class="year-heading">${slide.year}</h1>
          ${slide.text ? `<p class="year-subtitle">${slide.text}</p>` : ''}
        </div>
      `;

      slideContainer.style.opacity = 1;

      if (!paused) startTimer();
    }
  }, fadeDuration);
}

function startSlideShow() {
  loadSlide(currentSlide);
}

function isMobile() {
  return window.innerWidth <= 768;
}
