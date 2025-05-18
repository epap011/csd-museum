export const slideContainer = document.getElementById('slide-container');

export function renderSlide(slide, paused, startTimerCallback) {
  slideContainer.style.opacity = 0;

  setTimeout(() => {
    if (slide.type === 'content') {
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

          if (!paused) startTimerCallback();
        });
    } else if (slide.type === 'year') {
      slideContainer.innerHTML = `
        <div class="year-slide">
          <h1 class="year-heading">${slide.year}</h1>
          ${slide.text ? `<p class="year-subtitle">${slide.text}</p>` : ''}
        </div>
      `;

      slideContainer.style.opacity = 1;

      if (!paused) startTimerCallback();
    }
  }, 1000);
}
