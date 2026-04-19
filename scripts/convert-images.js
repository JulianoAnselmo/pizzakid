// Script one-shot para gerar versões WebP otimizadas + JPGs comprimidos.
// Roda com: node scripts/convert-images.js
// Requer: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'assets', 'imagens');
const files = ['fachada.jpg', 'pista-pizza.jpg', 'comida-boteco.jpg'];

async function process() {
  for (const f of files) {
    const input = path.join(dir, f);
    if (!fs.existsSync(input)) {
      console.log('SKIP (não existe):', f);
      continue;
    }
    const base = f.replace(/\.jpg$/i, '');
    const webpOut = path.join(dir, base + '.webp');
    const jpgOut = path.join(dir, f); // sobrescreve o JPG com versão comprimida

    // Gera WebP
    const webpInfo = await sharp(input)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(webpOut);

    // Recomprime o JPG (qualidade 75, max 1400px)
    const jpgBuf = await sharp(input)
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(jpgOut, jpgBuf);
    const jpgSize = fs.statSync(jpgOut).size;

    console.log(f, '→ WebP:', (webpInfo.size / 1024).toFixed(0) + 'KB', '| JPG:', (jpgSize / 1024).toFixed(0) + 'KB');
  }

  // Gera ícones PWA a partir do logo
  const logo = path.join(dir, 'logo.png');
  if (fs.existsSync(logo)) {
    await sharp(logo)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(dir, 'logo-192.png'));
    await sharp(logo)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(path.join(dir, 'logo-512.png'));
    console.log('Ícones PWA gerados: logo-192.png, logo-512.png');
  }
}

process().catch(function(e) { console.error('Erro:', e.message); process.exit(1); });
