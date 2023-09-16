import axios from 'axios';

const urlApi = `https://pixabay.com/api/`;
const apiKey = '38025417-155cab9872a1d53dd80473204';

export function init(api_key) {
  axios.defaults.headers.common['x-api-key'] = api_key;
}
export async function searchImage(query, page) {
  const url = `${urlApi}?key=${apiKey}&q=${encodeURIComponent(
    query
  )}&page=${page}&per_page=20&image_type=photo&orientation=horizontal&safesearch=true`;
  const response = await axios.get(url);
  return response.data;
}
