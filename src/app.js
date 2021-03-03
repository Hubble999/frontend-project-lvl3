import i18next from 'i18next';
import axios from 'axios';

import parse from './toParse';
import en from './locales/en';
import { validate } from './utils';
import watch from './watch';

const getRss = (url) => {
  return axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((res) => res.data)
    .catch((e) => console.log(e))
};

const updatePosts = (state, links) => {
  links.reverse().forEach(({ id, link }) => {
    getRss(link)
      .then((data) => {
        const { infoItems } = parse(data.contents);
        const posts = state.data.posts;
        const updatePosts = infoItems.map(({ title, description, link }) => ({ id, title, description, link }));
        const newPosts = _.differenceWith(updatePosts, posts, _.isEqual);
        if (newPosts.length > 0) {
          state.data.posts = [...newPosts, state.data.posts];
        }
      });
  })
  setTimeout(() => updatePosts(state, links), 5000);
}

export default () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    }
  });

  const state = {
    submitForm: {
      state: 'filling',
      errors: [],
      validationErrors: [],
      loadState: '',
    },
    data: {
      feeds: [],
      posts: [],
      links: [],
    },
  };
  const watchedState = watch(state);
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.submitForm.validationErrors = [];
    watchedState.submitForm.state = 'processing';
    const formData = new FormData(e.target);
    const url = formData.get('value');
    const errors = validate(url, state.data.links);
    if (errors.length === 0) {
      getRss(url)
        .then((res) => {
          return parse(res.contents);
        })
        .then((data) => {
          const { feeds, posts, links } = state.data;
          const { feedInfo, infoItems } = data;
          const id = _.uniqueId();
          watchedState.data.feeds = [{ id, ...feedInfo }, ...feeds];
          const newPosts = infoItems.map(({ title, link, description }) => ({ id, title, link, description }));
          watchedState.data.posts = [...newPosts, ...posts];
          watchedState.data.links = [{ id, link: url }, ...links];
          watchedState.submitForm.state = 'finished';
        })
        .then(() => {
          watchedState.submitForm.state = 'filling';
        })
        .catch(() => {
          watchedState.submitForm.state = 'failed';
          watchedState.submitForm.errors = [(i18next.t('submitProcess.errors.rssNotValid'))];
        })
        .then(() => setTimeout(() => updatePosts(watchedState, state.data.links), 5000));
    } else {
      watchedState.submitForm.state = 'failed';
      watchedState.submitForm.validationErrors = errors;
    }
  })
};