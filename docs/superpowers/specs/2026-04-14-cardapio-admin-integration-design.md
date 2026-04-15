# Design: Integrar Pizza Kid com Cardapio Admin

## Contexto

O site Pizza Kid (vanilla HTML/CSS/JS) usa dados de cardapio hardcoded em `data/menu.js`.
O objetivo e integra-lo com o sistema **Cardapio Admin** (React/Firebase), que gerencia
cardapios de restaurantes via Firestore. Slug: `pizza-kid`.

Os dados do cardapio real foram extraidos da API EatFood (`apionline.com.br:8443/v1/carganome/pizzakidtaquaritinga`) — 279 produtos em 15 categorias.

---

## Parte 1: Migracao de Dados (EatFood -> Firestore)

### Script `scripts/migrate-eatfood.js`

Execucao unica via Node.js. Le `pizzakid_eatfood_raw.json` e sobe no Firestore.

#### 1.1 Documento `cardapio`

Converte cada `tipo` do EatFood em uma aba:

```
EatFood tipo        -> Cardapio Admin tab
---
tipo.tipo           -> label (Title Case: "PIZZA BIGTREM" -> "Pizza Bigtrem")
tipo.id             -> id (slugify do label)
tipo.exibir === 'S' -> ativo: true
tipo.divisao        -> (metadado auxiliar, nao vai pro cardapio)

EatFood produto     -> Cardapio Admin item
---
produto.produto     -> nome (Title Case, limpar espacos duplos)
produto.descricao   -> desc
produto.valor       -> preco
produto.img         -> imagem
produto.exibir      -> ativo
produto.tags/marcadores -> tags (array, default [])
```

Cada `tipo` gera uma aba com uma unica categoria (titulo = label da aba).
Total: 15 abas, 279 itens.

As 15 categorias mantidas como abas:
1. Pizza Bigtrem (42 itens, R$139-159)
2. Pizza Redonda Promocao (9 itens, R$59.90)
3. Pizza Redonda Grande (31 itens, R$65-80)
4. Pizza Quadrada Promocao (9 itens, R$69.90)
5. Pizza Quadrada (34 itens, R$75-90)
6. Pizza Redonda Doce (5 itens, R$65-70)
7. Batata (25 itens, R$40-50)
8. Esfiha (36 itens, R$9.90-14.90)
9. Esfiha Doce (8 itens, R$9.90-15)
10. Sucos (10 itens, R$6-16)
11. Bebidas (27 itens, R$4-16)
12. Cervejas (14 itens, R$4-18)
13. Vinhos (2 itens, R$30)
14. Calzone (21 itens, R$80-90)
15. Promocao do Dia (6 itens, R$39.99)

#### 1.2 Documento `businessInfo`

Extraido do EatFood + dados existentes em `data/site.js`:

```js
{
  name: "Pizza Kid",
  city: "Taquaritinga - SP",
  slogan: "",
  tagline: "",
  whatsapp: "(16) 3252-6169",
  whatsappNumber: "551632526169",
  phone: "(16) 3252-6169",
  address: "R. Prudente de Moraes, 977",
  neighborhood: "Centro",
  cityState: "Taquaritinga - SP",
  cep: "15900-053",
  instagram: "https://www.instagram.com/pizzakidtaq",
  facebook: "",
  googleMapsLink: "",
  googleMapsEmbed: "",
  hours: {
    funcionamento: "Segunda a Domingo",
    jantar: "17h00 as 23h30",
    almoco: "",
    completo: "Seg 17h-23h | Ter-Sab 17h30-23h30 | Dom 17h30-23h30"
  }
}
```

#### 1.3 Documento `promocoes`

Estrutura vazia para preenchimento via admin:

```js
{
  domingo: [],
  segunda: [],
  terca: [],
  quarta: [],
  quinta: [],
  sexta: [],
  sabado: []
}
```

#### 1.4 Upload para Firestore

O Firestore exige autenticacao para escrita. Duas opcoes:

**Opcao A (Recomendada): Script com Firebase Admin SDK**
- Requer arquivo de service account (`serviceAccountKey.json`) do projeto `cardapio-admin-prod`
- Script usa `firebase-admin` para escrever diretamente
- Execucao: `node scripts/migrate-eatfood.js`

**Opcao B: Gerar JSON e importar pelo admin**
- Script gera arquivo JSON no formato cardapio-admin
- Usuario abre o admin, cola os dados manualmente
- Mais manual, mas nao precisa de service account

Endpoint: `restaurants/pizza-kid/data/{docName}`
Projeto: `cardapio-admin-prod`

---

## Parte 2: Adaptacao do Site

### 2.1 Novo arquivo: `data/firestore.js`

Responsabilidades:
- Configuracao: `SLUG = 'pizza-kid'`, `PROJECT = 'cardapio-admin-prod'`
- `parseFirestoreValue(val)` — parser do formato REST do Firestore
- `fetchFirestore(docName)` — fetch + parse do documento
- Logica de inicializacao:
  - Se `location.protocol !== 'file:'`: fetch dos 3 documentos em paralelo
  - Fallback: usa dados locais se fetch falhar
  - Nao bloqueia renderizacao — renderiza com dados locais primeiro, atualiza se Firestore retornar

