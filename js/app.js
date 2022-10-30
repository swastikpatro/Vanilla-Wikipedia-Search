import createRange from './createRange.js';
import debounce from './debounce.js';

const url =
  'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=';

const inputEle = document.querySelector('.form-input');
const form = document.querySelector('[name="form"]');
const resultsDOM = document.querySelector('.results');

function displayLoadArticles() {
  const skeletonArticles = [...createRange(20)]
    .map((single) => {
      return `
    <div class="skeleton-card" >
      <div class="skeleton-heading"></div>
      <div class="skeleton-para">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    `;
    })
    .join('');

  resultsDOM.innerHTML = `
  <div class="articles">
    ${skeletonArticles}
  </div>
  `;
}

async function fetchArticles(updatedURL) {
  // resultsDOM.innerHTML = '<div class="loading"></div>';
  displayLoadArticles();
  try {
    const response = await fetch(updatedURL);
    if (!response.ok) {
      resultsDOM.innerHTML = `<div class="error">Can't fetch data</div>`;
      return;
    }
    const {
      query: { search: data },
    } = await response.json();

    if (data.length < 1) {
      resultsDOM.innerHTML = `<div class="error">Can't find the input text</div>`;
      return;
    }
    return data;
  } catch (err) {
    console.log(err);
    resultsDOM.innerHTML = `<div class="error">${err}</div>`;
  }
}
function displayAllArticles(articlesList) {
  console.log(articlesList);
  const allArticlesString = articlesList
    .map((singleArticle) => {
      const { title, snippet, pageid } = singleArticle;
      return `
    <a href=http://en.wikipedia.org/?curid=${pageid} target="_blank">
      <h4>${title}</h4>
      <p>
        ${snippet}
      </p>
    </a>
    `;
    })
    .join('');

  resultsDOM.innerHTML = `
    <div class="articles">
      ${allArticlesString}
    </div>
    `;
}

async function getInputEntries(e) {
  const inputVal = inputEle.value;
  if (!inputVal) {
    resultsDOM.innerHTML =
      e.type === 'submit' ? `<div class="error">Please enter value</div>` : '';
    return;
  }
  const allArticles = await fetchArticles(`${url}${inputVal}`);
  if (!!allArticles) {
    displayAllArticles(allArticles);
  }
}

inputEle.addEventListener(
  'input',
  debounce(function (e) {
    getInputEntries(e);
  }, 700)
);

function handleSubmit(e) {
  e.preventDefault();
  getInputEntries(e);
}

form.addEventListener('submit', handleSubmit);
