const fs = require('fs');
const path = require('path');

function replaceInFiles(dir, searchStr, replaceStr) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath, searchStr, replaceStr);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(searchStr)) {
                content = content.split(searchStr).join(replaceStr);
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Replaced in ${fullPath}`);
            }
        }
    }
}

replaceInFiles('./src', 'http://localhost:3000', 'https://cargolink-489712.el.r.appspot.com');
console.log('Replacement complete.');
