import fs from 'fs';

const content = `PORT=5000
MONGODB_URL=mongodb+srv://raghu:raghu41@youtube.nscdniz.mongodb.net/Attainers
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
`;

fs.writeFileSync('.env', content, { encoding: 'utf8' });
console.log(".env updated to use Attainers database");
