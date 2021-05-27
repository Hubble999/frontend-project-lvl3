import onChange from 'on-change';
import { renderError, renderContent, renderForm } from './view';

export default (state) => onChange(state, (path, value) => {
  switch (path) {
    case 'submitForm.state': {
      renderForm(value);
      break;
    }
    case 'submitForm.validationErrors': {
      renderError(value);
      break;
    }
    case 'submitForm.errors': {
      renderError(value);
      break;
    }
    case 'data.posts': {
      renderContent(state.data.feeds, state.data.posts);
      break;
    }
  }
});
