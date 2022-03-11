'use strict';
{
  const articles = document.querySelectorAll('.post');
  let instruction = document.createElement('div');
  instruction.textContent = 'Please choose an article.';
  document.querySelector('section').appendChild(instruction);

  const displayArticle = function (articleIdentifier) {
    for (let article of articles) {
      article.classList.remove('active');
      if ('#' + article.id === articleIdentifier) {
        article.classList.add('active');
      }
    }
  };

  const hideArticle = () => {
    for (let article of articles) {
      article.classList.remove('active');
    }
    instruction.textContent = 'Please choose an article.';
  };

  const activateLink = function (evt) {
    evt.preventDefault();

    const activeLinks = document.querySelectorAll('.titles a.active');

    const clickedLink = this;

    const linkStatus = clickedLink.classList.contains('active');

    const articleIdentifier = clickedLink.getAttribute('href');

    instruction.textContent = '';

    if (linkStatus) {
      clickedLink.classList.remove('active');
      hideArticle(articleIdentifier);
    } else {
      for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
      }
      clickedLink.classList.add('active');
      displayArticle(articleIdentifier);
    }
  };

  const generateLinkList = function () {
    let linkList = document.querySelector('.titles');
    linkList.innerHTML = '';
    for (let article of articles) {
      const articleIdentifier = article.id;
      const titleText = article.querySelector('.post-title').textContent;
      const link =
        '<li><a href="#' + articleIdentifier + '"><span>' + titleText + '</span></a></li>';
      linkList.insertAdjacentHTML('beforeend', link);
    }
    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', activateLink);
    }
  };

  generateLinkList();
}
//alternatywne rozwiazanie

// const generateLinkList = function () {
//   document.querySelector('.titles').innerHTML = '';
//   for (let article of articles) {
//     const articleIdentifier = article.id;
//     const titleText = article.querySelector('.post-title').textContent;
//     const link = document.createElement('li');
//     link.innerHTML = '<a href="#' + articleIdentifier + '"><span>' + titleText + '</span></a>';
//     document.querySelector('ul').appendChild(link);
//   }
//   const links = document.querySelectorAll('.titles a');

//   for (let link of links) {
//     link.addEventListener('click', activateLink);
//   }
// };
