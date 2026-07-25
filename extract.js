const fs = require('fs');
const content = fs.readFileSync('D:/myntra/NewMyntra/in.svg', 'utf8');

const pathTags = content.match(/<path[^>]*>/gi) || [];
const data = pathTags.map(tag => {
  const dMatch = tag.match(/d="([^"]*)"/i);
  const idMatch = tag.match(/id="([^"]*)"/i);
  const nameMatch = tag.match(/name="([^"]*)"/i);
  return {
    d: dMatch ? dMatch[1] : null,
    id: idMatch ? idMatch[1] : null,
    name: nameMatch ? nameMatch[1] : null
  };
}).filter(p => p.id && p.name);

fs.writeFileSync('D:/myntra/NewMyntra/svg_data.json', JSON.stringify(data, null, 2));
console.log('Extracted ' + data.length + ' paths');
