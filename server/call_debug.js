import axios from 'axios';

const debug = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/public/debug-data');
        console.log("DEBUG RESPONSE:");
        console.log(JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error(e.message);
    }
};

debug();
