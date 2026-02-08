
const extractPlaylistId = (url) => {
    console.log("Extracting ID from:", url);
    // Handle full URL
    const regExp = /[?&]list=([^#\&\?]+)/;
    const match = url.match(regExp);
    if (match) return match[1];

    // Handle raw ID (starts with PL, UU, FL, RD) or just a long string
    if (url.length > 10 && !url.includes('http')) return url;

    return null;
};

const urls = [
    'https://www.youtube.com/playlist?list=PLu0W_9lII9agp6kLA6f80Kdx6l47_vrqj',
    'https://youtube.com/playlist?list=PLu0W_9lII9agp6kLA6f80Kdx6l47_vrqj',
    'https://www.youtube.com/watch?v=videoID&list=PLu0W_9lII9agp6kLA6f80Kdx6l47_vrqj',
    'PLu0W_9lII9agp6kLA6f80Kdx6l47_vrqj',
    'invalid-url'
];

urls.forEach(url => {
    console.log(url, '=>', extractPlaylistId(url));
});
