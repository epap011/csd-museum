let slides = [];
let currentSlide = 0;
const interval = 60000;
const fadeDuration = 1000;
let startTime;
let slideInterval = null;

const progressBar = document.getElementById('progress-bar');
const slideContainer = document.getElementById('slide-container');

// Button listeners
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

// Fetch and start
fetch('manifest.json')
  .then(res => res.json())
  .then(data => {
    slides = data;
    startSlideShow();
  });

function resetProgressBar() {
  if (isMobile()) return;
  progressBar.value = 0;
  startTime = Date.now();
}

function updateProgressBar() {
  if (isMobile()) return;

  const elapsed = Date.now() - startTime;
  const progress = (elapsed / interval) * 100;

  progressBar.value = progress;

  if (progress < 100) {
    requestAnimationFrame(updateProgressBar);
  }
}

function loadSlide(index) {
  slideContainer.style.opacity = 0;
  resetProgressBar();

  setTimeout(() => {
    fetch(slides[index])
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
        updateProgressBar();
      });
  }, fadeDuration);
}

function startSlideShow() {
  loadSlide(currentSlide);

  if (slideInterval) clearInterval(slideInterval);

  if (!isMobile()) {
    slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    loadSlide(currentSlide);
    }, interval);
  }
}

function isMobile() {
  return window.innerWidth <= 768;;
}
