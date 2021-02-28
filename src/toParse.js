export default (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'text/xml');
  const channel = xml.querySelector('channel');
  const channelItems = [...channel.querySelectorAll('item')];
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const feedLink = channel.querySelector('link').textContent;
  const infoItems = [...channelItems].map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent
    const description = item.querySelector('description').textContent;
    description.trim();
    return { title, link, description };
  });
  return {
    channelInfo: { feedTitle, feedDescription, feedLink },
    infoItems,
  };
};