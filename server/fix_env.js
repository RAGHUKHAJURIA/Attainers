import fs from 'fs';

const content = `PORT=5000
MONGODB_URL=mongodb+srv://raghu:raghu41@youtube.nscdniz.mongodb.net/youtube
`;

fs.writeFileSync('.env', content, { encoding: 'utf8' });
console.log(".env fixed with UTF-8 encoding");
