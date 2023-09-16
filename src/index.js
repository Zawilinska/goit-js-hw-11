import * as catApi from './js/api_pixabay';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import _ from 'lodash';

const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-form input');
const searchForm = document.querySelector('.search-form');
const lightbox = new SimpleLightbox('.photo-card a', {});

const moreBtn = document.querySelector('.load-more');

let pageImages = 1;
let foundImagesCount = null;
let searchQuery = null;
let isLoading = false;

async function getImages(searchQuery, page, callback) {
  try {
    const answer = await catApi.searchImage(searchQuery, page);
    callback(answer);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    isLoading = false;
  } catch (error) {
    Notiflix.Notify.failure(`Błąd wczytywania spróbuj jeszcze raz.`);
    console.log(error);
  }
}
function displayImages(data) {
  foundImagesCount = data.totalHits;
  Notiflix.Notify.success(`Znaleziono ${foundImagesCount} zdjęć`);
  createPostes(data.hits);
}
function addPosts(data) {
  createPostes(data.hits);
}
function moreImages() {
  const scrollPosition = window.pageYOffset;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (!(scrollPosition + windowHeight >= documentHeight) || isLoading) return;

  isLoading = true;
  if (checkRemainingImages()) {
    getImages(searchQuery, ++pageImages, addPosts);
    return;
  }
  Notiflix.Notify.info('Wyświetlono wszystkie zdjęcia z bazy!');
}
function searchImages(eve) {
  eve.preventDefault();
  pageImages = 1;
  gallery.innerHTML = '';
  searchQuery = searchInput.value;
  getImages(searchQuery, pageImages, displayImages);
  searchInput.value = '';
}
function createPostes(images) {
  const markupImages = images
    .map(
      image =>
        `  
        <div class="photo-card">
            <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
            <div class="info">
                <p class="info-item">
                    <b>Likes </b>${image.likes}
                </p>
                <p class="info-item">
                    <b>Views </b>${image.views}
                </p>
                <p class="info-item">
                    <b>Comments </b>${image.comments}
                </p>
                <p class="info-item">
                    <b>Downloads </b>${image.downloads}
                </p>
            </div>
        </div>`
    )
    .join(' ');
  gallery.innerHTML += markupImages;
  lightbox.refresh();
}
function checkRemainingImages() {
  if (pageImages <= foundImagesCount / 20) {
    return true;
  }
  return false;
}

searchForm.addEventListener('submit', searchImages);
document.addEventListener('scroll', _.throttle(moreImages, 300));
