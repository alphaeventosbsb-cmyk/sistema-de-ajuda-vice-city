import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

https.get('https://spawnvice.netlify.app/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const carsMatch = data.match(/const cars = (\[[\s\S]*?\]);/);
    const itensMatch = data.match(/const itens = (\[[\s\S]*?\]);/);
    
    if (carsMatch && itensMatch) {
      const cars = eval(carsMatch[1]);
      const itens = eval(itensMatch[1]);
      
      const spawnData = {
        cars,
        itens
      };
      
      const dir = path.join(__dirname, '../../data');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'spawn.json'), JSON.stringify(spawnData, null, 2));
      console.log('Spawn data saved successfully to /data/spawn.json');
    } else {
      console.log('Could not find arrays in HTML');
    }
  });
});
