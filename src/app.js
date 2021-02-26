import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';

import parse from './toParse';
import { renderError, renderPosts } from './view';
import en from './locales/en';

const schema = yup.object().shape({
  website: yup.string().url(),
});



const validateUrl = async (value, state) => {
  await schema.validate({
    website: value,
  })
    .then(() => {
      state.submitForm.link = value;
      state.submitForm.state = 'processing';
    })
    .catch((e) => {
      state.submitForm.errors.push(e.errors);
      state.submitForm.state = 'failed';
    });
};

const validateUrl2 = async (value) => {
  return await schema.validate({
    website: value,
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const getRss = async (link) => {
  const res = await fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(link)}`);
  const json = await res.json();
  const content = json.contents;
  const type = json.status.content_type;
  return type.includes('rss') ? content : '';
};



export default async () => {
  await i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    }
  });

  const state = {
    submitForm: {
      state: 'filling',
      link: '',
      error: '',
      validationState: false,
      loadState: '',
    },
    data: {
      feeds: [],
      posts: [],
      links: [],
    },
  };

  const form = document.querySelector('.rss-form');
  const input = document.querySelector('.form-control');
  const watchedState = onChange(state, (path, current, previous) => {
    if (path === 'submitForm.error') {
      renderError(current);
    }
    if (current === 'finished') {
      renderPosts(state.data.feeds, state.data.posts);
    }

  })
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('name');
    const hasLink = state.data.links.some(({ link }) => link === value);
    if (hasLink) {
      watchedState.submitForm.state = 'failed';
      watchedState.submitForm.error = 'submitProcess.errors.rssHasAlredy';
      return;
    }
    const isValidate = await validateUrl2(value);
    if (isValidate) {
      state.submitForm.link = value;
      state.submitForm.state = 'processing';
      const { link } = state.submitForm;
      const rss = await getRss(link);
      if (rss.length === 0) {
        watchedState.submitForm.state = 'failed';
        watchedState.submitForm.error = 'submitProcess.errors.rssNotValid';
        return;
      }
      const datas = parse(rss);
      console.log(datas);
      const { channelInfo, infoItems } = datas;
      const id = _.uniqueId();
      watchedState.data.feeds.push({ id, ...channelInfo });
      watchedState.data.links.push({ id, link: value });
      infoItems.forEach((item) => {
        state.data.posts.push({ id, ...item });
      })
      watchedState.submitForm.state = 'finished';
      form.reset();
      return;
    }
    watchedState.submitForm.state = 'failed';
    watchedState.submitForm.error = 'submitProcess.errors.additionURL';
  })
};