### 2.2 Modificar: `data/menu.js`

Converter para formato cardapio-admin. Servira como fallback local.

Antes:
```js
window.menuData = [{
  id: "pizzas", label: "Pizzas",
  categories: [{ title: "...", items: [{ name, description, price }] }]
}]
```

Depois:
```js
window.menuData = [{
  id: "pizza-redonda-grande", label: "Pizza Redonda Grande", ativo: true,
  categorias: [{ titulo: "Pizza Redonda Grande", nota: "", ativo: true,
    itens: [{ nome: "...", desc: "...", preco: 65.00, imagem: "", ativo: true, tags: [] }]
  }]
}]
```

### 2.3 Modificar: `data/site.js`

Adaptar `promoDay` para formato `promocoes`:
```js
var promocoesData = {
  domingo: [], segunda: [], terca: [], quarta: [],
  quinta: [], sexta: [], sabado: []
};
```

Adicionar `businessInfoData` como fallback:
```js
var businessInfoData = {
  name: "Pizza Kid", whatsappNumber: "551632526169", ...
};
```

### 2.4 Modificar: `scripts/main.js`

#### createMenu()
- Campos: `tab.categorias`, `cat.itens`, `item.nome`, `item.desc`, `item.preco`, `item.imagem`
- Filtrar `ativo === false` em abas, categorias e itens
- Ordenar destaques primeiro por categoria:
  ```js
  function isDestaque(item) {
    return item.destaque === true ||
      (Array.isArray(item.tags) && item.tags.indexOf('destaque') !== -1);
  }
  itens.sort(function(a, b) { return (isDestaque(b)?1:0) - (isDestaque(a)?1:0); });
  ```
- Suporte a `item.imagem` no card do menu (se disponivel, exibir miniatura)

#### extractAllPizzas()
- Adaptar para novo formato: buscar `tab.categorias[].itens[]` onde tab eh pizza

#### openItemModal()
- Usar `item.nome`, `item.desc`, `item.preco`
- Detectar se eh pizza pelo ID da aba (contem "pizza")

#### Carrinho e WhatsApp
- `item.nome` em vez de `item.name`
- `item.preco` em vez de `item.price`
- Numero WhatsApp do businessInfo

#### Nova funcao: aplicarBusinessInfo(info)
- Atualiza elementos do DOM por ID (WhatsApp, telefone, endereco, mapa, horarios)
- IDs necessarios no HTML:
  - `wa-float-btn` — botao flutuante WhatsApp
  - `contact-phone` — telefone na secao contato
  - `contact-address` — endereco
  - `contact-hours` — horarios
  - `contact-whatsapp-link` — link WhatsApp contato
  - `contact-instagram-link` — link Instagram
  - `contactMap` — iframe mapa

#### Nova funcao: renderPromocoes(data)
- Le o dia da semana atual
- Exibe promocoes do dia na barra de info ou secao dedicada

### 2.5 Modificar: `index.html`

Adicionar IDs nos elementos de contato para `aplicarBusinessInfo()`:
- Links WhatsApp, telefone, endereco, mapa, horarios, Instagram

Adicionar `<script src="data/firestore.js"></script>` antes de `main.js`.

Ordem dos scripts:
```html
<script src="data/site.js"></script>
<script src="data/menu.js"></script>
<script src="data/instagram.js"></script>
<script src="data/firestore.js"></script>
<script src="scripts/main.js"></script>
```

---

## Verificacao

### Teste local (file://)
- Abrir `index.html` diretamente → deve renderizar com dados locais (fallback)
- Sem erros no console

### Teste com servidor local
- `npx serve .` ou `python -m http.server`
- Deve fazer fetch do Firestore e renderizar dados remotos
- Verificar no Network tab que os 3 endpoints foram chamados
- Verificar que os dados do cardapio correspondem ao que esta no admin

### Teste de fallback
- Desconectar internet → deve renderizar com dados locais
- Verificar que o site nao trava

### Teste do admin
- Abrir cardapio-admin, acessar restaurante `pizza-kid`
- Editar um item (ex: mudar preco)
- Recarregar o site → deve refletir a mudanca

---

## Arquivos criticos

| Arquivo | Acao | Motivo |
|---------|------|--------|
| `scripts/migrate-eatfood.js` | Criar | Script de migracao EatFood -> Firestore |
| `data/firestore.js` | Criar | Fetch + parser Firestore |
| `data/menu.js` | Reescrever | Converter para formato cardapio-admin (fallback) |
| `data/site.js` | Modificar | Adicionar businessInfoData, adaptar promocoes |
| `scripts/main.js` | Modificar | createMenu(), extractAllPizzas(), modais, aplicarBusinessInfo() |
| `index.html` | Modificar | IDs nos elementos, script firestore.js |
| `pizzakid_eatfood_raw.json` | Existente | Dados brutos do EatFood (ja baixado) |
