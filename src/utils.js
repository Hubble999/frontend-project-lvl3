import i18next from 'i18next';
import * as yup from 'yup';

const validate = (url, links) => {

  yup.setLocale({
    mixed: {
      notOneOf: i18next.t('submitProcess.errors.rssHasAlredy')
    },
    string: {
      url: i18next.t('submitProcess.errors.additionURL')
    }
  });

  const schema = yup.object().shape({
    website: yup.string()
      .url()
      .notOneOf(links.map(({ link }) => link))
  });

  try {
    schema.validateSync({ website: url }, { abortEarly: false });
    return [];
  } catch (e) {
    return [e.errors];
  }
};

export { validate }; 