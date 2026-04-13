# Pizza Selection Feature - Documentação Completa

## Overview
Sistema de seleção de pizzas com 2 sabores por pizza + finalização de pedido via WhatsApp.

---

## 🎯 Funcionalidades

### 1. Clique na Pizza
- Usuário clica em qualquer item do cardápio
- Se for **pizza** (nome contém "Pizza" e não é "Rodizio"), abre modal de seleção
- Se for outro item (batata, esfiha, bebida, etc.), adiciona direto ao carrinho

### 2. Modal de Seleção
- **Título**: Nome da pizza escolhida
- **Preço**: Exibe o preço em BRL
- **Grid de sabores**: Lista todas as pizzas disponíveis
- **Seleção**: Usuário clica em 2 sabores
- **Validação**: Só permite 2 sabores selecionados

### 3. Visual Feedback
- Botão selecionado muda de cor/border (vermelho)
- Mostra sabores selecionados em tempo real
- Botão "Adicionar ao pedido" fica desabilitado até 2 sabores

### 4. Remover Sabores
- Clique no "×" remove sabor selecionado
- Lista se atualiza automaticamente

### 5. Finalizar Pedido
- Clique em "Adicionar ao pedido" finaliza seleção
- Modal fecha
- Abre WhatsApp com mensagem pré-formatada

---

## 📱 UX Flow

```
1. Usuário vê cardápio
   ↓
2. Clica em uma pizza
   ↓
3. Modal abre com:
   - Nome da pizza
   - Preço
   - Lista de sabores
   ↓
4. Seleciona primeiro sabor
   (sabor fica destacado)
   ↓
5. Seleciona segundo sabor
   (ambos ficam destacados)
   (botão ativa)
   ↓
6. Clica "Adicionar ao pedido"
   (modal fecha)
   ↓
7. WhatsApp abre com:
   "Pizza [nome] - [Sabores: A + B] - R$ 52,90"
   ↓
8. Usuário confirma no WhatsApp
```

---

## 🎨 Visual Structure

### Modal HTML
```html
<div class="pizza-modal" id="pizzaModal">
  <div class="pizza-modal-content">
    <button class="modal-close">x</button>
    <h3>Nome da Pizza</h3>
    <p class="pizza-modal-price">R$ 52,90</p>
    <div class="pizza-flavors-grid">
      [Lista de botões de sabor]
    </div>
    <div class="pizza-selected">
      [Sabores selecionados]
    </div>
    <button class="btn btn-primary">Adicionar ao pedido</button>
  </div>
</div>
```

### CSS Classes
- `.pizza-modal` - Modal wrapper
- `.pizza-modal-content` - Conteúdo principal
- `.pizza-flavor-btn` - Botão de sabor
- `.pizza-flavor-btn.selected` - Sabor selecionado
- `.pizza-selected` - Container de sabores selecionados
- `.selected-item` - Item individual selecionado
- `.remove-flavor` - Botão para remover

---

## 🔧 JavaScript Implementation

### Variáveis Globais
```javascript
var cart = [];              // Itens no carrinho
var currentPizza = null;    // Pizza sendo selecionada
var selectedFlavors = [];   // 2 sabores selecionados
```

### Funções Principais

#### `openPizzaModal(item)`
- Abre modal de seleção
- Carrega nome e preço do item
- Popula lista de todos as pizzas como opções de sabor
- Adiciona event listeners aos botões

#### `updateSelectedFlavors()`
- Atualiza visual dos sabores selecionados
- Ativa/desativa botão de adicionar
- Mostra/esconde segundo sabor

#### `addToCart(item, flavors)`
- Adiciona item ao carrinho
- Inclui sabores selecionados
- Fecha modal
- Abre WhatsApp

#### `finishOrder()`
- Formata mensagem com todos items do carrinho
- Calcula total
- Abre WhatsApp com URL pré-formatada
- Limpa carrinho

#### `closePizzaModal()`
- Fecha modal
- Reseta estado (pizza e sabores)

---

## 📊 Menu Data Structure

### Pizza Item
```javascript
{
  name: "Calabresa Especial",
  description: "...",
  price: 52.9,
  badge: "Destaque",      // Opcional
  notes: "..."             // Opcional
}
```

