
import axios from 'axios';

const url = 'https://www.youtube.com/playlist?list=PLu0W_9lII9agp6kLA6f80Kdx6l47_vrqj';

async function test() {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const titleMatch = data.match(/<meta property="og:title" content="(.*?)"/);
        const imageMatch = data.match(/<meta property="og:image" content="(.*?)"/);

        console.log('Title:', titleMatch ? titleMatch[1] : 'Not Found');
        console.log('Thumbnail:', imageMatch ? imageMatch[1] : 'Not Found');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
