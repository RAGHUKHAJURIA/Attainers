import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/public';

const testEndpoints = async () => {
    const endpoints = [
        '/blogs',
        '/courses',
        '/news',
        '/pdfs',
        '/youtube',
        '/tables',
        '/updates',
        '/video-lectures',
        '/previous-papers',
        '/mock-tests'
    ];

    console.log("Testing API Endpoints...");

    for (const endpoint of endpoints) {
        try {
            const res = await axios.get(BASE_URL + endpoint);
            if (res.data.success || Array.isArray(res.data) || res.data.blogs || res.data.courses) {
                // Different controllers return different structures, but standard is usually { success: true, data: [...] }
                // or sometimes just the data.
                const count = getCount(res.data, endpoint);
                console.log(`✅ ${endpoint}: OK (${count} items)`);
            } else {
                console.error(`❌ ${endpoint}: Failed (Success flag missing or falsy)`);
                console.log("Response:", JSON.stringify(res.data).substring(0, 100));
            }
        } catch (error) {
            console.error(`❌ ${endpoint}: Error - ${error.message}`);
            if (error.response) {
                console.error(`   Status: ${error.response.status} ${error.response.statusText}`);
                console.error(`   Data: ${JSON.stringify(error.response.data)}`);
            }
        }
    }
};

const getCount = (data, endpoint) => {
    if (Array.isArray(data)) return data.length;
    if (data.blogs) return data.blogs.length;
    if (data.courses) return data.courses.length;
    if (data.news) return data.news.length;
    if (data.pdfs) return data.pdfs.length;
    if (data.videos) return data.videos.length;
    if (data.tables) return data.tables.length;
    if (data.updates) return data.updates.length;
    if (data.lectures) return data.lectures.length;
    if (data.papers) return data.papers.length;
    // MockTests controller might return array directly or object
    return "Unknown count";
}

testEndpoints();
