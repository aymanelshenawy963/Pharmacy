import { BASE_URL } from '../config/api';

export function getPhotoUrl(photo) {
    if (!photo) return '';
    if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
    return `${BASE_URL}${photo.startsWith('/') ? photo : `/${photo}`}`;
}

export async function urlToFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
}
