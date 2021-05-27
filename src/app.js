import i18next from 'i18next';
import axios from 'axios';
import parse from './toParse';
import locales from './locales/index';
import { validate } from './utils';
import watch from './watch';
import $ from 'jquery';
import 'bootstrap/js/dist/modal';
import _ from 'lodash';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: locales,
  });

const proxy = 'https://hexlet-allorigins.herokuapp.com';

const getRss = (url) => {
  return axios
    .get(`${proxy}/get?url=${encodeURIComponent(url)}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => console.log(e));
};

const updatePosts = (state, links) => {
  links.reverse().forEach(({ id, link }) => {
    getRss(link).then((data) => {
      const { infoItems } = parse(data.contents);
      const posts = state.data.posts;
      const updatePosts = infoItems.map(({ title, description, link }) => ({
        id,
        title,
        description,
        link,
      }));
      const newPosts = _.differenceWith(updatePosts, posts, _.isEqual);
      if (newPosts.length > 0) {
        state.data.posts = [...newPosts, state.data.posts];
      }
    });
  });
  setTimeout(() => updatePosts(state, links), 5000);
};

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

 /*  const addBtn = document.querySelector('.addBtn');
  addBtn.innerText = i18next.t('add');
  const closeModalBtn = document.querySelector('.closeModalBtn');
  closeModalBtn.innerText = i18next.t('close');
  const goModalBtn = document.querySelector('.goModalBtn');
  goModalBtn.innerText = i18next.t('go'); */

  const watchedState = watch(state);
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.submitForm.state = 'processing';
    const formData = new FormData(e.target);
    const url = formData.get('value');
    const URLerrors = validate(url, state.data.links);
    if (URLerrors.length === 0) {
      getRss(url)
        .then((res) => {
          return parse(res.contents);
        })
        .then((data) => {
          const { feeds, posts, links } = state.data;
          const { feedInfo, infoItems } = data;
          const id = _.uniqueId();
          watchedState.data.feeds = [{ id, ...feedInfo }, ...feeds];
          const newPosts = infoItems.map(({ title, link, description }) => ({
            id,
            title,
            link,
            description,
          }));
          watchedState.data.posts = [...newPosts, ...posts];
          watchedState.data.links = [{ id, link: url }, ...links];
          watchedState.submitForm.state = 'finished';
        })
        .then(() => {
          watchedState.submitForm.state = 'filling';
        })
        .catch(() => {
          watchedState.submitForm.state = 'failed';
          watchedState.submitForm.errors = [
            i18next.t('submitProcess.errors.rssNotValid'),
          ];
        })
        .then(() =>
          updatePosts(watchedState, state.data.links),
        );
    } else {
      watchedState.submitForm.state = 'failed';
      watchedState.submitForm.validationErrors = URLerrors;
    }
  });
  $('#myModal').on('show.bs.modal', function append(evt) {
    const button = $(evt.relatedTarget);
    const description = button.data('description');
    const title = button.data('title');
    const link = button.data('link');
    const modal = $(this);
    modal.find('#description').text(description);
    modal.find('#title').text(title);
    modal.find('#link').attr({ href: link });
  });
};
