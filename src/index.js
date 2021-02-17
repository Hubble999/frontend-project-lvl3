import { type } from 'jquery';
import _ from 'lodash';
import axios from 'axios';

import app from './app.js'

const parser = new DOMParser();

// axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent('https://lenta.ru/rss/news')}`)
// .then(({ data }) => {
// const dom = parser.parseFromString(data.contents, 'text/xml')
// const text = [...dom.querySelectorAll('item')][0].textContent;
// const title = text.split('\n')[3];
// const link = text.split('\n')[1];
// const content = text.split('\n')[6];
//console.log(title, l)
// })
fetch(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent('https://ru.hexlet.io/lessons.rss')}`)
  .then(response => {
    return response.json();
  })
  .then((data) => {
    const xml = parser.parseFromString(data.contents, 'text/xml');
    console.log(xml);

    if (xml.querySelector('rss')) {
      return xml;
    }
    throw new Error('has not rss');
  })

app();