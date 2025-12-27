import axios from 'axios';

async function checkIsShort(videoId) {
    try {
        const url = `https://www.youtube.com/shorts/${videoId}`;
        const response = await axios.head(url, {
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400
        });

        console.log(`ID: ${videoId}, Status: ${response.status}, Location: ${response.headers.location}`);

        if (response.status === 200) {
            console.log("-> It is a SHORT");
        } else if (response.status === 303 || response.status === 302 || response.status === 301) {
            // It redirected, likely to /watch
            console.log("-> It is a VIDEO (Redirected)");
        } else {
            console.log("-> Unknown status");
        }
    } catch (error) {
        console.error(`Error checking ${videoId}:`, error.message);
    }
}

// IDs from previous output
const ids = ['wnVe7FY3yLo', 'YEvb6MmyJtM'];
// wnVe7FY3yLo "JKP Constable PET/PST Jammu Day 2" -> Likely VIDEO
// YEvb6MmyJtM -> Let's see

(async () => {
    for (const id of ids) {
        await checkIsShort(id);
        console.log('---');
    }
})();
