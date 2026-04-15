var siteData = {
  promoDay: {
    segunda: [],
    terca: [],
    quarta: [{ text: "Rodizio com 20% de desconto — Quarta da Pizza", highlight: true }],
    quinta: [{ text: "Pizza grande + refrigerante gratis — Quinta Pizza" }],
    sexta: [{ text: "Pizzas doces pela metade do preco — Sexta Doceira" }],
    sabado: [{ text: "Rodizio + entrada especial por R$ 59,90 — Sabado Perfeito", highlight: true }],
    domingo: [{ text: "Combo familia: 2 pizzas grandes + bebida — Domingo em Familia", highlight: true }]
  },
  infoBar: [
    { label: "Faixa de preco", value: "R$ 40-60" },
    { label: "Especialidade", value: "Rodizio impecavel" },
    { label: "Ambiente", value: "Aconchego + convite visual" },
    { label: "Destaque", value: "Pizza de verdade, delivery forte" }
  ],
  features: [
    {
      title: "Rodizio de pizzas",
      text: "A cada rodada, uma surpresa quente saindo do forno. Do classico calabresa ao mais criativo, tudo pensado para você voltar sempre.",
      tag: "Mais procurado",
      icon: "🍕"
    },
    {
      title: "Pizzas doces e salgadas",
      text: "Chocolate derretido, frutas frescas, sabores que fecham a noite com perfeicao. Pizza nao e so comida, e experiencia.",
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
      text: "Massa leve que derrete na boca, recheios intensos. Perfeita para entrada, acompanhamento ou quando bate aquela fome de nada especifico.",
      tag: "Versatil",
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
      value: "Segunda, quarta, quinta, sexta, sabado, domingo: 18h-23h30 | Terca: fechado"
    }
  ]
};

// Fallback para businessInfo (formato cardapio-admin)
var businessInfoData = {
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
    completo: "Dom 17h30-23h30 | Seg 17h-23h | Ter 17h30-23h | Qua 17h30-23h30 | Qui 17h30-23h30 | Sex 17h30-23h30 | Sab 17h30-23h30"
  }
};

// Fallback para promocoes (formato cardapio-admin)
var promocoesData = {
  domingo: [],
  segunda: [],
  terca: [],
  quarta: [],
  quinta: [],
  sexta: [],
  sabado: []
};
