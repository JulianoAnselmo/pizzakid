/**
 * seed-firestore.js
 * Popula restaurants/pizza-kid/data/{businessInfo,cardapio,promocoes}
 * em cardapio-admin-prod a partir dos fallbacks locais.
 *
 * Uso: node scripts/seed-firestore.js
 * Requer: C:/dev/cardapio-admin/serviceAccountProd.json
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const admin = require('firebase-admin');

const SLUG = 'pizza-kid';
const SERVICE_ACCOUNT_PATH = path.resolve('C:/dev/cardapio-admin/serviceAccountProd.json');

admin.initializeApp({
  credential: admin.credential.cert(require(SERVICE_ACCOUNT_PATH)),
});
const db = admin.firestore();

// Carrega fallbacks locais num contexto VM (eles usam `var` global + window.*)
const ctx = vm.createContext({ window: {}, console });
for (const rel of ['../data/site.js', '../data/menu.js']) {
  const code = fs.readFileSync(path.resolve(__dirname, rel), 'utf8');
  vm.runInContext(code, ctx, { filename: rel });
}

const businessInfo = ctx.businessInfoData || ctx.window.businessInfoData;
const cardapio = ctx.window.menuData || ctx.menuData;
const promocoes = ctx.promocoesData || ctx.window.promocoesData;

if (!businessInfo || !cardapio || !promocoes) {
  console.error('Fallbacks locais não carregados. Abortando.');
  console.error({ businessInfo: !!businessInfo, cardapio: !!cardapio, promocoes: !!promocoes });
  process.exit(1);
}

const FORCE = process.argv.includes('--force');

async function seed() {
  const updatedAt = new Date().toISOString();
  const docs = [
    ['businessInfo', businessInfo],
    ['cardapio', cardapio],
    ['promocoes', promocoes],
  ];

  // Proteção: se qualquer doc já existir em produção, exigir --force
  if (!FORCE) {
    for (const [docId] of docs) {
      const snap = await db.doc(`restaurants/${SLUG}/data/${docId}`).get();
      if (snap.exists) {
        console.error(
          '\n⚠️  Documento já existe: restaurants/' + SLUG + '/data/' + docId +
          '\nO seed sobrescreve qualquer edição feita no admin.' +
          '\nSe tem certeza, rode com --force:' +
          '\n  node scripts/seed-firestore.js --force\n'
        );
        process.exit(2);
      }
    }
  }

  // Garante que o doc pai restaurants/pizza-kid existe com os metadados mínimos
  await db.doc(`restaurants/${SLUG}`).set(
    { slug: SLUG, name: businessInfo.name, type: 'restaurante' },
    { merge: true }
  );
  console.log('✓ restaurants/' + SLUG + ' (meta)');

  for (const [docId, content] of docs) {
    await db.doc(`restaurants/${SLUG}/data/${docId}`).set({ content, updatedAt });
    console.log('✓ restaurants/' + SLUG + '/data/' + docId);
  }

  console.log('\nSeed concluído' + (FORCE ? ' (--force)' : '') + '.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Falhou:', err);
  process.exit(1);
});
