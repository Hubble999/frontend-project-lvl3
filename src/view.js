export const renderError = (error) => {
  console.log(error);
  if (document.querySelector('.alert')) {
    document.querySelector('.alert').remove();
  }
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const div = document.createElement('div');
  div.textContent = error;
  div.classList.add('alert', 'alert-danger', 'w-25', 'p-3');
  div.setAttribute('role', 'alert');
  div.setAttribute('style', 'margin-left: 205px');
  form.append(div);
  input.classList.add('is-invalid');
};

export const renderPosts = (feeds, posts) => {
  if (document.querySelector('.alert')) {
    document.querySelector('.alert').remove();
  }
  const rssDiv = document.getElementById('rss');
  const feedsEl = document.getElementById('feeds');
  feedsEl.innerHTML = '';
  const postsEl = document.getElementById('posts');
  postsEl.innerHTML = '';
  feeds.forEach(({ id, channelTitle, channelDescription }) => {
    const feedPosts = posts.filter((post) => post.id === id);
    const feedEl = document.createElement('div');
    const titleFeed = document.createElement('h4');
    const descriptionFeed = document.createElement('p');
    titleFeed.textContent = channelTitle;
    descriptionFeed.textContent = channelDescription;
    feedEl.append(titleFeed);
    feedEl.append(descriptionFeed);
    feedEl.classList.add('mx-auto', 'shadow', 'p-2', 'mb-3', 'bg-white', 'rounded');
    feedEl.setAttribute('style', 'width: 500px')
    feedsEl.append(feedEl);
    feedPosts.forEach(({ title, link, description }) => {
      const postEl = document.createElement('div');
      const textEl = document.createElement('p');
      textEl.classList.add('w-75')
      const titleEl = document.createElement('h5');
      textEl.textContent = description;
      titleEl.textContent = title;
      postEl.append(titleEl)
      postEl.append(textEl);
      postEl.classList.add('mx-auto', 'shadow', 'p-3', 'mb-1', 'bg-white', 'rounded', 'h-50');
      postEl.setAttribute('style', 'width: 1000px')
      postsEl.append(postEl);
    })
  });
  rssDiv.append(feedsEl);
  rssDiv.append(postsEl);
};