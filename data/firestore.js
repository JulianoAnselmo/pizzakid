/**
 * firestore.js — Camada de integracao com Cardapio Admin (Firestore REST API)
 *
 * Busca cardapio, businessInfo e promocoes do Firestore.
 * Se falhar, usa dados locais (menu.js / site.js) como fallback.
 */
(function () {
  var SLUG = 'pizza-kid';
  var PROJECT = 'cardapio-admin-prod';
  var BASE = 'https://firestore.googleapis.com/v1/projects/' + PROJECT
           + '/databases/(default)/documents/restaurants/' + SLUG + '/data/';

  // ── localStorage cache (stale-while-revalidate) ──
  var TTL_HOUR = 60 * 60 * 1000;
  var CACHE_KEYS = {
    cardapio: 'pk_menu_cache_v1',
    businessInfo: 'pk_business_cache_v1',
    promocoes: 'pk_promos_cache_v1'
  };
  function cacheGet(key, ttl) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || (Date.now() - obj.t) > ttl) return null;
      return obj.d;
    } catch(e) { return null; }
  }
  function cacheSet(key, data) {
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch(e) {}
  }

  function parseFirestoreValue(val) {
    if (val.stringValue  !== undefined) return val.stringValue;
    if (val.booleanValue !== undefined) return val.booleanValue;
    if (val.integerValue !== undefined) return Number(val.integerValue);
    if (val.doubleValue  !== undefined) return val.doubleValue;
    if (val.nullValue    !== undefined) return null;
    if (val.arrayValue)  return (val.arrayValue.values || []).map(parseFirestoreValue);
    if (val.mapValue) {
      var obj = {}, fields = val.mapValue.fields || {};
      for (var k in fields) obj[k] = parseFirestoreValue(fields[k]);
      return obj;
    }
    return val;
  }

  function fetchFirestore(docName) {
    return fetch(BASE + docName)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (doc) {
        if (doc.fields && doc.fields.content) {
          return parseFirestoreValue(doc.fields.content);
        }
        return null;
      });
  }

  // Expor para uso global
  window.fetchFirestore = fetchFirestore;

  // Nao buscar se aberto como file:// (sem servidor)
  var isLocal = location.protocol === 'file:';
  if (isLocal) return;

  // ── Cardapio (cache → render → revalidate) ──
  var cachedMenu = cacheGet(CACHE_KEYS.cardapio, TTL_HOUR);
  if (cachedMenu && Array.isArray(cachedMenu) && cachedMenu.length > 0) {
    window.menuData = cachedMenu;
    if (typeof window.createMenu === 'function') window.createMenu();
  }
  fetchFirestore('cardapio')
    .then(function (data) {
      if (data && Array.isArray(data) && data.length > 0) {
        window.menuData = data;
        cacheSet(CACHE_KEYS.cardapio, data);
        if (typeof window.createMenu === 'function') window.createMenu();
      }
    })
    .catch(function (err) {
      console.warn('[firestore] Cardapio fallback local:', err.message);
    });

  // ── BusinessInfo (cache → apply → revalidate) ──
  var cachedBusiness = cacheGet(CACHE_KEYS.businessInfo, TTL_HOUR);
  if (cachedBusiness && typeof window.aplicarBusinessInfo === 'function') {
    window.aplicarBusinessInfo(cachedBusiness);
  }
  fetchFirestore('businessInfo')
    .then(function (data) {
      if (data) {
        cacheSet(CACHE_KEYS.businessInfo, data);
        if (typeof window.aplicarBusinessInfo === 'function') {
          window.aplicarBusinessInfo(data);
        }
      }
    })
    .catch(function (err) {
      console.warn('[firestore] BusinessInfo fallback local:', err.message);
    });

  // ── Promocoes (cache → render → revalidate) ──
  var cachedPromos = cacheGet(CACHE_KEYS.promocoes, TTL_HOUR);
  if (cachedPromos && typeof window.renderPromocoes === 'function') {
    window.renderPromocoes(cachedPromos);
  }
  fetchFirestore('promocoes')
    .then(function (data) {
      if (data) {
        cacheSet(CACHE_KEYS.promocoes, data);
        if (typeof window.renderPromocoes === 'function') {
          window.renderPromocoes(data);
        }
      }
    })
    .catch(function (err) {
      console.warn('[firestore] Promocoes fallback local:', err.message);
    });
})();
