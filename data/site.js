var siteData = {
  promoDay: {
    domingo: [{ text: "Rodízio de Pizza — R$ 60 por pessoa, Coca 1L à vontade", highlight: true }],
    segunda: [{ text: "Rodízio de Pizza — R$ 60 por pessoa, Coca 1L à vontade", highlight: true }],
    terca: [{ text: "Terça Maluca — Pizza G por R$ 39,90 (só delivery)" }],
    quarta: [{ text: "Quarta Maluca — Rodízio por R$ 49,90 com Coca 1L à vontade", highlight: true }],
    quinta: [{ text: "Rodízio de Pizza — R$ 60 por pessoa, Coca 1L à vontade", highlight: true }],
    sexta: [{ text: "Rodízio Premium — Pizzas, massas e boteco · R$ 65", highlight: true }],
    sabado: [{ text: "Rodízio Premium — Pizzas, massas e boteco · R$ 65", highlight: true }]
  },
  infoBar: [
    { label: "Faixa de preco", value: "R$ 40-65" },
    { label: "Especialidade", value: "Rodízio invertido" },
    { label: "Ambiente", value: "Familiar + Área Kids gratuita" },
    { label: "Destaque", value: "Aniversariante não paga" }
  ],
  features: [
    {
      title: "Rodízio invertido",
      text: "Você se serve à vontade, no seu tempo. Pizzas salgadas, pizzas doces e Coca-Cola 1L liberada em todos os dias de rodízio.",
      tag: "Exclusivo",
      icon: "🔄"
    },
    {
      title: "Comida de boteco + massas",
      text: "Nas sextas, sábados e feriados o rodízio vem turbinado: porções de boteco, lasanha, rondeli e canelone inclusos.",
      tag: "Sex · Sáb · Feriados",
      icon: "🍝"
    },
    {
      title: "Área Kids gratuita",
      text: "Espaço separado com monitora, câmeras, fraldário e ar-condicionado. 100% grátis para os clientes do salão.",
      tag: "Família",
      icon: "🧸"
    },
    {
      title: "Aniversariante não paga",
      text: "No dia do seu aniversário você come de graça. Basta apresentar o RG e trazer 3 pagantes (inteira).",
      tag: "Promoção",
      icon: "🎂"
    },
    {
      title: "Pizzas doces e salgadas",
      text: "Chocolate derretido, frutas frescas, sabores que fecham a noite com perfeição. Pizza não é só comida, é experiência.",
      tag: "Para todos",
      icon: "🍫"
    },
    {
      title: "Batatas recheadas",
      text: "Crocantes, recheadas generosas, praticamente um prato. O complemento que faz as pessoas pedir mais e lembrar de você.",
      tag: "Diferencial",
      icon: "🥔"
    },
    {
      title: "Esfihas salgadas e doces",
      text: "Massa leve que derrete na boca, recheios intensos. Perfeita para entrada, acompanhamento ou quando bate aquela fome de nada específico.",
      tag: "Versátil",
      icon: "📦"
    },
    {
      title: "Delivery sem complicacao",
      text: "Peca pelo WhatsApp, receba em casa quente e pronta. Porque reunir familia nao precisa sair de pijama.",
      tag: "Pratico",
      icon: "📱"
    },
    {
      title: "Musica ao vivo",
      text: "Alguns sabados a noite fica ainda mais especial. Consulte a programacao e traga a galera para aproveitar.",
      tag: "Atmosfera",
      icon: "🎵"
    },
    {
      title: "Ambiente para familia",
      text: "Mesas confortaveis, clima que acolhe, atendimento direto. O lugar onde de verdade o povo de Taquaritinga gosta de estar.",
      tag: "Aconchego",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      title: "Mesas externas",
      text: "Pizza fumegante em mesas na rua, ar livre no centro, conversa boa. Nada mais perfeito do que isso.",
      tag: "Conforto",
      icon: "🌙"
    }
  ],
  gallery: [
    {
      title: "Pizza artesanal",
      caption: "Borda dourada, recheio generoso, feita para abrir o apetite.",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Mesa de pizza kid",
      caption: "Clima de encontro familia, amigos, conversa boa.",
      image: "https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Rodizio impecavel",
      caption: "Variedade continua, pizza sempre quente, experiencia completa.",
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Close apetitoso",
      caption: "Queijo derretido, borda crocante, details que fazem a diferenca.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Batata recheada",
      caption: "Complemento que e praticamente um prato. Crocante, recheada, irresistivel.",
      image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Noite de pizzaria",
      caption: "Luz quente, clima perfeito, lugar conhecido de Taquaritinga.",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  contact: [
    {
      label: "Endereco",
      value: "R. Prudente de Moraes, 977 - Centro, Taquaritinga - SP, 15900-053"
    },
    {
      label: "Telefone",
      value: "(16) 3252-6169"
    },
    {
      label: "Horario",
      value: "Delivery todos os dias 18h30-23h30 · Salão exceto terça"
    }
  ]
};

// Fallback para businessInfo (formato cardapio-admin)
var businessInfoData = {
  name: "Pizza Kid",
  city: "Taquaritinga - SP",
  slogan: "A melhor pizza da cidade",
  tagline: "Rodízio, delivery e Área Kids exclusiva",
  whatsapp: "(16) 3252-6169",
  whatsappNumber: "551632526169",
  phone: "(16) 3252-6169",
  address: "R. Prudente de Moraes, 977",
  neighborhood: "Centro",
  cityState: "Taquaritinga - SP",
  cep: "15900-053",
  instagram: "https://www.instagram.com/pizzakidtaq",
  facebook: "",
  googleMapsLink: "https://www.google.com/maps?q=R.+Prudente+de+Moraes,+977+-+Centro,+Taquaritinga+-+SP,+15900-053",
  googleMapsEmbed: "https://www.google.com/maps?q=R.%20Prudente%20de%20Moraes,%20977%20-%20Centro,%20Taquaritinga%20-%20SP,%2015900-053&output=embed",
  hours: {
    funcionamento: "Todos os dias",
    jantar: "18h30 às 23h30",
    almoco: "",
    completo: "Dom 18h30-23h30 | Seg 18h30-23h30 | Ter 18h30-23h30 | Qua 18h30-23h30 | Qui 18h30-23h30 | Sex 18h30-23h30 | Sab 18h30-23h30",
    display: "<span class=\"hours-line\"><strong>Delivery:</strong> todos os dias, 18h30 às 23h30</span><br><span class=\"hours-line\"><strong>Salão:</strong> todos os dias exceto terça, 18h30 às 23h30</span>"
  }
};

// Fallback para promocoes (formato cardapio-admin)
var promocoesData = {
  domingo: [{ texto: "RODÍZIO DE PIZZA — R$ 60 por pessoa com Coca 1L à vontade", destaque: true }],
  segunda: [{ texto: "RODÍZIO DE PIZZA — R$ 60 por pessoa com Coca 1L à vontade", destaque: true }],
  terca:   [{ texto: "TERÇA MALUCA — Pizza G por R$ 39,90 (só delivery, salão fechado)", destaque: true }],
  quarta:  [{ texto: "QUARTA MALUCA — Rodízio por R$ 49,90 com Coca 1L à vontade", destaque: true }],
  quinta:  [{ texto: "RODÍZIO DE PIZZA — R$ 60 por pessoa com Coca 1L à vontade", destaque: true }],
  sexta:   [{ texto: "RODÍZIO PREMIUM — Pizzas, massas e boteco · R$ 65 por pessoa", destaque: true }],
  sabado:  [{ texto: "RODÍZIO PREMIUM — Pizzas, massas e boteco · R$ 65 por pessoa", destaque: true }]
};
