const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'middleware.ts');
try {
  fs.unlinkSync(target);
  console.log('SUCCESS: middleware.ts deleted');
} catch (e) {
  console.log('ERROR:', e.message);
}
