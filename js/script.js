'use strict';
{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagsList: Handlebars.compile(document.querySelector('#template-tags-list').innerHTML),
    authorsList: Handlebars.compile(document.querySelector('#template-authors-list').innerHTML),
  };

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
      const linkData = { id: articleIdentifier, title: titleText };
      const linkHTML = templates.articleLink(linkData);
      linkList.insertAdjacentHTML('beforeend', linkHTML);
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

  const generateTagLinks = function () {
    for (let article of articles) {
      const postTags = article.getAttribute('data-tags');
      const tagList = article.querySelector('.list');
      const tagsArray = postTags.split(' ');
      for (let i = 0; i < tagsArray.length; i++) {
        const newTagData = { tagName: tagsArray[i] };
        const newTag = templates.tagLink(newTagData);
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

  const generateAuthorsList = function () {
    const authorList = document.querySelector('.list.authors');
    const authorCount = {};
    const authorsSort = [];
    const authorsLinkData = { authors: [] };

    for (let article of articles) {
      const authorName = article.getAttribute('data-author');
      if (authorsSort.indexOf(authorName) === -1) {
        authorsSort.push(authorName);
        authorsSort.sort();
      }
      authorCount[authorName] = (authorCount[authorName] || 0) + 1;
    }

    for (let author of authorsSort) {
      authorsLinkData.authors.push({
        author: author,
        count: authorCount[author],
        id: 'author-' + author.toLowerCase().split(' ').join('-'),
      });
    }

    authorList.innerHTML = templates.authorsList(authorsLinkData);
  };

  const generateAuthors = function () {
    for (let article of articles) {
      const authorName = article.getAttribute('data-author');
      const authorTag = authorName.toLowerCase().split(' ').join('-');
      const authorLink = article.querySelector('.post-author');
      const linkStructureData = { id: authorTag, author: authorName };
      const linkStructure = templates.authorLink(linkStructureData);
      authorLink.innerHTML = linkStructure;
    }
  };

  const authorClickHandler = function (evt) {
    evt.preventDefault();
    const clickedLink = this;
    const authorHref = clickedLink.getAttribute('href');
    const authorDataTag = clickedLink.innerText;
    const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');
    if (clickedLink.classList.contains('active')) {
      removeActive(activeLinks);
      removeActive(tagLinks);
      generateLinkList();
    } else {
      removeActive(activeLinks);
      removeActive(tagLinks);
      const linksToActivate = document.querySelectorAll('a[href="' + authorHref + '"]');
      for (let linkToActivate of linksToActivate) {
        linkToActivate.classList.add('active');
      }
      generateLinkList('[data-author="' + authorDataTag + '"]');
    }
  };

  const calculateTagsParams = function (tagCount) {
    const tagsParamsArr = [];
    for (let tag in tagCount) {
      tagsParamsArr.push(tagCount[tag]);
    }
    const tagsMinMax = {};
    tagsMinMax.min = Math.min(...tagsParamsArr);
    tagsMinMax.max = Math.max(...tagsParamsArr);
    return tagsMinMax;
  };

  const calculateTagClass = function (tagsMinMax, tagCount) {
    const numberOfFontSizes = 5;
    const countNormalized = tagCount - tagsMinMax.min;
    const maxNormalized = tagsMinMax.max - tagsMinMax.min;
    const classNumber = Math.floor((countNormalized / maxNormalized) * (numberOfFontSizes - 1) + 1);
    return classNumber;
  };

  const generateTagList = function () {
    let tagsArr = [];
    for (let article of articles) {
      const articleTags = article.getAttribute('data-tags').split(' ');
      tagsArr.push.apply(tagsArr, articleTags);
    }
    const tagCount = {};
    tagsArr.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
    const tagsUnique = tagsArr.reduce(function (uniqueTags, tagToCheck) {
      if (uniqueTags.indexOf(tagToCheck) < 0) {
        uniqueTags.push(tagToCheck);
      }
      uniqueTags.sort();
      return uniqueTags;
    }, []);

    const tagsMinMax = calculateTagsParams(tagCount);
    const tagsData = { tags: [] };

    tagsUnique.forEach((tag) => {
      tagsData.tags.push({
        tag: tag,
        fontSize: calculateTagClass(tagsMinMax, tagCount[tag]),
      });
    });
    const tagList = document.querySelector('.list.tags');
    tagList.innerHTML = templates.tagsList(tagsData);
  };

  generateTagList();
  generateLinkList();
  generateAuthors();
  generateAuthorsList();
  generateTagLinks();

  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

  for (let tagLink of tagLinks) {
    tagLink.addEventListener('click', tagClickHandler);
  }

  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}
