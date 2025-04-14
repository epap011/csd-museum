let slides         = [];
let currentSlide   = 0;
const interval     = 5000;
const fadeDuration = 1000;

const slideContainer = document.getElementById('slide-container');

fetch('manifest.json')
  .then(res => res.json())
  .then(data => {
    slides = data;
    startSlideShow();
  });

  function loadSlide(index) {
    slideContainer.style.opacity = 0;
  
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
  
          const textHTML = textEls.map(el => el.outerHTML).join('');
          const imageHTML = imageEl ? imageEl.outerHTML : '';
  
          slideContainer.innerHTML = `
            <div class="slide-content">
              <div class="text">${textHTML}</div>
              <div class="image">${imageHTML}</div>
            </div>
          `;
  
          slideContainer.style.opacity = 1;
        });
    }, fadeDuration);
  }

function startSlideShow() {
  loadSlide(currentSlide);
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    loadSlide(currentSlide);
  }, interval);
}
