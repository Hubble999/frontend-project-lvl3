export default (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'text/xml');
  const channel = xml.querySelector('channel');
  const channelItems = [...channel.querySelectorAll('item')];
  const channelTitle = channel.querySelector('title').textContent;
  const channelDescription = channel.querySelector('description').textContent;
  const channelLink = channel.querySelector('link').textContent;
  const infoItems = [...channelItems].map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent
    const description = item.querySelector('description').textContent;
    description.trim();
    return { title, link, description };
  });
  return {
    channelInfo: { channelTitle, channelDescription, channelLink },
    infoItems,
  };
};