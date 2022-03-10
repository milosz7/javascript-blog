'use strict';
{
  const links = document.querySelectorAll('.titles a');
  const articles = document.querySelectorAll('.post');
  let instruction = document.createElement('div');
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

  for (let link of links) {
    link.addEventListener('click', activateLink);
  }
}
