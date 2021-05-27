import i18next from 'i18next';

export const renderForm = (value) => {
  const input = document.querySelector('input');
  const addBtn = document.querySelector('.addBtn');
  addBtn.setAttribute('disabled', true);
  if (value === 'failed') {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }
  addBtn.removeAttribute('disabled');
};

export const renderError = (value) => {
  const feedbackEl = document.querySelector('.feedback');
  feedbackEl.textContent = '';
  feedbackEl.textContent = value.join('');
};

export const renderContent = (feeds, posts) => {
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');
  feedsContainer.innerHTML = '';
  postsContainer.innerHTML = '';
  const feedTitle = document.createElement('h2');
  feedTitle.textContent = i18next.t('feeds');
  feedsContainer.append(feedTitle);
  const postTitle = document.createElement('h2');
  postTitle.textContent = i18next.t('posts');
  postsContainer.append(postTitle);
  const feedContainer = document.createElement('ul');
  feedContainer.classList.add('list-group', 'mb-5');
  const postContainer = document.createElement('ul');
  postContainer.classList.add('list-group');
  feeds.forEach(({ id, feedTitle, feedDescription }) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    const h3El = document.createElement('h3');
    h3El.textContent = feedTitle;
    const pEl = document.createElement('p');
    pEl.textContent = feedDescription;
    liEl.append(h3El);
    liEl.append(pEl);
    const items = posts.filter((post) => post.id === id);
    items.forEach(({ title, link, description }) => {
      const liEl2 = document.createElement('li');
      liEl2.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
      );
      const aEl = document.createElement('a');
      aEl.href = link;
      aEl.classList.add('font-weight-bold');
      aEl.textContent = title;
      const button = document.createElement('button');
      button.textContent = i18next.t('viewing');
      button.classList.add('btn', 'btn-primary', 'btn-sm');
      button.setAttribute('type', 'button');
      button.setAttribute('data-toggle', 'modal');
      button.setAttribute('data-target', '#myModal');
      button.setAttribute('data-description', description);
      button.setAttribute('data-title', title);
      button.setAttribute('data-link', link);
      liEl2.append(aEl);
      liEl2.append(button);
      postContainer.append(liEl2);
    });
    feedContainer.append(liEl);
  });
  feedsContainer.append(feedContainer);
  postsContainer.append(postContainer);
  const form = document.querySelector('form');
  form.reset();
};