### Pizzas Disponíveis para Seleção
- Pizzas salgadas (seção 1)
- Pizzas doces (seção 2)
- Rodizio excluído (verifica !nome.includes("Rodizio"))

---

## 💬 WhatsApp Message Format

### Exemplo com 1 Pizza de 2 sabores
```
Pizza Kid - Novo Pedido:

1. Calabresa Especial - R$ 52,90 (Sabores: Calabresa + Moda da Casa)

Total: R$ 52,90

Por favor, confirme o pedido.
```

### Exemplo com múltiplos items
```
Pizza Kid - Novo Pedido:

1. Calabresa Especial - R$ 52,90 (Sabores: Calabresa + Portuguesa)
2. Batata Cheddar e Bacon - R$ 34,90
3. Refrigerante lata 350ml - R$ 6,50

Total: R$ 94,30

Por favor, confirme o pedido.
```

---

## 🎯 Event Listeners

### Menu Items
```javascript
panels.addEventListener("click", function (event) {
  var item = event.target.closest(".menu-item");
  // Se pizza → openPizzaModal()
  // Se outro → addToCart()
});
```

### Pizza Modal
- Botão "Adicionar ao pedido" → `addToCart(currentPizza, selectedFlavors)`
- Botão fechar (x) → `closePizzaModal()`
- Clique fora (background) → `closePizzaModal()`
- Tecla Escape → `closePizzaModal()`

### Sabores Selecionados
- Clique no "×" → Remove sabor → `updateSelectedFlavors()`
- Clique em sabor → Toggle seleção (max 2)

---

## ✅ Responsiveness

### Desktop (1200px+)
- Modal centralizado
- Grid de sabores em 1 coluna
- Todos os textos visíveis
- Scroll interno se necessário

### Tablet (860-1100px)
- Modal adaptado
- Grid compacto
- Botões touch-friendly

### Mobile (< 680px)
- Modal full-width com padding
- Grid em 1 coluna
- Botões maiores (touch targets)
- Scroll vertical para sabores

---

## 🔒 Validações

1. **Apenas 2 sabores**: Após 2 seleções, novos cliques são ignorados
2. **Botão desabilitado**: Ativa apenas com 2 sabores selecionados
3. **Remover sabor**: Atualiza estado e botão
4. **Fechar modal**: Limpa estado completamente

---

## 🚀 Performance

- Sem requisições HTTP extras
- Lógica de seleção em memória
- WhatsApp abre em nova aba (não bloqueia)
- Carrinho persiste até finalizar

---

## 🐛 Edge Cases Tratados

1. **Usuário seleciona 2 sabores iguais** - Permitido (mesma pizza 2x)
2. **Usuário clica fora modal** - Fecha sem salvar
3. **Usuário pressiona Escape** - Fecha sem salvar
4. **Usuário fecha WhatsApp** - Carrinho mantém items (usuário pode continuar)
5. **Pizza com nome "Rodizio"** - Não abre modal (vai direto para carrinho)

---

## 📋 Files Modified

1. **index.html**
   - Added `<div class="pizza-modal">`

2. **styles/main.css**
   - Added `.pizza-modal` and related classes
   - Added `.pizza-flavor-btn` styling
   - Added `.pizza-selected` styling
   - Responsive queries included

3. **scripts/main.js**
   - Complete rewrite with pizza selection logic
   - New functions: `openPizzaModal()`, `updateSelectedFlavors()`, `addToCart()`, `finishOrder()`, `closePizzaModal()`
   - Modified `createMenu()` to add click handlers
   - Updated event listeners

4. **data/menu.js**
   - Removed all "Mais pedido" badges

---

## 🎨 Color Scheme

- **Buttons normal**: Light red background (#d62828 com 4% opacity)
- **Buttons hover**: Darker red background (8% opacity)
- **Buttons selected**: Red gradient with red border
- **Modal background**: Dark semi-transparent (rgba(8,6,6, 0.88))
- **Close button**: Light red background on hover

---

## ✨ Future Enhancements

1. Persistência do carrinho (LocalStorage)
2. Editar items no carrinho antes de enviar
3. Mostrar número de items no ícone de carrinho
4. Histórico de pedidos
5. Cupons/descontos
6. Informações de entrega (CEP)

---

**Status**: ✅ Complete and Ready
**Version**: 1.0
**Last Updated**: April 13, 2026
