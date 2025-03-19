// Axios
import axios from 'axios';
// IziToast
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
// SimpleLightbox
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.app-form');
const galleryList = document.querySelector('#galleryList');

let searchText,
  searchActivePage = 1,
  searchMaxPage;

console.log(`
  Merhaba! 👋
  Kodluyoruz Front-End Eğitimi kapsamında hazırlamış olduğum bu projede
  Axios, IziToast ve SimpleLightbox kütüphanelerini kullanarak bir fotoğraf
  galerisi oluşturmayı hedefledim. Projeyi beğendiyseniz ⭐️'layarak beni
  mutlu edebilirsiniz. Eğer projeyi geliştirmek isterseniz lütfen GitHub
  üzerinden forklayın ve istediğiniz gibi değiştirin. Eğitim sürecinde
  bana destek olan herkese teşekkür ederim. Hadi başlayalım! 🚀


  Search Photos API: https://pixabay.com/api/docs/

  Search Active Page: ${searchActivePage}
  Search Max Page: ${searchMaxPage}
  `);

const galleryItem = photoInfo => {
  const item = document.createElement('li');
  item.classList.add('gallery-item');
  item.dataset.source = photoInfo.largeImageURL;

  const itemLink = document.createElement('a');
  itemLink.href = photoInfo.largeImageURL;
  itemLink.classList.add('gallery-link');
  itemLink.style.color = 'black';

  const img = document.createElement('img');
  img.src = photoInfo.webformatURL;
  img.alt = photoInfo.tags;
  img.width = 360;
  img.height = 200;

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content');

  // Likes
  const infoDivLikes = document.createElement('div');
  infoDivLikes.classList.add('info');

  const infoKeyLikes = document.createElement('h5');
  infoKeyLikes.classList.add('key');
  infoKeyLikes.textContent = 'Likes';
  infoDivLikes.appendChild(infoKeyLikes);

  const infoValueLikes = document.createElement('p');
  infoValueLikes.classList.add('value');
  infoValueLikes.textContent = photoInfo.likes;
  infoDivLikes.appendChild(infoValueLikes);

  // Views
  const infoDivViews = document.createElement('div');
  infoDivViews.classList.add('info');

  const infoKeyViews = document.createElement('h5');
  infoKeyViews.classList.add('key');
  infoKeyViews.textContent = 'Views';
  infoDivViews.appendChild(infoKeyViews);

  const infoValueViews = document.createElement('p');
  infoValueViews.classList.add('value');
  infoValueViews.textContent = photoInfo.views;
  infoDivViews.appendChild(infoValueViews);

  // Comments
  const infoDivComments = document.createElement('div');
  infoDivComments.classList.add('info');

  const infoKeyComments = document.createElement('h5');
  infoKeyComments.classList.add('key');
  infoKeyComments.textContent = 'Comments';
  infoDivComments.appendChild(infoKeyComments);

  const infoValueComments = document.createElement('p');
  infoValueComments.classList.add('value');
  infoValueComments.textContent = photoInfo.views;
  infoDivComments.appendChild(infoValueComments);

  // Comments
  const infoDivDownloads = document.createElement('div');
  infoDivDownloads.classList.add('info');

  const infoKeyDownloads = document.createElement('h5');
  infoKeyDownloads.classList.add('key');
  infoKeyDownloads.textContent = 'Downloads';
  infoDivDownloads.appendChild(infoKeyDownloads);

  const infoValueDownloads = document.createElement('p');
  infoValueDownloads.classList.add('value');
  infoValueDownloads.textContent = photoInfo.downloads;
  infoDivDownloads.appendChild(infoValueDownloads);

  contentDiv.appendChild(infoDivLikes);
  contentDiv.appendChild(infoDivViews);
  contentDiv.appendChild(infoDivComments);
  contentDiv.appendChild(infoDivDownloads);

  itemLink.appendChild(img);
  item.appendChild(contentDiv);
  item.appendChild(itemLink);
  galleryList.appendChild(item);
};

let galleryBox = new SimpleLightbox('.gallery li > a', {
  captionsData: 'alt',
  captionDelay: 350,
});

const searchPhotos = (search, page) => {
  return new Promise(async (resolve, reject) => {
    console.log('SearchPhotos() ', search, page);

    if (page > searchMaxPage) {
      searchActivePage = 1;
      page = 1;
    } else {
      const pixabayResponse = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '21250106-0015933422f1e636de5f184b8',
          q: search,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          
          page: page,
          per_page: 40,
        },
      });

      searchMaxPage = parseFloat(
        pixabayResponse.data.totalHits / pixabayResponse.data.hits.length,
      ).toFixed(0);

      console.log(`
        Search Active Text: ${searchText}
        Search Active Page: ${searchActivePage}
        Search Max Page: ${searchMaxPage}
      `);

      if (pixabayResponse.data.hits.length === 0) {
        iziToast.error({
          position: 'topRight',
          color: 'red',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      }

      if (searchActivePage < searchMaxPage) {
        document.querySelector('#nextPage').style.display = 'block';
      }

      resolve(pixabayResponse);
    }
  });
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  galleryList.innerHTML = '';
  const search = e.target.elements.search.value;
  searchText = search;
  searchActivePage = 1;
  searchMaxPage = undefined;
  if (search === '') {
    iziToast.warning({
      position: 'topRight',
      message: 'Please enter a valid search query!',
    });
    return false;
  } else {
    const item = document.createElement('li');
    item.classList.add('gallery-item');

    const itemLoader = document.createElement('span');
    itemLoader.classList.add('loader');

    item.appendChild(itemLoader);
    item.style.textAlign = 'center';
    item.style.border = 'none';
    galleryList.appendChild(item);

    const photosResponse = await searchPhotos(search, searchActivePage);
    const photos = photosResponse.data.hits;

    galleryList.innerHTML = '';
    if (photos.length === 0) {
      iziToast.error({
        position: 'topRight',
        color: 'red',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      photos.forEach(photo => {
        galleryItem(photo);
      });
      galleryBox.refresh();
    }

    e.target.reset();
  }
});

document.querySelector('#nextPage').addEventListener('click', async e => {
  searchActivePage++;
  const search = searchText;
  const photosResponse = await searchPhotos(search, searchActivePage);
  const photos = photosResponse.data.hits;

  if (photos.length === 0) {
    iziToast.error({
      position: 'topRight',
      color: 'red',
      message:
        'Sorry, there are no images matching your search query. Please try again!',
    });
  } else {
    photos.forEach(photo => {
      galleryItem(photo);
    });

    const galleryItemD = document.querySelector('.gallery img');
    if (galleryItemD) {
      const cardHeight = galleryItemD.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2.75,
        behavior: 'smooth',
      });
    }

    galleryBox.refresh();
  }
});
