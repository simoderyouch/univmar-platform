const fr = {
  lang: "fr",
  dir: "ltr" as const,

  nav: {
    home: "Accueil",
    products: "Produits",
    projects: "Réalisations",
    about: "À propos",
    contact: "Contact",
    quote: "Demander un devis",
    menuOpen: "Ouvrir le menu",
    menuClose: "Fermer le menu",
  },

  theme: {
    light: "Mode clair",
    dark: "Mode sombre",
    switchToLight: "Activer le mode clair",
    switchToDark: "Activer le mode sombre",
  },

  hero: {
    eyebrow: "UNIVMAR · Marbre & pierre naturelle",
    title: "L'excellence du marbre\net de la pierre naturelle",
    subtitle:
      "Entreprise marocaine spécialisée dans l'extraction, la transformation et la distribution de marbre et de pierre naturelle de haute qualité.",
    cta: "Découvrir nos produits",
    cta2: "Découvrir UNIVMAR",
    imageAlt: "UNIVMAR — Marbre et pierre naturelle",
  },

  stats: {
    products: "Produits",
    projects: "Réalisations",
    years: "Ans d'expérience",
    categories: "Catégories",
  },

  services: {
    eyebrow: "Ce que nous faisons",
    title: "Des solutions complètes\nen marbre et pierre naturelle",
    subtitle:
      "UNIVMAR propose des solutions complètes en marbre et pierre naturelle pour les projets architecturaux et décoratifs.",
    viewAll: "Découvrir notre expertise",
    items: [
      {
        title: "Conseil & accompagnement",
        desc: "Nous aidons architectes, designers et entrepreneurs à choisir le matériau, la finition et l'application adaptés à chaque projet.",
      },
      {
        title: "Approvisionnement carrières",
        desc: "Collaboration avec des carrières marocaines partenaires pour des marbres et pierres naturelles sélectionnés pour leurs qualités esthétiques et techniques.",
      },
      {
        title: "Import & sélection",
        desc: "Importation et sélection rigoureuse de différents types de marbre pour répondre aux besoins les plus exigeants de nos clients.",
      },
      {
        title: "Transformation sur mesure",
        desc: "Transformation des matériaux bruts en surfaces raffinées, adaptées à tous les usages architecturaux et décoratifs.",
      },
    ],
  },

  products: {
    eyebrow: "Catalogue",
    title: "Une sélection\nd'exception",
    pageTitle: "Nos produits",
    subtitle:
      "Explorez notre gamme de pierres naturelles, du marbre local au granit importé, en passant par la pierre de Taza, l'onyx, l'ardoise et les matériaux de façade. Chaque matière est sélectionnée pour sa beauté, sa résistance et son potentiel architectural.",
    previewSubtitle:
      "{products}+ matériaux nobles — marbre local, pierre de Taza, marbre importé, granit, onyx et quartz pour vos projets.",
    previewCtaLabel: "Parcourir le catalogue",
    all: "Tous",
    viewAll: "Voir tous les produits",
    price: "MAD / m²",
    from: "À partir de",
    contact: "Demander un prix",
    onRequest: "Sur devis",
    search: "Rechercher un matériau…",
    items: "produits",
    showing: "affichés",
    sort: "Trier par",
    sortNameAsc: "Nom (A → Z)",
    sortNameDesc: "Nom (Z → A)",
    sortCategory: "Catégorie",
    clearFilters: "Réinitialiser",
    viewGrid: "Vue grille",
    viewList: "Vue liste",
    quickView: "Voir le détail",
    requestQuote: "Demander un devis",
    close: "Fermer",
    empty: "Aucun produit trouvé dans cette catégorie.",
    emptySearch: "Aucun matériau ne correspond à votre recherche.",
    ctaTitle: "Vous ne trouvez pas ce que vous cherchez ?",
    ctaSubtitle: "Contactez-nous pour une commande spéciale ou un devis personnalisé.",
    heroCta: "Parcourir les matériaux",
    heroBadge: "Sélection soignée",
    heroImages: {
      main: "Échantillons de marbre, granit et pierre naturelle — UNIVMAR",
      side: "Pierre naturelle beige à texture bouchardée — UNIVMAR",
      accent: "Granit gris moucheté — UNIVMAR",
    },
    filterCategory: "Catégorie",
    filterColor: "Couleur",
    categoryNumber: "Catégorie",
    addMaterial: "Ajouter",
    removeMaterial: "Retirer",
    selectedMaterials: "matériaux sélectionnés",
    clearSelection: "Tout effacer",
    requestQuoteFree: "Demander un devis gratuit",
    customQuoteTitle: "Demande personnalisée",
    customQuoteHeading: "Recevez un devis sur mesure",
    customQuoteDesc:
      "Décrivez-nous votre projet et les matériaux qui vous intéressent — nous revenons vers vous sous 24h avec une proposition adaptée.",
    customQuoteBtn: "Envoyer ma demande",
    usages: [
      "Façade",
      "Sol",
      "Mur",
      "Salle de bain",
      "Plan de travail",
      "Piscine",
      "Cheminée",
      "Vasque",
    ],
    colors: {
      beige: "Beige",
      blanc: "Blanc",
      gris: "Gris",
      noir: "Noir",
      rose: "Rose",
      rouge: "Rouge",
      marron: "Marron",
      jaune: "Jaune",
      orange: "Orange",
      vert: "Vert",
      bleu: "Bleu",
      violet: "Violet",
      dore: "Doré",
    },
    categorySections: {
      "Marbre local": {
        index: "01",
        titleLine1: "Marbre local",
        titleLine2: "",
        description:
          "Pierres extraites des plus belles carrières du Maroc — Taza, Khénifra, Azilal, Benslimane. Un savoir-faire ancestral au service de la beauté naturelle.",
      },
      "Pierre Naturelle&Tahejart": {
        index: "02",
        titleLine1: "Pierre naturelle",
        titleLine2: "& Tahejart",
        description:
          "Éclatés, ardoises et pierres naturelles pour habillages muraux, façades et aménagements extérieurs. L'authenticité brute de la pierre.",
      },
      Granit: {
        index: "03",
        titleLine1: "Granit",
        titleLine2: "",
        description:
          "Granits importés d'une résistance et d'une beauté exceptionnelles. Idéals pour plans de travail, revêtements, sols et aménagements haut de gamme.",
      },
      Marbre: {
        index: "04",
        titleLine1: "Marbre",
        titleLine2: "importé",
        description:
          "Sélection premium de marbres importés d'Italie, d'Espagne, de Grèce, du Brésil et d'Égypte. Des matières d'exception pour des projets prestigieux.",
      },
      Onyx: {
        index: "05",
        titleLine1: "Onyx",
        titleLine2: "",
        description:
          "Onyx translucide et veiné pour habillages muraux, plans de travail et éléments décoratifs d'exception.",
      },
      Quartz: {
        index: "06",
        titleLine1: "Quartz",
        titleLine2: "",
        description:
          "Plans de travail et surfaces en quartz pour cuisines et intérieurs contemporains exigeants.",
      },
    },
    categories: {
      Granit: "Granit",
      Marbre: "Marbre",
      Onyx: "Onyx",
      Quartz: "Quartz",
      "Marbre local": "Marbre local",
      "Pierre Naturelle&Tahejart": "Pierre naturelle & Tahejart",
      "Pierre naturelle": "Pierre naturelle",
    },
  },

  projects: {
    eyebrow: "Nos réalisations",
    title: "Chaque projet,\nune signature",
    subtitle:
      "Résidences de haut standing, Mall Le Caroussel, UM6P et projets sur mesure — découvrez nos réalisations en marbre, granit et pierre naturelle.",
    homeSubtitle: "Des références majeures qui nous font confiance.",
    featuredTitle: "Références majeures",
    featuredSubtitle: "Quatre projets d'envergure réalisés en marbre, granit et pierre naturelle.",
    portfolioTitle: "Portfolio",
    portfolioSubtitle: "Un aperçu de nos cuisines, salles de bain, escaliers et aménagements sur mesure.",
    openPortfolio: "Voir tout le portfolio",
    portfolioModalTitle: "Toutes nos réalisations",
    carouselPrev: "Projet précédent",
    carouselNext: "Projet suivant",
    featured: [
      {
        title: "Le Mall du Carrousel",
        tag: "Commerce & retail",
        subtitle: "Façades et aménagements en pierre naturelle",
      },
      {
        title: "UM6P",
        tag: "Enseignement & recherche",
        subtitle: "Université Mohammed VI Polytechnique",
      },
      {
        title: "Résidences de prestige",
        tag: "Résidentiel haut standing",
        subtitle: "Cour intérieure et revêtements en pierre",
      },
      {
        title: "The Ranch Marrakech",
        tag: "Hôtellerie & loisirs",
        subtitle: "Complexe hôtelier à Marrakech",
      },
    ],
    lightboxClose: "Fermer",
    lightboxPrev: "Projet précédent",
    lightboxNext: "Projet suivant",
    all: "Tous",
    viewAll: "Voir toutes les réalisations",
    loadMore: "Afficher plus",
    items: "réalisations",
    empty: "Aucune réalisation dans cette catégorie.",
    heroCta: "Parcourir les réalisations",
    categories: {
      "Salles de Bain": "Salles de Bain",
      "Escaliers": "Escaliers",
      "Cuisines": "Cuisines",
      "Piscines": "Piscines",
      "Extérieur": "Extérieur",
      "Intérieurs": "Intérieurs",
    },
  },

  about: {
    eyebrow: "À propos d'UNIVMAR",
    title: "L'excellence du marbre\net de la pierre naturelle",
    subtitle:
      "Entreprise marocaine spécialisée dans l'extraction, la transformation et la distribution de marbre et de pierre naturelle de haute qualité.",
    teaser:
      "Forte d'un savoir-faire reconnu, UNIVMAR sélectionne rigoureusement ses carrières partenaires et accompagne vos projets d'exception.",
    quote: "Matériaux nobles pour clients nobles.",
    imageAlt: "Atelier et matériaux UNIVMAR",
    imageCaption: "Atelier · Temara, Maroc",
    milestones: ["Carrières partenaires", "Atelier · Temara", "Projets d'exception"],
    cta: "Découvrir notre histoire",
  },

  cta: {
    title: "Construisons\nensemble",
    subtitle: "Votre projet mérite le meilleur des matériaux. Contactez-nous pour en discuter ou visiter notre atelier à Temara.",
    btn: "Demander un devis",
    btn2: "Nous contacter",
    whatsapp: "WhatsApp",
  },

  contact: {
    eyebrow: "Contactez-nous",
    title: "Parlons de\nvotre projet",
    subtitle: "Notre équipe est disponible pour répondre à toutes vos questions.",
    form: {
      name: "Nom complet",
      email: "Adresse e-mail",
      phone: "Téléphone",
      subject: "Objet",
      message: "Message",
      send: "Envoyer le message",
      sending: "Envoi en cours...",
      success: "Message envoyé avec succès !",
      error: "Une erreur s'est produite. Veuillez réessayer.",
    },
    info: {
      phone: "Téléphone",
      email: "E-mail",
      address: "Adresse",
      instagram: "Instagram",
      hours: "Horaires",
      hoursVal: "Lun – Sam : 9h – 18h",
    },
  },

  aboutPage: {
    eyebrow: "À propos d'UNIVMAR",
    title: "L'excellence du marbre\net de la pierre naturelle",
    subtitle:
      "Entreprise marocaine spécialisée dans l'extraction, la transformation et la distribution de marbre et de pierre naturelle de haute qualité.",
    heroCta: "Découvrir notre histoire",
    materialsLabel: "Matériaux mis en avant",
    materials: ["Marbre local", "Pierre naturelle", "Granit", "Onyx"],
    quote: "Matériaux nobles pour clients nobles.",
    story:
      "Forte d'un savoir-faire reconnu et ancrée dans le riche patrimoine géologique du Maroc, UNIVMAR sélectionne avec rigueur ses carrières partenaires afin de valoriser des matériaux d'exception et de les transformer en solutions architecturales répondant aux plus hautes exigences de qualité.",
    story2:
      "Nous accompagnons architectes, designers, promoteurs, entreprises de construction et maîtres d'ouvrage dans la réalisation de leurs projets — intérieurs, extérieurs, résidentiel, hôtelier ou grands projets architecturaux — avec une gamme alliant esthétique, durabilité et performance.",
    pillars: {
      title: "Ce qui nous guide",
      headline: "Vision, mission\net conviction",
      items: [
        {
          title: "Notre vision",
          accent: "Référence de confiance\nen pierre naturelle",
          desc: "Devenir une référence de confiance dans le domaine du marbre et de la pierre naturelle marocaine, reconnue pour sa qualité, son authenticité et son design intemporel.",
          highlights: [
            "Qualité & authenticité marocaine",
            "Design intemporel",
            "Excellence reconnue sur le marché",
          ],
        },
        {
          title: "Notre mission",
          accent: "La solution idéale\npour chaque espace",
          desc: "Aider nos clients à choisir la solution idéale en marbre ou en pierre naturelle pour chaque espace. De la sélection des matériaux aux finitions et aux conseils de mise en œuvre, notre équipe accompagne chaque projet avec soin, précision et respect de la matière.",
          highlights: [
            "Intérieurs, extérieurs & façades",
            "Résidentiel, hôtelier & grands projets",
            "De la sélection à la mise en œuvre",
          ],
        },
        {
          title: "Notre conviction",
          accent: "Plus qu'un matériau,\nune expression",
          desc: "Le marbre et la pierre naturelle sont bien plus que des matériaux : ils expriment la durabilité, le patrimoine, la nature et le raffinement. Nous valorisons la pierre du Maroc dans les projets nationaux et internationaux.",
          highlights: [
            "Durabilité & patrimoine",
            "Nature & raffinement",
            "Projets au Maroc et à l'international",
          ],
        },
      ],
    },
    strengths: {
      title: "Nos atouts",
      subtitle: "Une expertise reconnue au service de projets d'exception.",
      items: [
        {
          title: "{years}+ ans d'expertise",
          desc: "Un savoir-faire consolidé dans la sélection, la transformation et la distribution de pierre naturelle.",
        },
        {
          title: "{products}+ matériaux référencés",
          desc: "Marbre local, marbre importé, granit et pierre naturelle pour tous les usages architecturaux.",
        },
        {
          title: "Atelier & showroom",
          desc: "Un site de production et de conseil à Temara, au cœur de la région de Rabat.",
        },
        {
          title: "Références prestigieuses",
          desc: "Mall Le Caroussel, UM6P, résidences de haut standing et projets sur mesure à travers le Maroc.",
        },
      ],
    },
    services: {
      eyebrow: "Ce que nous faisons",
      headline: "Des solutions complètes\npour vos projets",
      subtitle:
        "UNIVMAR propose des solutions complètes en marbre et pierre naturelle pour les projets architecturaux et décoratifs.",
      process: {
        title: "Notre approche",
        headline: "De la matière\nà la réalisation",
        steps: [
          {
            num: "01",
            title: "Conseil & définition",
            desc: "Analyse de votre projet et choix du matériau, de la finition et de l'application les plus adaptés.",
          },
          {
            num: "02",
            title: "Sélection & approvisionnement",
            desc: "Approvisionnement auprès de carrières marocaines partenaires et import sélectif de marbres d'exception.",
          },
          {
            num: "03",
            title: "Transformation",
            desc: "Découpe, finition et préparation des surfaces en atelier selon vos plans et spécifications.",
          },
          {
            num: "04",
            title: "Livraison & suivi",
            desc: "Accompagnement jusqu'à la livraison et conseils de mise en œuvre sur votre chantier.",
          },
        ],
      },
    },
    ctaTitle: "Construisons\nensemble",
    ctaSubtitle: "Votre projet mérite le meilleur des matériaux. Contactez-nous pour en discuter.",
  },

  homePage: {
    about: {
      eyebrow: "À propos de nous",
      title: "L'excellence du marbre\net de la pierre naturelle au Maroc",
      p1: "Depuis plusieurs années, UNIVMAR met son expertise au service de projets architecturaux d'exception.",
      p2: "Spécialisée dans la sélection, la transformation et la fourniture de marbre et de pierre naturelle, notre entreprise accompagne particuliers, architectes et promoteurs dans la réalisation d'espaces élégants et durables.",
      p3: "Grâce à un savoir-faire maîtrisé et un atelier équipé de machines de précision, nous réalisons des travaux sur mesure pour villas, hôtels, résidences, commerces et aménagements intérieurs haut de gamme.",
      bullets: [
        "{years}+ ans d'expertise au service du luxe et de la durabilité.",
        "{products}+ matériaux nobles sélectionnés pour chaque projet.",
        "Maîtrise totale : carrières partenaires et import sélectif.",
        "Atelier & showroom à Temara, au cœur de la région de Rabat.",
      ],
      cta: "En savoir plus",
      imageAlt: "Atelier et matériaux UNIVMAR",
    },
    surMesure: {
      eyebrow: "Le Sur-Mesure",
      title: "Pierre Naturelle sur-mesure\npour des espaces d'exception",
      subtitle:
        "Nous sublimons vos espaces en transformant la pierre naturelle en ouvrages architecturaux sur-mesure. Cette approche sur-mesure garantit un ajustement dimensionnel parfait et une signature esthétique unique à chaque projet.",
      readMore: "Voir plus",
      items: [
        { title: "Cuisine", num: "01", desc: "Plans de travail et îlots de cuisine élégants" },
        { title: "Salle de Bain", num: "02", desc: "Vasques et habillages luxueux" },
        { title: "Aménagement", num: "03", desc: "Escaliers, revêtements muraux et de sols" },
        { title: "Décoration", num: "04", desc: "Cheminées, tables et mobilier en marbre" },
        { title: "Finition Open Book", num: "05", desc: "Assemblage symétrique pour une modernité absolue" },
      ],
    },
    products: {
      eyebrow: "Produits",
      title: "Une large sélection\nde pierres naturelles",
      subtitle:
        "Nous proposons une large sélection de marbres naturels soigneusement choisis pour leur qualité et leur esthétique.",
      bullets: [
        "Revêtements de sols et murs",
        "Escaliers et façades",
        "Salles de bain et cuisines",
        "Tables et pièces décoratives sur mesure",
      ],
      viewAll: "Voir la collection",
      requestQuote: "Demander un devis",
    },
    statsBanner: {
      projects: "Projets réalisés",
      products: "Produits",
      years: "Années d'expérience",
    },
    process: {
      eyebrow: "Notre process de travail",
      title: "Les avantages\ndu sur-mesure",
      intro:
        "Le marbre sur mesure permet une adaptation parfaite, une finition exclusive et un rendu esthétique hautement personnalisé, valorisant durablement votre projet.",
      steps: [
        {
          num: "01",
          title: "Sélection de la pierre",
          desc: "Chaque projet commence par le choix du marbre ou de la pierre naturelle. Nous conseillons nos clients selon l'usage, le style recherché et les contraintes techniques.",
        },
        {
          num: "02",
          title: "Découpe & transformation",
          desc: "La pierre sélectionnée est découpée et transformée dans nos ateliers à l'aide d'équipements de haute précision pour des dimensions exactes.",
        },
        {
          num: "03",
          title: "Fabrication sur mesure",
          desc: "Nos équipes réalisent chaque pièce sur mesure, en respectant les plans et les spécificités du projet — plans de travail, escaliers, revêtements ou éléments décoratifs.",
        },
      ],
    },
    categories: {
      eyebrow: "Choisissez votre pierre",
      title: "Une collection unique\nau monde",
      subtitle:
        "Nous importons et extrayons une vaste sélection de matériaux pour répondre à toutes vos inspirations architecturales.",
    },
    cta: {
      title: "Prêt à commencer ?",
      subtitle:
        "Que ce soit pour un projet résidentiel ou professionnel, UNIVMAR est votre partenaire de confiance pour des réalisations haut de gamme, durables et sur mesure.",
      btn: "Voir la collection",
      btn2: "Demander un devis",
    },
    contact: {
      eyebrow: "Formulaire",
      title: "Matière Noble\npour Client Noble",
      subtitle: "Si vous avez des questions, n'hésitez pas à nous contacter.",
      cta: "Nous contacter",
    },
  },

  seo: {
    home: {
      title: "Marbre, granit et pierre naturelle au Maroc | UNIVMAR",
      description:
        "Découvrez nos marbres, granits et pierres naturelles pour vos projets au Maroc. Conseils, choix de finitions et devis personnalisé.",
    },
    produits: {
      title: "Marbre et granit au Maroc : nos matériaux | UNIVMAR",
      description:
        "Explorez notre sélection de marbre, granit, onyx et pierre naturelle. Trouvez le matériau adapté à votre projet et demandez un devis.",
    },
    aPropos: {
      title: "Expert marbre et pierre naturelle au Maroc | UNIVMAR",
      description:
        "UNIVMAR : extraction, transformation et distribution de marbre et pierre naturelle. Vision, mission et savoir-faire marocain.",
    },
    projets: {
      title: "Réalisations marbre — Mall Le Caroussel, UM6P | UNIVMAR",
      description:
        "Découvrez nos réalisations en marbre, granit et pierre naturelle : résidences haut standing, Mall Le Caroussel, UM6P.",
    },
    contact: {
      title: "Devis marbre et pierre naturelle — Temara | UNIVMAR",
      description:
        "Demandez un devis marbre, granit ou pierre naturelle. Atelier UNIVMAR à Temara — +212 660-419991.",
    },
    blog: {
      title: "Blog marbre et pierre naturelle | UNIVMAR",
      description:
        "Guides, conseils et tendances marbre, granit et pierre de Taza au Maroc par les experts UNIVMAR.",
    },
    productTemplate: {
      titleSuffix: "| UNIVMAR",
      descriptionTemplate:
        "Demandez un devis pour {name} ({category}) — marbre et pierre naturelle UNIVMAR, Maroc.",
    },
  },

  seoContent: {
    applications: "Applications",
    faq: "Questions fréquentes",
  },

  footer: {
    tagline: "Matériaux nobles pour clients nobles.",
    seoLinks: "Matériaux",
    blog: "Blog",
    links: "Liens rapides",
    contact: "Contact",
    rights: "Tous droits réservés.",
    materials: "Marbre · Granit · Pierre Naturelle",
    cta: "Demander un devis",
    creditLabel: "Site réalisé par",
    creditName: "Mohamed Ed deryouch",
  },
};

export default fr;
