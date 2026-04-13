(function () {
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav a[data-section]");
  var header = document.getElementById("header");
  var nav = document.getElementById("nav");
  var mobileToggle = document.getElementById("mobileToggle");
  var floatWpp = document.getElementById("floatWpp");

  var cart = [];
  var currentItem = null;
  var allPizzas = [];

  function brl(value) {
    if (typeof value !== "number") return "";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function extractAllPizzas() {
    allPizzas = [];
    if (!window.menuData) return;
    menuData.forEach(function(section) {
      if (section.id === "pizzas") {
        section.categories.forEach(function(category) {
          category.items.forEach(function(item) {
            allPizzas.push(item);
          });
        });
      }
    });

    var select = document.getElementById("secondFlavorSelect");
    if (select) {
      select.innerHTML = '<option value="">Selecione a outra metade...</option>' + 
        allPizzas.map(function(p) { 
          return '<option value="' + p.name.replace(/"/g, '&quot;') + '" data-price="' + p.price + '">' + p.name + '</option>'; 
        }).join("");
    }
  }

  function createMenu() {
    var tabs = document.getElementById("menuTabs");
    var panels = document.getElementById("menuPanels");
    if (!tabs || !panels || !window.menuData) return;

    extractAllPizzas();

    tabs.innerHTML = menuData.map(function (section, index) {
      return '<button class="menu-tab' + (index === 0 ? ' active' : '') + '" data-tab="' + section.id + '">' + section.label + '</button>';
    }).join("");

    panels.innerHTML = menuData.map(function (section, sIdx) {
      return (
        '<div class="menu-panel' + (sIdx === 0 ? ' active' : '') + '" data-panel="' + section.id + '">' +
          section.categories.map(function (category, cIdx) {
            return (
              '<div class="menu-section">' +
                '<h3 class="menu-section-title">' + category.title + '</h3>' +
                '<div class="menu-grid">' +
                  category.items.map(function (item, iIdx) {
                    return (
                      '<article class="menu-item reveal" data-sidx="'+sIdx+'" data-cidx="'+cIdx+'" data-iidx="'+iIdx+'">' +
                        '<div class="menu-item-top">' +
                          '<h4>' + item.name + '</h4>' +
                          (item.price ? '<span class="menu-price">' + brl(item.price) + '</span>' : '') +
                        '</div>' +
                        '<p>' + (item.description || '') + '</p>' +
                      '</article>'
                    );
                  }).join("") +
                '</div>' +
              '</div>'
            );
          }).join("") +
        '</div>'
      );
    }).join("");

    tabs.querySelectorAll(".menu-tab").forEach(function (button) {
      button.addEventListener("click", function () {
        tabs.querySelectorAll(".menu-tab").forEach(function (tab) { tab.classList.remove("active"); });
        panels.querySelectorAll(".menu-panel").forEach(function (panel) { panel.classList.remove("active"); });
        button.classList.add("active");
        var target = panels.querySelector('[data-panel="' + button.dataset.tab + '"]');
        if (target) target.classList.add("active");
        setTimeout(initReveal, 10);
      });
    });

    panels.addEventListener("click", function (event) {
      var itemNode = event.target.closest(".menu-item");
      if (!itemNode) return;
      
      var sIdx = itemNode.dataset.sidx;
      var cIdx = itemNode.dataset.cidx;
      var iIdx = itemNode.dataset.iidx;
      var itemData = menuData[sIdx].categories[cIdx].items[iIdx];
      var sectionId = menuData[sIdx].id;
      
      openItemModal(itemData, sectionId);
    });

    document.querySelectorAll('.btn-promo').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var pName = this.dataset.name;
        var pPrice = parseFloat(this.dataset.price);
        var pPizza = this.dataset.ispizza === "true";

        var itemData = {
          name: pName,
          price: pPrice,
          description: "Promoção Especial. Se for pizza, escolha o tamanho e sabor nas observações se necessário.",
          isPromo: true
        };

        openItemModal(itemData, pPizza ? "pizzas" : "promo");
      });
    });
  }

  // --- MODAL DE PRODUTO ---
  function openItemModal(itemData, sectionId) {
    currentItem = itemData;
    document.getElementById('modalPizzaName').innerText = itemData.name;
    document.getElementById('modalPizzaDesc').innerText = itemData.description || 'Preparado com ingredientes selecionados.';
    
    var isPizza = sectionId === "pizzas";

    document.getElementById('pizzaSizeWrapper').style.display = isPizza ? 'block' : 'none';
    document.getElementById('halfAndHalfWrapper').style.display = isPizza ? 'block' : 'none';
    
    var check = document.getElementById('halfAndHalfCheck');
    if(check) check.checked = false;
    document.getElementById('secondFlavorContainer').style.display = 'none';
    document.getElementById('secondFlavorSelect').value = '';
    document.getElementById('pizzaNotes').value = '';
    
    updateModalPrice();
    
    document.getElementById('pizzaModal').classList.add('active');
    document.body.style.overflow = "hidden";
  }

  function updateModalPrice() {
    var price = currentItem.price || 0;
    var check = document.getElementById('halfAndHalfCheck');
    
    if (check && check.checked && !currentItem.isPromo) {
      var select = document.getElementById('secondFlavorSelect');
      var selectedOption = select.options[select.selectedIndex];
      if (selectedOption && selectedOption.value) {
        var secondPrice = parseFloat(selectedOption.getAttribute('data-price')) || 0;
        price = Math.max(price, secondPrice);
      }
    }
    document.getElementById('modalPrice').innerText = brl(price);
    return price;
  }

  var halfAndHalfCheck = document.getElementById('halfAndHalfCheck');
  if(halfAndHalfCheck) {
    halfAndHalfCheck.addEventListener('change', function() {
      document.getElementById('secondFlavorContainer').style.display = this.checked ? 'block' : 'none';
      updateModalPrice();
    });
  }

  var secondFlavorSelect = document.getElementById('secondFlavorSelect');
  if(secondFlavorSelect) {
    secondFlavorSelect.addEventListener('change', updateModalPrice);
  }

  var addToCartBtn = document.getElementById('addToCartBtn');
  if(addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      var finalPrice = updateModalPrice();
      var notes = document.getElementById('pizzaNotes').value;
      var isPizza = document.getElementById('halfAndHalfWrapper').style.display !== 'none';
      var finalName = currentItem.name;
      
      if (isPizza) {
        var size = document.getElementById('pizzaSize').value;
        var check = document.getElementById('halfAndHalfCheck');
        var isHalf = check ? check.checked : false;
        var secondFlavor = document.getElementById('secondFlavorSelect').value;
        
        if (isHalf && secondFlavor) {
          finalName = "Meio " + currentItem.name + " / Meio " + secondFlavor;
        }
        finalName += " (Tam: " + size + ")";
      }

      cart.push({ name: finalName, price: finalPrice, notes: notes });
      closeModal("pizzaModal");
      updateCartUI();
    });
  }

  function updateCartUI() {
    var floatingCart = document.getElementById('floatingCart');
    if (cart.length > 0) {
      floatingCart.style.display = 'flex';
      document.getElementById('cartCount').innerText = cart.length;
      var total = cart.reduce(function(acc, item) { return acc + item.price; }, 0);
      document.getElementById('cartTotalDisplay').innerText = brl(total);
      if(floatWpp) floatWpp.classList.add('lifted');
    } else {
      floatingCart.style.display = 'none';
      if(floatWpp) floatWpp.classList.remove('lifted');
    }
  }

  // --- MODAL DO CARRINHO (FINALIZAR COM FORMULÁRIO) ---
  var openCartBtn = document.getElementById('openCartBtn');
  if(openCartBtn) {
    openCartBtn.addEventListener('click', function() {
      if(cart.length === 0) return;
      renderCartModal();
      document.getElementById('cartModal').classList.add('active');
      document.body.style.overflow = "hidden";
    });
  }

  function renderCartModal() {
    var list = document.getElementById('cartItemsList');
    list.innerHTML = "";
    var subtotal = 0;

    cart.forEach(function(item, index) {
      subtotal += item.price;
      list.innerHTML += `
        <div class="cart-item-row">
          <div class="cart-item-info">
            <strong>${item.name}</strong>
            ${item.notes ? `<span>Obs: ${item.notes}</span>` : ''}
            <span class="remove-item" onclick="removeItem(${index})">Remover item</span>
          </div>
          <div class="cart-item-price">${brl(item.price)}</div>
        </div>
      `;
    });

    updateCartTotals(subtotal);
  }

  function updateCartTotals(subtotal) {
    var radioDelivery = document.querySelector('input[name="deliveryOption"]:checked');
    var isDelivery = radioDelivery && radioDelivery.value === 'delivery';
    var fee = isDelivery ? 7.00 : 0.00;
    var finalTotal = subtotal + fee;

    document.getElementById('cartSubtotalValue').innerText = brl(subtotal);
    document.getElementById('cartFeeValue').innerText = brl(fee);
    document.getElementById('cartFinalTotal').innerText = brl(finalTotal);
    
    // Mostra/Esconde Campo de Endereço dependendo se é entrega
    document.getElementById('addressFieldWrapper').style.display = isDelivery ? 'block' : 'none';
  }

  // Controle de Entrega/Retirada
  document.querySelectorAll('input[name="deliveryOption"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      var subtotal = cart.reduce(function(acc, item) { return acc + item.price; }, 0);
      updateCartTotals(subtotal);
    });
  });

  // Controle de Troco (Se Dinheiro)
  var paymentMethodSelect = document.getElementById('paymentMethod');
  if(paymentMethodSelect) {
    paymentMethodSelect.addEventListener('change', function() {
      var changeWrapper = document.getElementById('changeWrapper');
      if (this.value === 'Dinheiro') {
        changeWrapper.style.display = 'block';
      } else {
        changeWrapper.style.display = 'none';
        document.getElementById('cashChange').value = '';
      }
    });
  }

  window.removeItem = function(index) {
    cart.splice(index, 1);
    if(cart.length === 0) {
      closeModal("cartModal");
    } else {
      renderCartModal();
    }
    updateCartUI();
  }

  // Envio para WhatsApp com Form Validação
  var sendOrderWppBtn = document.getElementById('sendOrderWppBtn');
  if(sendOrderWppBtn) {
    sendOrderWppBtn.addEventListener('click', function() {
      var radioDelivery = document.querySelector('input[name="deliveryOption"]:checked');
      var isDelivery = radioDelivery && radioDelivery.value === 'delivery';
      
      var cName = document.getElementById('customerName').value.trim();
      var cAddress = document.getElementById('customerAddress').value.trim();
      var cPayment = document.getElementById('paymentMethod').value;
      var cChange = document.getElementById('cashChange').value.trim();

      // Validação Simples
      if(!cName) {
        alert("Por favor, informe seu nome.");
        document.getElementById('customerName').focus();
        return;
      }
      if(isDelivery && !cAddress) {
        alert("Por favor, informe o endereço de entrega completo.");
        document.getElementById('customerAddress').focus();
        return;
      }

      var fee = isDelivery ? 7.00 : 0.00;
      var subtotal = cart.reduce(function(acc, item) { return acc + item.price; }, 0);
      var total = subtotal + fee;

      // Montando a mensagem para o Zap
      var message = "🍕 *NOVO PEDIDO - PIZZA KID* 🍕\n\n";
      
      message += "👤 *Nome:* " + cName + "\n";
      if(isDelivery) {
        message += "🛵 *Tipo:* Entrega\n";
        message += "📍 *Endereço:* " + cAddress + "\n";
      } else {
        message += "🏪 *Tipo:* Retirar no Balcão\n";
      }
      
      message += "💳 *Pagamento:* " + cPayment + "\n";
      if(cPayment === 'Dinheiro' && cChange) {
        message += "💵 *Troco para:* R$ " + cChange + "\n";
      }

      message += "\n📋 *ITENS DO PEDIDO:*\n";
      cart.forEach(function(item, index) {
        message += "*" + (index + 1) + ". " + item.name + "* - " + brl(item.price) + "\n";
        if (item.notes) message += "   _Obs: " + item.notes + "_\n";
      });

      message += "\n➖➖➖➖➖➖➖➖\n";
      message += "Subtotal: " + brl(subtotal) + "\n";
      if(isDelivery) message += "Taxa de Entrega: " + brl(fee) + "\n";
      message += "💰 *TOTAL A PAGAR: " + brl(total) + "*\n";
      message += "➖➖➖➖➖➖➖➖\n";

      var whatsappUrl = "https://wa.me/551632526169?text=" + encodeURIComponent(message);
      window.open(whatsappUrl, "_blank");
    });
  }

  // --- CONTROLES GLOBAIS ---
  function closeModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".close-modal, .btn-close").forEach(function(btn) {
    btn.addEventListener("click", function() {
      closeModal("pizzaModal");
      closeModal("cartModal");
    });
  });

  document.querySelectorAll(".modal-overlay").forEach(function(overlay) {
    overlay.addEventListener("click", function(e) {
      if(e.target === this) {
        closeModal("pizzaModal");
        closeModal("cartModal");
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal("pizzaModal");
      closeModal("cartModal");
    }
  });

  function initReveal() {
    var items = document.querySelectorAll(".reveal:not(.visible)");
    if (!window.IntersectionObserver) {
      items.forEach(function(item){ item.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    items.forEach(function (item) { observer.observe(item); });
  }

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 20);
    var current = window.scrollY + 150;
    sections.forEach(function (section) {
      if (current >= section.offsetTop && current < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.dataset.section === section.id);
        });
      }
    });
  }

  mobileToggle.addEventListener("click", function () {
    mobileToggle.classList.toggle("active");
    nav.classList.toggle("mobile-open");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("mobile-open");
      mobileToggle.classList.remove("active");
    });
  });

  createMenu();
  initReveal();
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();