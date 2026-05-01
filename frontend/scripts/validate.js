const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const js = fs.readFileSync('js/app.js','utf8');

const screenRegex = /id="screen-([^"]+)"/g;
const htmlScreens = [];
let m;
while ((m = screenRegex.exec(html)) !== null) {
  htmlScreens.push(m[1]);
}
console.log('HTML screens:', htmlScreens);

const showScreenRegex = /showScreen\('([^']+)'/g;
const showScreens = new Set();
while ((m = showScreenRegex.exec(js)) !== null) {
  showScreens.add(m[1]);
}
console.log('JS showScreen calls:', [...showScreens]);

const getByIdRegex = /getElementById\('([^']+)'/g;
const domIds = new Set();
while ((m = getByIdRegex.exec(js)) !== null) {
  domIds.add(m[1]);
}
console.log('JS getElementById IDs:', [...domIds]);

const htmlIdRegex = /id="([^"]+)"/g;
const htmlIds = new Set();
while ((m = htmlIdRegex.exec(html)) !== null) {
  htmlIds.add(m[1]);
}
console.log('HTML IDs:', [...htmlIds]);