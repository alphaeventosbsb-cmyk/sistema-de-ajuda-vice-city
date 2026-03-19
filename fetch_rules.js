const https = require('https');
const fs = require('fs');

const baseUrl = 'https://www.regraslotusgroup.com.br';
const paths = [
  '/vice/geral/introducao',
  '/vice/geral/normas-do-discord',
  '/vice/geral/regras-gerais',
  '/vice/geral/punicoes',
  '/vice/geral/areas-e-zonas',
  '/vice/geral/veiculos',
  '/vice/geral/empregos-legais',
  '/vice/geral/vips-e-doacoes',
  '/vice/ilegal/regras-pista',
  '/vice/ilegal/regras-sequestro',
  '/vice/ilegal/regras-faccoes',
  '/vice/ilegal/uniformes',
  '/vice/ilegal/regras-acoes-marcadas',
  '/vice/ilegal/acoes-marcadas',
  '/vice/ilegal/acoes-blipadas',
  '/vice/dominacoes/regras-basicas',
  '/vice/dominacoes/punicoes',
  '/vice/dominacoes/dominacao-geral',
  '/vice/dominacoes/pistola',
  '/vice/dominacoes/armas',
  '/vice/dominacoes/municao',
  '/vice/dominacoes/lavagem',
  '/vice/dominacoes/drogas-desmanche',
  '/vice/policia/regras-policia',
  '/vice/policia/instrucoes-de-abordagem',
  '/vice/policia/tipos-de-abordagem',
  '/vice/policia/investigacoes',
  '/vice/policia/rondas-ostensivas',
  '/vice/policia/incursao',
  '/vice/policia/pacificacao',
  '/vice/policia/acoes-de-fuga'
];

async function fetchPage(path) {
  return new Promise((resolve, reject) => {
    https.get(baseUrl + path, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        // Extract text from <article class="page-content">...</article>
        const match = data.match(/<article class="page-content"[^>]*>([\s\S]*?)<\/article>/);
        if (match) {
          // simple html to text
          let text = match[1]
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          resolve({ path, text });
        } else {
          resolve({ path, text: '' });
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const allRules = [];
  for (const path of paths) {
    console.log('Fetching', path);
    const result = await fetchPage(path);
    allRules.push(result);
  }
  
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
  }
  fs.writeFileSync('./data/rules.json', JSON.stringify(allRules, null, 2));
  console.log('Done!');
}

main();
