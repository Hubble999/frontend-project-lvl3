export const highlightForm = (value) => {
  const input = document.querySelector('input');
  if (value === 'failed') {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }
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
  const h2Feed = document.createElement('h2');
  h2Feed.textContent = 'Feeds';
  feedsContainer.append(h2Feed);
  const h2Post = document.createElement('h2');
  h2Post.textContent = 'Posts';
  postsContainer.append(h2Post);
  const ulFeed = document.createElement('ul');
  ulFeed.classList.add('list-group', 'mb-5')
  const ulPost = document.createElement('ul');
  ulPost.classList.add('list-group');
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
      liEl2.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");
      const aEl = document.createElement('a');
      aEl.href = link;
      aEl.classList.add("font-weight-bold");
      aEl.textContent = title;
      const button = document.createElement('button');
      button.textContent = 'show';
      button.classList.add("btn", "btn-primary", "btn-sm");
      button.setAttribute('type', 'button');
      liEl2.append(aEl);
      liEl2.append(button);
      ulPost.append(liEl2);
    })
    ulFeed.append(liEl);
  })
  feedsContainer.append(ulFeed);
  postsContainer.append(ulPost);
  const form = document.querySelector('form');
  form.reset();
};