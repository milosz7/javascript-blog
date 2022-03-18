'use strict';
{
  const articles = document.querySelectorAll('.post');
  let instruction = document.createElement('div');
  instruction.textContent = 'Please choose an article.';
  instruction.style.opacity = '0';
  instruction.style.animation = 'show-item 1s forwards';
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
    instruction.style.display = 'block';
  };

  const activateLink = function (evt) {
    evt.preventDefault();

    const activeLinks = document.querySelectorAll('.titles a.active');

    const clickedLink = this;

    const linkStatus = clickedLink.classList.contains('active');

    const articleIdentifier = clickedLink.getAttribute('href');

    instruction.style.display = 'none';

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

  const generateLinkList = function (articleFilter = '') {
    const articles = document.querySelectorAll('.post' + articleFilter);
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

    checkCurrentArticle(articles);
  };

  const checkCurrentArticle = function (articles) {
    const linkList = document.querySelectorAll('.titles a');
    for (let article of articles) {
      if (article.classList.contains('active')) {
        const articleId = article.id;
        for (let link of linkList) {
          if (link.getAttribute('href') === '#' + articleId) {
            link.classList.add('active');
          }
        }
      }
    }
  };

  const generateTags = function () {
    for (let article of articles) {
      const postTags = article.getAttribute('data-tags');
      const tagList = article.querySelector('.list');
      const tagsArray = postTags.split(' ');
      for (let i = 0; i < tagsArray.length; i++) {
        let newTag = '<li><a href="#tag-' + tagsArray[i] + '">' + tagsArray[i] + '</a></li> ';
        tagList.insertAdjacentHTML('beforeend', newTag);
      }
    }
  };

  const tagClickHandler = function (evt) {
    evt.preventDefault();
    const clickedElement = this;
    const elementHref = clickedElement.getAttribute('href');
    const elementTag = elementHref.substring(5);
    const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    if (clickedElement.classList.contains('active')) {
      removeActive(activeLinks);
      removeActive(authorLinks);
      generateLinkList();
    } else {
      removeActive(activeLinks);
      removeActive(authorLinks);
      const linksToDisplay = document.querySelectorAll('a[href="' + elementHref + '"]');
      for (let linkToDisplay of linksToDisplay) {
        linkToDisplay.classList.add('active');
      }
      generateLinkList('[data-tags~="' + elementTag + '"]');
    }
  };

  const removeActive = function (activeLinks) {
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
  };

  const generateAuthors = function () {
    for (let article of articles) {
      const authorName = article.getAttribute('data-author');
      const authorTag = authorName.toLowerCase().split(' ').join('-');
      const authorLink = article.querySelector('.post-author');
      const linkStructure = 'by <a href="#author-' + authorTag + '">' + authorName + '</a>';
      authorLink.innerHTML = linkStructure;
    }
  };

  const authorClickHandler = function (evt) {
    evt.preventDefault();
    const clickedLink = this;
    const authorHref = clickedLink.getAttribute('href');
    const authorDataTag = clickedLink.innerText;
    console.log(clickedLink.textContent.length);
    const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');
    if (clickedLink.classList.contains('active')) {
      removeActive(activeLinks);
      removeActive(tagLinks);
      generateLinkList();
    } else {
      removeActive(activeLinks);
      removeActive(tagLinks);
      const linksToActivate = document.querySelectorAll('a[href="' + authorHref + '"]');
      console.log('a[href="' + authorHref + '"]');
      for (let linkToActivate of linksToActivate) {
        linkToActivate.classList.add('active');
      }
      generateLinkList('[data-author="' + authorDataTag + '"]');
    }
  };

  generateLinkList();
  generateAuthors();
  generateTags();

  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

  for (let tagLink of tagLinks) {
    tagLink.addEventListener('click', tagClickHandler);
  }

  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}
