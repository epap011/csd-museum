import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import { JSDOM } from 'jsdom';

const inputDir = './slides';
const outputDir = './public/html';

async function generateHTML() {
  const files = await fs.readdir(inputDir);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const markdown = await fs.readFile(path.join(inputDir, file), 'utf-8');
    const htmlContent = marked.parse(markdown);
    const dom = new JSDOM(`<body>${htmlContent}</body>`);
    const body = dom.window.document.body;

    const headerHTML = body.querySelector('h1')?.outerHTML || '';
    const paragraphs = Array.from(body.querySelectorAll('p'))
      .filter(p => !p.querySelector('img'))
      .map(p => p.outerHTML)
      .join('\n');
    const imageHTML = body.querySelector('img')?.outerHTML || '';

    const finalHTML = `
      <!DOCTYPE html>
      <html lang="el">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${path.basename(file, '.md')}</title>
        <link href="/css/base.css" rel="stylesheet" />
        <link href="/css/components/slide-content.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Victor+Mono&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="slide-content">
          <div class="header">${headerHTML}</div>
          <div class="body">
            <div class="text">${paragraphs}</div>
            <div class="image">${imageHTML}</div>
          </div>
        </div>
      </body>
      </html>
    `.trim();

    const outputFilePath = path.join(outputDir, file.replace('.md', '.html'));
    await fs.writeFile(outputFilePath, finalHTML, 'utf-8');
    console.log(`Generated ${outputFilePath}`);
  }
}

generateHTML();
