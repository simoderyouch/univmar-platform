import type { Lang } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/site";
import type { SEO_PAGE_SLUGS } from "@/lib/site";

export type SeoPageSlug = (typeof SEO_PAGE_SLUGS)[number];

export type SeoPageContent = {
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** ISO date of a substantive, user-visible update. Never set this to a deploy date. */
  dateModified?: string;
  sections: { title: string; paragraphs: string[] }[];
  applications: string[];
  whyTitle: string;
  whyPoints: string[];
  faq: { q: string; a: string }[];
  internalLinks?: { label: string; href: string }[];
  imageSources?: string[];
};

type PageBundle = Record<Lang, SeoPageContent>;

function localizedFallback(
  lang: Exclude<Lang, "fr">,
  content: Pick<SeoPageContent, "h1" | "intro">,
): Pick<SeoPageContent, "sections" | "applications" | "whyTitle" | "whyPoints" | "faq" | "internalLinks"> {
  const isArabic = lang === "ar";
  const topic = content.h1;

  return {
    sections: isArabic
      ? [
          { title: `اختيار ${topic} حسب الاستعمال`, paragraphs: [content.intro, `لا يكفي اختيار المادة أو الخدمة بالاعتماد على اللون أو صورة فقط. يختلف القرار بين مشروع سكني وفندق ومتجر أو ورشة، كما تختلف متطلبات المطبخ والحمام والأرضية والواجهة. تراجع UNIVMAR الاستعمال والمساحة والتعرض والميزانية قبل اقتراح حل مناسب.`] },
          { title: "المادة والتشطيب والمقاس", paragraphs: [`يؤثر التشطيب في المظهر والأداء. التشطيب المصقول أو الملسن يناسب غالباً المساحات الداخلية، بينما تحتاج الأرضيات الخارجية والواجهات إلى ملمس وتثبيت يوافقان الماء والشمس والحركة. كما تؤثر السماكة والمقاس والتقسيم والحواف والفتحات في الجودة النهائية.`] },
          { title: "تحضير عرض سعر واضح", paragraphs: [`للحصول على عرض يمكن مقارنته، أرسلوا المساحة أو المخطط، الاستعمال، التشطيب المطلوب، المدينة والمدة المتوقعة. يوضح العرض الجيد المادة والتحويل والنقل والتفاصيل الخاصة بدل الاعتماد على سعر متر مربع مجرد.`] },
          { title: "مشاريع في المغرب", paragraphs: [`ترافق UNIVMAR المشاريع من تمارة نحو الرباط والدار البيضاء وتازة ومراكش ومدن أخرى وفق الكمية والبرنامج. يساعد الاختيار المبكر وتأكيد الدفعة والمقاس قبل التحويل على تجنب مفاجآت اللون أو التأخير في الورشة.`] },
        ]
      : [
          { title: `Choosing ${topic} for the right use`, paragraphs: [content.intro, `A material or service should not be selected from colour or one photograph alone. Residential, hotel, retail and workshop projects have different needs, and a kitchen, bathroom, floor or façade requires a different decision. UNIVMAR reviews use, surface, exposure and budget before recommending a suitable solution.`] },
          { title: "Material, finish and format", paragraphs: [`Finish affects both appearance and performance. Polished or honed surfaces often suit interiors, while exterior floors and façades need texture and fixing systems that work with water, sun and traffic. Thickness, format, layout, edges and technical cut-outs also influence the final result.`] },
          { title: "Preparing a clear quote", paragraphs: [`For a quote that can be compared properly, share the area or drawing, use, required finish, project city and expected timing. A useful quote distinguishes material, fabrication, delivery and special details instead of relying on an isolated square-metre price.`] },
          { title: "Projects across Morocco", paragraphs: [`UNIVMAR supports projects from Temara to Rabat, Casablanca, Taza, Marrakech and other cities according to volume and programme. Selecting early, confirming the available batch and approving format before fabrication helps avoid surprises in tone or timing.`] },
        ],
    applications: isArabic ? ["مطبخ", "أرضية", "جدار", "حمام", "درج", "واجهة", "فندق", "فيلا"] : ["Kitchen", "Floor", "Wall", "Bathroom", "Staircase", "Façade", "Hotel", "Villa"],
    whyTitle: isArabic ? "لماذا UNIVMAR" : "Why choose UNIVMAR",
    whyPoints: isArabic
      ? ["ورشة بتمارة وخدمة لمشاريع في عدة مدن مغربية", "اختيار المادة والتشطيب حسب الاستعمال الفعلي", "قص وتحضير حسب المخططات والمقاسات", "عرض واضح يساعد على المقارنة قبل القرار"]
      : ["Workshop in Temara and service for projects in several Moroccan cities", "Material and finish selected for real use", "Fabrication prepared from drawings and dimensions", "Clear quotation for a confident comparison"],
    faq: isArabic
      ? [
          { q: `كيف أختار ${topic}؟`, a: "حددوا الاستعمال والمقاسات والتشطيب والمدينة أولاً. بعدها يمكن مقارنة الخيارات المتوفرة وعرض سعر يناسب المشروع." },
          { q: "هل يمكن إعداد قص حسب المقاس؟", a: "نعم، تساعد المخططات والمقاسات الدقيقة على تحديد القص والحواف والفتحات والتفاصيل اللازمة قبل التحويل." },
          { q: "كيف أطلب عرض سعر؟", a: "أرسلوا المساحة أو المخطط ونوع الاستعمال والتشطيب والمدينة والمدة المتوقعة، وسيراجع الفريق الطلب." },
        ]
      : [
          { q: `How should ${topic} be selected?`, a: "Start with the use, dimensions, finish and project city. Available options and a project-specific quote can then be compared." },
          { q: "Can material be fabricated to size?", a: "Yes. Drawings and accurate dimensions help define cuts, edges, openings and the details needed before fabrication." },
          { q: "How can a quote be requested?", a: "Share the area or drawing, intended use, finish, project city and expected timing so the team can review the request." },
        ],
    internalLinks: isArabic
      ? [{ label: "كتالوج المنتجات", href: "/produits" }, { label: "طلب عرض سعر", href: "/contact" }, { label: "مدونة UNIVMAR", href: "/blog" }]
      : [{ label: "Product catalogue", href: "/produits" }, { label: "Request a quote", href: "/contact" }, { label: "UNIVMAR blog", href: "/blog" }],
  };
}

function bundle(
  fr: SeoPageContent,
  en: Pick<SeoPageContent, "navLabel" | "metaTitle" | "metaDescription" | "h1" | "intro"> &
    Partial<SeoPageContent>,
  ar: Pick<SeoPageContent, "navLabel" | "metaTitle" | "metaDescription" | "h1" | "intro"> &
    Partial<SeoPageContent>,
): PageBundle {
  return {
    fr,
    en: { ...fr, ...localizedFallback("en", en), ...en },
    ar: { ...fr, ...localizedFallback("ar", ar), ...ar },
  };
}

const commonFaq = [
  {
    q: "Quelle est la différence entre marbre, granit et pierre naturelle ?",
    a: "Le marbre est recherché pour son veinage et sa noblesse, le granit pour sa résistance mécanique et la pierre naturelle pour son relief authentique en façade ou en extérieur. UNIVMAR conseille la matière selon l'usage, l'exposition et le rendu souhaité.",
  },
  {
    q: "Quelle finition choisir pour l'extérieur ?",
    a: "Pour l'extérieur, les finitions bouchardée, sablée, vieillie, brute ou éclatée sont souvent privilégiées car elles offrent plus d'accroche et une lecture minérale durable. Le choix dépend du support, du passage et de l'entretien prévu.",
  },
  {
    q: "Livrez-vous à Rabat, Temara et Casablanca ?",
    a: "Oui. UNIVMAR est basé à Temara et livre régulièrement Rabat, Temara, Casablanca, Taza et d'autres villes du Maroc selon le volume, les formats et le planning du chantier.",
  },
  {
    q: "Comment demander un devis pour un projet en marbre ou pierre naturelle ?",
    a: "Vous pouvez nous contacter avec le matériau souhaité, les surfaces approximatives, les finitions, la ville du chantier et, si possible, des plans ou photos. Notre équipe prépare ensuite une proposition adaptée.",
  },
];

const PAGES: Record<SeoPageSlug, PageBundle> = {
  "marbre-maroc": bundle(
    {
      navLabel: "Marbre au Maroc",
      metaTitle: "Marbre Maroc : local, importé et pierre naturelle | UNIVMAR",
      metaDescription:
        "Marbre Maroc : découvrez marbre local, pierre de Taza, granit et marbre importé pour votre projet. Conseil et devis UNIVMAR depuis Temara.",
      h1: "Marbre Maroc — fournisseur de marbre et pierre naturelle",
      intro:
        "Vous recherchez du marbre Maroc pour une villa, un hôtel, un hall ou un plan de travail ? UNIVMAR propose du marbre local marocain, du marbre de Taza, du marbre importé, du granit, du quartz, de l'onyx et de la pierre naturelle. Depuis notre atelier à Temara, nous sélectionnons, transformons et livrons à Rabat, Casablanca, Marrakech, Taza et dans tout le Maroc.",
      dateModified: "2026-08-10",
      sections: [
        {
          title: "Marbre Maroc : trouver la matière adaptée à votre projet",
          paragraphs: [
            "Une recherche de marbre Maroc peut correspondre à des besoins très différents : sol de villa, escalier, salle de bain, plan vasque, mur décoratif, hall d'hôtel ou plan de travail. Le bon choix commence par l'usage réel. UNIVMAR compare les références disponibles, la finition, l'épaisseur, le format, le niveau d'entretien et la ville de livraison avant de préparer un devis.",
            "Pour un projet intérieur, le marbre local ou importé peut apporter veinage et luminosité. Pour une cuisine très sollicitée, le granit peut être plus adapté. Pour une façade ou une terrasse exposée, la pierre de Taza et les finitions texturées sont souvent plus cohérentes. Cette approche évite d'acheter une matière uniquement sur une photo ou un prix au mètre carré.",
          ],
        },
        {
          title: "Marbre local marocain et marbre importé",
          paragraphs: [
            "Le marché marocain du marbre combine deux attentes : valoriser les matières locales et accéder à des références internationales. Les marbres locaux comme le marbre Beige Taza, le Gris Taza, le prestigieux Volubilis, le Noir Khénifra, le Gris Tiflet ou le Noir Azilal apportent une identité forte, ancrée dans la géologie du pays. Ces pierres naturelles marocaines sont particulièrement prisées pour leur durabilité et leur esthétique unique.",
            "En parallèle, les marbres importés comme le célèbre Crema Marfil, le Volakas, le Panda White, l'Arabiscato ou le Gris Armani permettent de travailler des ambiances plus internationales, lumineuses ou contrastées. Que ce soit pour un marbre Maroc authentique ou une référence mondiale, UNIVMAR vous aide à comparer ces familles selon votre projet. Un hall d'entrée ne demande pas le même choix qu'une terrasse, un plan de travail, une façade ou une salle de bain.",
          ],
        },
        {
          title: "Plans de travail cuisine et types de marbre",
          paragraphs: [
            "Le choix du marbre Maroc pour un plan de travail de cuisine ou une salle de bain requiert une attention particulière. Nous proposons des solutions sur mesure en marbre et granit pour résister à un usage quotidien tout en conservant une esthétique premium. Le granit est souvent privilégié pour les plans de travail cuisine grâce à sa résistance, tandis que le marbre (comme le Crema Marfil ou le Volubilis) sublime les salles de bain et les espaces de réception."
          ]
        },
        {
          title: "Applications architecturales du marbre",
          paragraphs: [
            "Le marbre est particulièrement recherché pour les sols intérieurs, les escaliers, les murs de réception, les salles de bain, les plans vasques, les cheminées et les détails décoratifs. Dans les villas et résidences haut standing, il apporte une continuité noble entre les espaces. Dans les hôtels, restaurants et bureaux, il donne immédiatement une perception de qualité et de durabilité.",
            "Pour l'extérieur, UNIVMAR oriente souvent vers des finitions plus texturées ou vers la pierre naturelle lorsque l'adhérence et l'exposition deviennent prioritaires. Une finition polie sublime un intérieur, tandis qu'une finition bouchardée, sablée, vieillie ou brute répond mieux aux terrasses, façades, entrées et abords de piscine.",
          ],
        },
        {
          title: "Conseil, sélection et devis au Maroc",
          paragraphs: [
            "Notre rôle est d'aider architectes, promoteurs, entreprises et particuliers à choisir une matière cohérente avec le style, le budget, les contraintes techniques et la ville du chantier. Depuis Temara, nous accompagnons les projets à Rabat, Casablanca, Taza, Marrakech et dans d'autres régions du Maroc avec une approche orientée matériau, finition et usage réel.",
            "Pour demander un devis marbre au Maroc, préparez les surfaces approximatives, l'usage, les formats souhaités, la finition et quelques photos ou plans si possible. UNIVMAR peut ensuite proposer la référence adaptée, une alternative si nécessaire et une organisation de livraison selon les quantités.",
          ],
        },
        {
          title: "Zones desservies et accompagnement chantier",
          paragraphs: [
            "UNIVMAR travaille avec des clients à Temara, Rabat, Casablanca, Taza, Marrakech et dans d'autres villes du Maroc. Cette présence nationale est importante pour les projets en marbre, car les choix de matière doivent être synchronisés avec les délais de chantier, la livraison, les accès, le stockage et la coordination avec les poseurs.",
            "Notre accompagnement commence avant la commande : lecture du projet, comparaison des références, choix de finition, conseils d'entretien et estimation des contraintes logistiques. Cette méthode permet de sécuriser le rendu final et d'éviter les écarts entre l'échantillon, la tranche, la pose et l'usage quotidien.",
            "Cette étape est particulièrement utile pour les grandes surfaces, les escaliers, les salles de bain et les halls où la cohérence du ton, du veinage et de la finition devient visible chaque jour. Elle aide aussi à anticiper le transport, la manutention et la coordination avec l'équipe de pose.",
          ],
        },
        {
          title: "Comment choisir un marbre au Maroc selon la pièce",
          paragraphs: [
            "Le choix d'un marbre Maroc commence par la pièce à traiter. Dans un hall, un salon ou un mur de réception, le veinage, la luminosité et l'orientation des plaques peuvent devenir l'élément principal du décor. Dans une salle de bain, il faut aussi anticiper l'humidité, les produits d'entretien et la fréquence d'utilisation. Pour un escalier, les chants, les nez de marche, les joints et la régularité des formats méritent d'être définis avant le lancement de la découpe.",
            "UNIVMAR ne présente pas le marbre comme une solution universelle. Une cuisine intensive peut demander du granit ou du quartz, alors qu'un marbre local ou importé donnera plus de caractère à un sol intérieur, une vasque ou un habillage mural. Cette comparaison par usage aide à choisir une matière durable et à éviter les décisions prises uniquement à partir d'une image ou d'un prix au mètre carré.",
          ],
        },
        {
          title: "Marbre local marocain ou marbre importé : comment comparer",
          paragraphs: [
            "Le marbre local marocain, dont Beige Taza, Gris Taza, Volubilis, Noir Khénifra ou Gris Tiflet, permet de valoriser une identité minérale proche du chantier. Le marbre importé répond à d'autres attentes : fond très clair, veinage plus graphique, couleur rare ou rendu international. L'un n'est pas automatiquement meilleur que l'autre ; la disponibilité du lot, la finition, la surface et le style recherché comptent davantage que le seul pays d'origine.",
            "Pour une comparaison honnête, demandez des références réellement disponibles et vérifiez la cohérence entre échantillon, tranche et quantité nécessaire. Sur une grande surface, le calepinage peut être aussi important que le matériau. UNIVMAR peut proposer une référence principale et une alternative adaptée si le délai, le budget ou l'homogénéité du lot deviennent prioritaires.",
          ],
        },
        {
          title: "Préparer un devis marbre Maroc sans mauvaise surprise",
          paragraphs: [
            "Un devis utile détaille la référence, l'épaisseur, la finition, les formats, les découpes, les chants, la quantité, la ville de livraison et, si nécessaire, la pose. Le prix du marbre Maroc varie selon ces éléments et selon le lot disponible. Deux offres avec un prix au m² proche peuvent produire des coûts très différents si les découpes, la manutention, les joints ou le transport ne sont pas inclus de la même manière.",
            "Avant de confirmer, partagez un plan, des photos du support, les surfaces, l'usage final et la date souhaitée. Pour les projets avec plusieurs pièces, précisez où chaque finition sera utilisée. Cette préparation donne au client une offre plus lisible et permet à l'atelier de vérifier les contraintes techniques avant que la matière ne soit transformée.",
          ],
        },
      ],
      imageSources: [
        "/images/Marbre%20local/images/Volubilis.jpg",
        "/images/Marbre%20import%C3%A9/images/Crema_marfil.jpg",
        "/images/Marbre%20local/images/Beige_taza_polli.jpg",
      ],
      applications: ["Sol", "Mur", "Salle de bain", "Escalier", "Plan de travail", "Façade", "Hôtel", "Villa"],
      whyTitle: "Pourquoi choisir UNIVMAR",
      whyPoints: [
        "Atelier à Temara et livraison Rabat, Casablanca, Taza et Maroc",
        "Catalogue complet : marbre local, importé, granit, quartz, onyx et pierre naturelle",
        "Conseil sur le choix de la finition selon l'intérieur ou l'extérieur",
        "Accompagnement des architectes, promoteurs, entreprises et particuliers",
      ],
      faq: commonFaq,
      internalLinks: [
        { label: "Prix marbre Maroc", href: "/prix-marbre-maroc" },
        { label: "Plan de travail marbre", href: "/plan-de-travail-marbre" },
        { label: "Marbre de Taza", href: "/marbre-de-taza" },
        { label: "Pierre de Taza", href: "/pierre-de-taza" },
        { label: "Marbre local marocain", href: "/marbre-local-maroc" },
        { label: "Demander un devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Marble in Morocco",
      metaTitle: "Marble Morocco — supplier & expert | UNIVMAR",
      metaDescription: "Marble Morocco: local and imported marble. UNIVMAR Temara — selection, fabrication, delivery.",
      h1: "Marble Morocco — marble and natural stone supplier",
      intro: "Looking for marble in Morocco? UNIVMAR supplies local Moroccan marble (including Taza marble), imported marble, granite and natural stone from Temara.",
    },
    {
      navLabel: "الرخام في المغرب",
      metaTitle: "رخام المغرب — مورد وخبير | UNIVMAR",
      metaDescription: "رخام المغرب: رخام محلي ومستورد. UNIVMAR بتمارة: اختيار وتحويل وتوصيل.",
      h1: "رخام المغرب — مورد الرخام والحجر الطبيعي",
      intro: "تبحثون عن رخام في المغرب؟ توفر UNIVMAR رخاماً محلياً (بما فيه رخام تازة) ورخاماً مستورداً وغرانيتاً وحجراً طبيعياً من تمارة.",
    },
  ),
  "marbrerie-maroc": bundle(
    {
      navLabel: "Marbrerie Maroc",
      metaTitle: "Marbrerie Maroc | Spécialiste marbre, granit & pierre | UNIVMAR",
      metaDescription:
        "Marbrerie au Maroc : UNIVMAR est spécialiste du marbre, granit et pierre naturelle. Fourniture, transformation sur mesure et livraison depuis Temara. Devis gratuit.",
      h1: "Marbrerie au Maroc — spécialiste du marbre et de la pierre naturelle",
      intro:
        "UNIVMAR accompagne les projets en marbre au Maroc avec une sélection de marbres locaux et importés, de granits et de pierres naturelles. Depuis notre atelier à Temara, nous conseillons les particuliers, architectes, promoteurs, cuisinistes et entreprises sur la matière, la finition, la transformation et la livraison.",
      sections: [
        {
          title: "Un spécialiste du marbre pour chaque projet",
          paragraphs: [
            "Une marbrerie ne se limite pas à vendre une plaque. Le bon choix dépend de l'usage, de la lumière, du format, de la finition, de l'entretien et du calendrier du chantier. UNIVMAR aide à comparer marbre local marocain, marbre importé, granit, quartz, onyx et pierre naturelle avant de préparer une solution réellement adaptée.",
            "Notre accompagnement s'adresse aux villas, hôtels, restaurants, bureaux, commerces et projets institutionnels. Nous travaillons les besoins de sols, murs, escaliers, salles de bain, plans de travail, façades, terrasses et éléments décoratifs sur mesure.",
          ],
        },
        {
          title: "Fourniture, transformation et finitions",
          paragraphs: [
            "UNIVMAR organise la sélection de la matière, la préparation des formats et les finitions selon le projet. Le poli et l'adouci conviennent souvent aux intérieurs, tandis que les finitions bouchardée, sablée, vieillie, brute ou éclatée sont étudiées pour les façades, terrasses, patios et espaces exposés.",
            "Pour un plan de travail, un escalier ou un habillage mural, les découpes, chants, épaisseurs, joints et calepinage doivent être anticipés. Une demande avec les dimensions, les plans ou des photos permet de construire un devis plus fiable qu'un simple prix au m².",
          ],
        },
        {
          title: "Marbre marocain, pierre de Taza et références importées",
          paragraphs: [
            "Le catalogue comprend notamment le marbre local marocain, le marbre de Taza, la pierre de Taza, Volubilis, le Noir Khénifra, des marbres importés, du granit, du quartz et de l'onyx. Chaque référence doit être choisie selon le rendu souhaité et les contraintes du lieu, plutôt que sur son nom seul.",
            "La pierre de Taza et le marbre de Taza peuvent répondre à des usages différents selon la finition et l'exposition. UNIVMAR explique cette distinction et oriente vers la page matière, les produits disponibles ou une alternative cohérente lorsque le stock ou le délai l'impose.",
          ],
        },
        {
          title: "Marbrerie à Temara et livraison au Maroc",
          paragraphs: [
            "Notre atelier à Ouled Slama, Ain Atiq, Temara est proche de Rabat et permet de voir les nuances, reliefs et finitions avant la commande. UNIVMAR livre aussi les projets à Casablanca, Marrakech, Taza et dans d'autres villes du Maroc selon le volume, les formats et le planning.",
            "Pour préparer une demande de devis, indiquez la ville du chantier, l'application, les surfaces ou dimensions, la finition souhaitée et le délai. Nous pouvons alors proposer une matière principale, une alternative et les prochaines étapes de transformation ou de livraison.",
          ],
        },
      ],
      applications: ["Sol", "Mur", "Escalier", "Cuisine", "Salle de bain", "Façade", "Terrasse", "Hôtel"],
      whyTitle: "Pourquoi choisir UNIVMAR",
      whyPoints: [
        "Atelier et sélection de matériaux à Temara",
        "Marbre local, marbre importé, granit et pierre naturelle",
        "Conseil sur la matière, la finition et l'usage réel",
        "Transformation et livraison selon le projet au Maroc",
      ],
      faq: [
        {
          q: "Que propose une marbrerie au Maroc ?",
          a: "Une marbrerie sélectionne, transforme et fournit du marbre, du granit et de la pierre naturelle pour les sols, murs, escaliers, cuisines, salles de bain, façades et projets décoratifs. Les services exacts dépendent de l'atelier et du projet.",
        },
        {
          q: "Quelle est la différence entre marbre et granit ?",
          a: "Le marbre est souvent choisi pour son veinage et son rendu architectural. Le granit est généralement privilégié lorsque la résistance à l'usage, aux rayures et à la chaleur devient prioritaire, notamment pour certaines cuisines et zones de passage.",
        },
        {
          q: "Où voir du marbre à Temara ?",
          a: "UNIVMAR reçoit les projets sur rendez-vous dans son atelier à Ouled Slama, Ain Atiq, Temara. La visite permet de comparer les tons, les veinages et les finitions avant de demander un devis.",
        },
        {
          q: "Livrez-vous le marbre dans tout le Maroc ?",
          a: "UNIVMAR organise la livraison vers Rabat, Temara, Casablanca, Marrakech, Taza et d'autres villes selon la référence, le volume, les formats et le planning du chantier.",
        },
        commonFaq[3],
      ],
      internalLinks: [
        { label: "Marbre Maroc", href: "/marbre-maroc" },
        { label: "Marbre et granit Maroc", href: "/marbre-et-granit-maroc" },
        { label: "Pierre de Taza", href: "/pierre-de-taza" },
        { label: "Catalogue matériaux", href: "/produits" },
        { label: "Marbrerie Temara", href: "/marbre-temara" },
        { label: "Demander un devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Marble specialist Morocco",
      metaTitle: "Marble Morocco specialist | Granite & natural stone | UNIVMAR",
      metaDescription:
        "UNIVMAR is a marble, granite and natural stone specialist in Morocco. Selection, fabrication and delivery from Temara.",
      h1: "Marble specialist in Morocco",
      intro:
        "UNIVMAR supports marble, granite and natural stone projects from its Temara workshop, with selection, custom fabrication and delivery across Morocco.",
    },
    {
      navLabel: "متخصص الرخام في المغرب",
      metaTitle: "متخصص الرخام في المغرب | الغرانيت والحجر الطبيعي | UNIVMAR",
      metaDescription:
        "UNIVMAR متخصص في الرخام والغرانيت والحجر الطبيعي في المغرب. اختيار وتحويل وتوصيل من تمارة.",
      h1: "متخصص الرخام والحجر الطبيعي في المغرب",
      intro:
        "ترافق UNIVMAR مشاريع الرخام والغرانيت والحجر الطبيعي انطلاقاً من ورشتها بتمارة، مع الاختيار والتحويل حسب الطلب والتوصيل في المغرب.",
    },
  ),
  "pierre-de-taza": bundle(
    {
      navLabel: "Pierre de Taza",
      metaTitle: "Pierre Taza / Pierre de Taza : façade, terrasse et devis | UNIVMAR",
      metaDescription:
        "Pierre Taza ou pierre de Taza : Beige Taza, Gris Taza et finitions pour façade, terrasse ou piscine. Conseil et devis UNIVMAR au Maroc.",
      h1: "Pierre de Taza (Pierre Taza) — la référence marocaine pour l'extérieur",
      intro:
        "La pierre de Taza — parfois recherchée sous la forme « pierre Taza » — est une pierre naturelle marocaine demandée pour les façades, terrasses, piscines et murs décoratifs. Issue de la région de Taza et d'Oued Amlil, elle se décline en Beige Taza et Gris Taza avec des finitions éclatée, bouchardée, sablée, vieillie ou polie. UNIVMAR sélectionne, transforme et livre la pierre de Taza depuis Temara vers Rabat, Casablanca, Marrakech, Taza et tout le Maroc.",
      dateModified: "2026-08-10",
      sections: [
        {
          title: "Une pierre naturelle marocaine pour l'architecture",
          paragraphs: [
            "Issue de la région de Taza, cette pierre naturelle calcaire offre une esthétique sobre et minérale. Le Beige Taza apporte une chaleur douce, adaptée aux villas contemporaines, aux patios, aux terrasses et aux façades lumineuses. Le Gris Taza, plus graphique, crée un rendu architectural plus structuré, idéal pour les murs extérieurs, les sols et les projets commerciaux qui demandent une présence visuelle affirmée.",
            "Sa force est sa polyvalence. Selon le format, la pose et la finition, la pierre de Taza peut donner un aspect traditionnel marocain, méditerranéen, contemporain ou très épuré. Elle se marie facilement avec le bois, le métal noir, le verre, les enduits minéraux et les jardins secs, ce qui en fait une matière prisée par les architectes et promoteurs.",
          ],
        },
        {
          title: "Pierre de Taza ou « pierre Taza » : quelle expression utiliser ?",
          paragraphs: [
            "Les deux expressions désignent généralement la même famille de pierre calcaire de la région de Taza. « Pierre de Taza » est la formulation la plus précise pour une demande de matériau, tandis que « pierre Taza » apparaît souvent dans les recherches, les devis ou les échanges de chantier. Le choix ne doit pas se faire sur le mot seul : beige ou gris, format, épaisseur, finition et usage prévu définissent la référence à commander.",
            "Pour éviter une comparaison trompeuse, demandez un échantillon de la finition finale et indiquez l'usage dès le départ. Une pierre Taza polie pour un hall, une dalle bouchardée pour une terrasse et un éclaté pour un mur de clôture peuvent venir de la même région tout en répondant à des besoins très différents.",
          ],
        },
        {
          title: "Beige Taza, Gris Taza et finitions disponibles",
          paragraphs: [
            "UNIVMAR propose plusieurs variations : Beige Taza, Gris Taza, Éclaté Beige Taza, Éclaté Gris Taza, formats bouchardés, sablés, vieillis, striés, bruts ou polis selon la référence. La finition éclatée donne du relief aux façades et murs de clôture. La finition bouchardée améliore l'accroche pour les sols extérieurs. La finition vieillie adoucit la surface pour les terrasses, patios et abords de piscine.",
            "Pour un intérieur, une finition polie ou adoucie peut révéler davantage la matière et faciliter l'entretien. Pour l'extérieur, nous recommandons de valider l'usage, l'exposition au soleil, le ruissellement, le passage et la pente afin de choisir une finition durable et confortable.",
          ],
        },
        {
          title: "Applications : façade, sol, mur, terrasse et projets premium",
          paragraphs: [
            "La pierre de Taza façade est souvent utilisée pour habiller des volumes complets, des murs d'entrée, des soubassements, des clôtures ou des détails architecturaux. En sol, elle convient aux terrasses, allées, patios, jardins, villas, hôtels et espaces commerciaux lorsque la finition et l'épaisseur sont adaptées.",
            "UNIVMAR accompagne aussi les projets sur mesure : calepinage, choix de tons, coordination avec d'autres matériaux, préparation des quantités et livraison. L'objectif est de sécuriser le rendu final avant la pose, car une pierre naturelle doit être choisie non seulement pour sa couleur, mais aussi pour son comportement dans le temps.",
          ],
        },
        {
          title: "Pierre de Taza ou marbre de Taza : quelle différence ?",
          paragraphs: [
            "Les expressions pierre de Taza et marbre de Taza sont souvent employées pour désigner des matières issues de la même région, mais l'usage attendu n'est pas le même. Lorsqu'une référence est travaillée en poli ou adouci pour un hall, un sol intérieur, un escalier ou une salle de bain, on parle volontiers de marbre de Taza. Lorsqu'elle est choisie en finition bouchardée, sablée, vieillie, brute ou éclatée pour une façade, une terrasse ou une zone humide, l'expression pierre de Taza est plus précise.",
            "Cette distinction évite de choisir une surface trop lisse pour l'extérieur ou une finition inutilement texturée pour un intérieur. La décision doit prendre en compte le support, l'eau, le soleil, la pente, le passage et le rendu recherché. UNIVMAR oriente le projet vers la finition et le format cohérents plutôt que de promettre qu'une seule variante convient partout.",
          ],
        },
        {
          title: "Formats, épaisseurs et pose pour une façade ou une terrasse",
          paragraphs: [
            "Une façade en pierre de Taza demande d'étudier le support, le système de fixation, le poids, les formats, les joints et les détails d'angle. Pour une terrasse ou un cheminement, l'épaisseur, la pente, l'évacuation de l'eau et l'adhérence sont essentiels. Une belle pierre posée sur un support mal préparé ne donne pas un résultat durable ; il faut donc valider la méthode de pose avec le professionnel du chantier.",
            "Les grands formats créent une lecture contemporaine, tandis que des formats plus petits ou éclatés apportent davantage de relief. Le calepinage doit être préparé avant la livraison pour répartir les nuances et limiter les coupes visibles. UNIVMAR peut préparer les quantités, les formats et les finitions en tenant compte de la surface réelle et de la logistique du site.",
          ],
        },
        {
          title: "Taza et Oued Amlil : vérifier la provenance utile au projet",
          paragraphs: [
            "Oued Amlil est un repère géographique fréquemment associé aux pierres de la région de Taza. Pour un projet, l'information utile n'est pas seulement le nom de la zone : faites confirmer la référence, la disponibilité du lot, la couleur, la finition, l'épaisseur et le format réellement proposés. Cela permet de comparer des offres sur une base technique plutôt que sur une simple appellation d'origine.",
            "UNIVMAR travaille avec des carrières partenaires puis prépare la pierre à l'atelier de Temara. Avant la transformation, nous recommandons de valider l'échantillon, le calepinage et les détails de pose avec le professionnel du chantier, notamment pour une façade, une plage de piscine ou une surface exposée à l'eau.",
          ],
        },
        {
          title: "Prix de la pierre de Taza au Maroc : les éléments à comparer",
          paragraphs: [
            "Le prix de la pierre de Taza dépend de la couleur, de la sélection du lot, de l'épaisseur, du format, de la finition, du volume, des découpes et du transport. Un parement éclaté, une dalle bouchardée et une pierre polie ne demandent pas le même travail. Un prix au m² peut servir de point de départ, mais ne remplace pas un devis qui indique précisément ce qui est fourni et préparé.",
            "Pour recevoir une réponse claire, envoyez les surfaces, les plans ou photos, l'usage prévu, la finition souhaitée, la ville et le délai. Comparez ensuite les offres sur la même base : matière, format, épaisseur, traitement, livraison et pose éventuelle. Cette méthode permet de décider sur la qualité et l'adéquation du matériau, pas uniquement sur le prix affiché.",
          ],
        },
        {
          title: "Demander une pierre de Taza pour un projet au Maroc",
          paragraphs: [
            "Depuis Temara, UNIVMAR accompagne les projets de pierre de Taza à Rabat, Casablanca, Taza, Marrakech et dans d'autres villes selon les volumes et le planning. Une demande complète indique si le projet est une façade, une clôture, une terrasse, un patio, une plage de piscine ou un mur intérieur. Cette information permet de proposer une finition pertinente dès le début.",
            "Avant la commande, validez la référence disponible, l'échantillon, la répartition des nuances, les dimensions et la méthode de pose. Pour les grandes surfaces, anticipez aussi les accès, le stockage et la séquence de livraison. Une préparation sérieuse protège l'aspect naturel de la pierre et évite les retards au moment où le chantier doit avancer.",
          ],
        },
      ],
      imageSources: [
        "/images/Marbre%20local/images/Beige_taza_bouchard%C3%A9.jpg",
        "/images/Pierre%20Naturelle%26Tahejart/images/Eclat%C3%A9_beige_taza.jpg",
        "/images/Marbre%20local/images/Gris_taza_sabl%C3%A9.jpg",
      ],
      applications: ["Façade", "Sol extérieur", "Mur", "Terrasse", "Villa", "Hôtel", "Projet commercial"],
      whyTitle: "Pourquoi choisir UNIVMAR pour la pierre de Taza",
      whyPoints: [
        "Sélection de Beige Taza, Gris Taza et pierres éclatées auprès de carrières partenaires",
        "Conseil sur la finition : éclatée, bouchardée, vieillie, sablée, brute ou polie",
        "Atelier à Temara et livraison à Rabat, Casablanca, Taza et partout au Maroc",
        "Accompagnement des architectes, promoteurs, entreprises et particuliers",
      ],
      faq: [
        {
          q: "Pierre Taza et pierre de Taza : est-ce le même matériau ?",
          a: "Dans la plupart des demandes, oui : « pierre Taza » est une formulation de recherche ou de devis pour la pierre de Taza. La bonne référence se choisit ensuite selon la couleur, le lot, la finition, l'épaisseur et l'usage intérieur ou extérieur.",
        },
        {
          q: "Que signifie la recherche « Pierre Oued Amlil » ?",
          a: "Cette formulation renvoie généralement à une pierre de la région de Taza associée au repère géographique d'Oued Amlil. Pour un projet, demandez surtout la référence disponible, la couleur, la finition, l'épaisseur et l'échantillon du lot avant de comparer les offres.",
        },
        {
          q: "Quel est le prix de la pierre de Taza au Maroc ?",
          a: "Le prix dépend de la couleur, du format, de l'épaisseur, de la finition, de la quantité et de la livraison. Une pierre de Taza bouchardée, éclatée, vieillie ou polie ne demande pas le même travail. UNIVMAR prépare un devis personnalisé après étude du projet.",
        },
        {
          q: "Quelle est la différence entre Beige Taza et Gris Taza ?",
          a: "Le Beige Taza donne un rendu plus chaud et lumineux, souvent choisi pour les villas, terrasses et façades claires. Le Gris Taza apporte une lecture plus contemporaine et graphique, intéressante pour les murs, sols extérieurs et projets commerciaux.",
        },
        {
          q: "La pierre de Taza convient-elle pour une façade extérieure ?",
          a: "Oui, la pierre de Taza est très utilisée en façade, surtout en finition éclatée, brute, bouchardée ou sablée. Le choix doit tenir compte du support, de l'exposition et du système de pose.",
        },
        {
          q: "Peut-on utiliser la pierre de Taza pour un sol extérieur ?",
          a: "Oui, avec une finition adaptée comme bouchardée, sablée ou vieillie. Ces finitions offrent une meilleure accroche pour les terrasses, patios, allées et abords de piscine.",
        },
        commonFaq[2],
        commonFaq[3],
      ],
      internalLinks: [
        { label: "Marbre de Taza", href: "/marbre-de-taza" },
        { label: "Marbre local marocain", href: "/marbre-local-maroc" },
        { label: "Marbre Maroc : matériaux et devis", href: "/marbre-maroc" },
        { label: "Beige Taza poli", href: "/produits/beige-taza-polli" },
        { label: "Éclaté Beige Taza", href: "/produits/eclate-beige-taza" },
        { label: "Guide pierre de Taza (blog)", href: "/blog/guide-pierre-de-taza-2026" },
        { label: "Où acheter pierre de Taza", href: "/blog/ou-acheter-pierre-de-taza-maroc" },
        { label: "Demander un devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Taza stone",
      metaTitle: "Taza stone Morocco | Beige & Grey Taza | UNIVMAR",
      metaDescription: "Taza stone for façades, terraces and pools. Beige Taza, Grey Taza. UNIVMAR Temara.",
      h1: "Taza stone — Morocco's outdoor reference",
      intro: "Taza stone is Morocco's most sought-after natural limestone for façades, terraces and pools. UNIVMAR supplies Beige and Grey Taza from Temara.",
    },
    {
      navLabel: "حجر تازة",
      metaTitle: "حجر تازة الطبيعي: الاستخدامات والتشطيبات وطلب عرض السعر | UNIVMAR",
      metaDescription: "تعرّف على حجر تازة الطبيعي واستخداماته في الأرضيات والواجهات. اطلب نصيحة وعرض سعر لمشروعك.",
      h1: "حجر تازة — المرجع المغربي للخارج",
      intro: "حجر تازة حجر طبيعي مغربي مطلوب للواجهات والتراسات والمسابح. توفر UNIVMAR بيجي تازة ورمادي تازة من تمارة مع توجيه واضح حول التشطيب والمقاس والاستعمال.",
      dateModified: "2026-07-25",
      sections: [
        {
          title: "ما هو حجر تازة وما علاقته بوادي أمليل؟",
          paragraphs: [
            "حجر تازة حجر جيري طبيعي من منطقة تازة في شمال شرق المغرب، وترتبط به في البحث والتجارة تسمية وادي أمليل أيضاً. لا يكفي الاسم وحده لاختيار مادة للمشروع: تختلف الدفعات ودرجات البيجي والرمادي والتشطيبات والمقاسات، لذلك يبدأ الاختيار من الاستعمال الفعلي لا من صورة أو اسم مختصر.",
            "تُحضّر UNIVMAR الحجر المختار في ورشتها بتمارة وتساعد على تحديد المرجع المناسب للواجهة أو التراس أو المسبح أو الجدار. قبل الطلب، يجب تأكيد العينة والتشطيب والسماكة والكمية وطريقة التركيب مع مهندس أو مركب مؤهل.",
          ],
        },
        {
          title: "تشطيبات حجر تازة للواجهة والتراس والمسبح",
          paragraphs: [
            "للواجهات والأسوار، يمنح الحجر المتشقق أو الخام أو الرملي ملمساً معدنياً واضحاً. وللأرضيات الخارجية والتراسات وحواف المسبح، يكون التشطيب المبوشارد أو الرملي أو المعتق أكثر ملاءمة غالباً لأنه يضيف تماسكاً تحت القدم. أما المصقول أو الملسّن فيُدرس للداخل أو المناطق المحمية بحسب الاستخدام والصيانة.",
            "يتغير المظهر والأداء مع التشطيب. لذلك لا تقارنوا عرض حجر متشقق بعرض بلاط مبوشارد بالمتر المربع فقط؛ اطلبوا وصفاً واضحاً للمادة والسمك والمقاس والحواف والمعالجة والنقل.",
          ],
        },
        {
          title: "كيف تختارون بيجي تازة أو رمادي تازة؟",
          paragraphs: [
            "بيجي تازة دافئ ومضيء ويظهر جيداً مع الواجهات الفاتحة والخشب والحدائق الجافة. رمادي تازة يقدّم قراءة أكثر هدوءاً ومعاصرة، خصوصاً مع الألمنيوم الداكن والزجاج. الاختيار الجيد لا يعتمد على اللون وحده؛ اتجاه الواجهة والشمس ونظام المفاصل ومساحة السطح تؤثر في النتيجة النهائية.",
            "في المساحات الكبيرة، يفضّل اعتماد عينة من الدفعة الفعلية قبل القص. هذا يساعد على توزيع التدرجات الطبيعية بصورة متوازنة وعلى تجنب المفاجآت بين الصورة والعقار المنفذ.",
          ],
        },
        {
          title: "طلب عرض حجر تازة واضح",
          paragraphs: [
            "أرسلوا نوع المشروع، المساحة أو المخطط، المدينة، الاستعمال، التشطيب المرغوب والصور إن وجدت. يفيد ذكر ما إذا كان الموقع واجهة أو تراساً أو محيط مسبح أو جداراً داخلياً لأن طريقة التثبيت والميل وتصريف الماء قد تغير الاختيار.",
            "تخدم UNIVMAR المشاريع من تمارة إلى الرباط والدار البيضاء وتازة ومراكش ومدن أخرى حسب الكمية والبرنامج. يمكن للفريق إعداد عرض يشمل المادة والتشطيب والتحويل وخيارات النقل بصورة قابلة للمقارنة.",
          ],
        },
      ],
      applications: ["واجهة", "تراس", "مسبح", "سور", "ممر", "جدار", "فيلا", "فندق"],
      whyTitle: "لماذا تختارون UNIVMAR لحجر تازة؟",
      whyPoints: [
        "اختيار بيجي تازة ورمادي تازة وتشطيبات خارجية حسب الاستعمال",
        "تحضير وقص في ورشة تمارة حسب المخططات والمقاسات",
        "مساعدة في مقارنة العينة والتشطيب والسماكة قبل الطلب",
        "توصيل إلى الرباط والدار البيضاء وتازة ومراكش ومناطق أخرى",
      ],
      faq: [
        { q: "هل حجر تازة مناسب للواجهة؟", a: "نعم، بشرط اختيار التشطيب ونظام التثبيت المناسبين للسطح والتعرض. يجب مراجعة التركيب مع المختص بالمشروع." },
        { q: "هل حجر تازة مناسب للتراس أو المسبح؟", a: "نعم، غالباً بتشطيب مبوشارد أو رملي أو معتق مع سماكة وميل وتصريف ماء مناسبين." },
        { q: "ما معنى حجر وادي أمليل؟", a: "هو تعبير مرتبط بمنطقة وادي أمليل ضمن محيط تازة. عند طلب العرض، الأهم تأكيد المرجع والدفعة والتشطيب والمقاس المقترح فعلياً." },
        { q: "كيف أطلب عرض سعر؟", a: "أرسلوا المساحة أو المخطط والاستخدام والتشطيب والمدينة والمدة المتوقعة، ثم يقترح الفريق مادة مناسبة للمشروع." },
      ],
      internalLinks: [
        { label: "رخام تازة", href: "/marbre-de-taza" },
        { label: "دليل حجر تازة", href: "/blog/guide-pierre-de-taza-2026" },
        { label: "حجر تازة ووادي أمليل", href: "/blog/pierre-de-taza-oued-amlil-guide-chantier" },
        { label: "طلب عرض سعر", href: "/contact" },
      ],
    },
  ),
  "marbre-de-taza": bundle(
    {
      navLabel: "Marbre de Taza",
      metaTitle: "Marbre de Taza | Beige Taza, Gris Taza & marbre local | UNIVMAR",
      metaDescription:
        "Marbre de Taza au Maroc : Beige Taza, Gris Taza et finitions polie, adoucie, bouchardée. UNIVMAR Temara — sols, salles de bain, halls. Devis gratuit.",
      h1: "Marbre de Taza — marbre local marocain d'exception",
      intro:
        "Le marbre de Taza désigne les calcaires nobles extraits de la région de Taza, travaillés en finitions intérieures et extérieures : Beige Taza poli, Gris Taza, adouci ou bouchardé. C'est l'un des marbres locaux les plus demandés au Maroc pour les sols, halls, salles de bain, escaliers et murs décoratifs. UNIVMAR sélectionne le marbre de Taza auprès de carrières partenaires, le transforme à Temara et le livre à Rabat, Casablanca, Marrakech et partout au Maroc.",
      sections: [
        {
          title: "Qu'est-ce que le marbre de Taza ?",
          paragraphs: [
            "Le marbre de Taza est un calcaire marocain issu des formations géologiques de la région de Taza, au nord-est du Maroc. Selon la finition et le lot, on parle de Beige Taza, Gris Taza ou de variantes avec de légères fossilisations. En langage chantier, « marbre de Taza » et « pierre de Taza » se croisent souvent : la même origine géologique, des usages qui se distinguent surtout par la finition et l'exposition.",
            "En poli ou adouci, le marbre de Taza révèle une surface lisse, lumineuse, idéale pour l'intérieur. En bouchardé, sablé ou éclaté, il se comporte comme une pierre de façade ou de terrasse — c'est alors la pierre de Taza au sens extérieur. UNIVMAR clarifie ce choix avec vous selon le projet : villa, hôtel, commerce ou institutionnel.",
          ],
        },
        {
          title: "Beige Taza et Gris Taza : deux signatures",
          paragraphs: [
            "Le Beige Taza apporte chaleur et clarté. Il s'accorde avec le bois, le laiton, les enduits clairs et l'architecture méditerranéenne. Le Gris Taza, plus contemporain, structure les volumes, contraste avec les menuiseries noires et convient aux projets minimalistes ou aux halls d'entreprise.",
            "La cohérence du lot est essentielle : sur un sol de 80 m², les variations de ton doivent rester harmonieuses. C'est pourquoi UNIVMAR contrôle les plaques avant découpe et vous invite à valider un échantillon ou une visite d'atelier à Temara avant la commande définitive.",
          ],
        },
        {
          title: "Usages du marbre de Taza",
          paragraphs: [
            "En intérieur, le marbre de Taza polie ou adoucie habille sols de salon, halls d'entrée, escaliers, salles de bain et murs d'accent. En extérieur, les finitions texturées (bouchardé, vieilli, éclaté) équipent façades, terrasses et abords de piscine. Beaucoup de projets combinent les deux : marbre de Taza poli en hall et pierre de Taza bouchardée en terrasse pour une continuité visuelle.",
            "UNIVMAR découpe sur mesure : dalles, marches, plinthes, plans vasques et formats façade. Nous adaptons l'épaisseur (souvent 2 cm en intérieur, 2 à 3 cm en extérieur selon pose) et la finition de chant à vos plans d'architecte.",
          ],
        },
        {
          title: "Pourquoi choisir UNIVMAR pour le marbre de Taza",
          paragraphs: [
            "Entreprise marocaine fondée en 2004, UNIVMAR maîtrise la chaîne complète : sélection carrière, transformation à Temara, conseil finition et livraison nationale. Vous ne multipliez pas les intermédiaires : un interlocuteur pour le marbre de Taza, la pierre de Taza, le marbre importé et le granit.",
            "Pour un devis marbre de Taza, indiquez surfaces, usages, finitions souhaitées et ville de chantier. Nous répondons sous 24 heures ouvrées avec une proposition claire — matériau, quantité estimée, options et conditions de livraison.",
          ],
        },
      ],
      applications: ["Sol intérieur", "Hall", "Salle de bain", "Escalier", "Façade", "Terrasse", "Villa", "Hôtel"],
      whyTitle: "Pourquoi UNIVMAR pour le marbre de Taza",
      whyPoints: [
        "Spécialiste Beige Taza, Gris Taza et finitions sur mesure",
        "Atelier de transformation à Temara (Ain Atiq)",
        "Livraison Rabat, Casablanca, Marrakech, Taza et Maroc entier",
        "Conseil usage intérieur vs extérieur et devis personnalisé",
      ],
      faq: [
        {
          q: "Quelle différence entre marbre de Taza et pierre de Taza ?",
          a: "Même origine régionale. On parle plutôt de marbre de Taza pour les finitions polies ou adoucies en intérieur, et de pierre de Taza pour les finitions texturées en extérieur. UNIVMAR vous oriente selon l'usage exact.",
        },
        {
          q: "Le marbre de Taza convient-il aux salles de bain ?",
          a: "Oui, en finition polie ou adoucie avec joints et entretien adaptés. Un traitement hydrofuge et un nettoyage neutre prolongent la beauté de la surface.",
        },
        {
          q: "Quel est le prix du marbre de Taza au Maroc ?",
          a: "Le prix dépend de la finition, l'épaisseur, le volume et la logistique. Demandez un devis gratuit : nous chiffrons votre projet sans engagement.",
        },
        {
          q: "Livrez-vous le marbre de Taza hors de Temara ?",
          a: "Oui. Nous livrons régulièrement Rabat, Casablanca, Marrakech, Taza et d'autres villes du Maroc selon volume et planning chantier.",
        },
        commonFaq[3],
      ],
      internalLinks: [
        { label: "Pierre de Taza", href: "/pierre-de-taza" },
        { label: "Marbre Maroc", href: "/marbre-maroc" },
        { label: "Guide marbre de Taza (blog)", href: "/blog/marbre-de-taza-guide" },
        { label: "Marbre vs pierre de Taza", href: "/blog/marbre-de-taza-vs-pierre-de-taza" },
        { label: "Beige Taza poli", href: "/produits/beige-taza-polli" },
        { label: "Demander un devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Taza marble",
      metaTitle: "Taza marble | Beige & Grey Taza local marble | UNIVMAR",
      metaDescription:
        "Taza marble in Morocco: Beige Taza, Grey Taza, polished and textured finishes. UNIVMAR Temara — floors, halls, bathrooms. Free quote.",
      h1: "Taza marble — exceptional Moroccan local marble",
      intro:
        "Taza marble is noble limestone from the Taza region, finished for interiors and exteriors: polished Beige Taza, Grey Taza, honed or bush-hammered. UNIVMAR sources, fabricates in Temara and delivers across Morocco.",
    },
    {
      navLabel: "رخام تازة",
      metaTitle: "رخام تازة: الأنواع والتشطيبات وطلب عرض السعر | UNIVMAR",
      metaDescription:
        "اكتشف رخام تازة، استخداماته وتشطيباته المناسبة للمشاريع. اطلب استشارة وعرض سعر مخصصاً لمشروعك.",
      h1: "رخام تازة — رخام محلي مغربي استثنائي",
      intro:
        "رخام تازة رخام محلي من منطقة تازة، يُختار للأرضيات والقاعات والحمامات والجدران بحسب التشطيب. توفر UNIVMAR بيجي تازة ورمادي تازة مع تحويل في تمارة وتوصيل في المغرب.",
      dateModified: "2026-07-25",
      sections: [
        {
          title: "رخام تازة للداخل: متى يكون الاختيار مناسباً؟",
          paragraphs: [
            "يُستخدم رخام تازة غالباً في الأرضيات الداخلية والمداخل والسلالم والحمامات والجدران البارزة عندما يكون المطلوب سطحاً مصقولاً أو ملسّناً ومظهراً معدنياً محلياً. ويختلف عن حجر تازة الخارجي في التشطيب المقترح وسلوك السطح، لا في الاسم وحده.",
            "قبل الاختيار، حدّدوا الغرفة ودرجة الاستعمال والتعرض للماء وطريقة التنظيف. هذا يسمح بمقارنة بيجي تازة ورمادي تازة وبقية البدائل على أساس واقعي، خصوصاً في الحمامات والمداخل والمشاريع ذات المساحات الكبيرة.",
          ],
        },
        {
          title: "بيجي تازة ورمادي تازة: عينة الدفعة أهم من الصورة",
          paragraphs: [
            "بيجي تازة يعطي دفئاً وإضاءة مناسبة للصالات والفيلات، بينما يقدّم رمادي تازة حضوراً أكثر هدوءاً للمداخل والمكاتب والتصميمات المعاصرة. وتبقى التدرجات الطبيعية جزءاً من هوية الحجر، لذلك من الأفضل مراجعة العينة المتاحة واللوح قبل اعتماد المشروع النهائي.",
            "في الأرضيات والسلالم، يحدد اتجاه القص وتوزيع الألواح ولون الفواصل النتيجة بقدر أهمية اللون. يساعد المخطط أو المساحة الدقيقة على التحضير وتقليل القصات غير المتوقعة في الموقع.",
          ],
        },
        {
          title: "رخام تازة أم حجر تازة؟",
          paragraphs: [
            "لأرضية صالون أو ردهة أو حمام أو درج داخلي، يُناقش رخام تازة المصقول أو الملسّن عادةً. للواجهة أو التراس أو محيط المسبح، يكون حجر تازة بتشطيب ذي ملمس أوضح خياراً أكثر منطقية في الغالب. القرار النهائي يعتمد على التعرض والميل والتثبيت والصيانة.",
            "يمكن لمشروع واحد أن يجمع التشطيبين من العائلة نفسها: رخام تازة للداخل وحجر تازة للخارج. يحقق ذلك تواصلاً في اللون مع احترام حاجة كل سطح.",
          ],
        },
        {
          title: "عرض سعر رخام تازة من UNIVMAR",
          paragraphs: [
            "للحصول على عرض واضح، أرسلوا المساحة أو المخطط، الاستعمال، التشطيب المطلوب، السماكة إن كانت محددة ومدينة المشروع. يوضح العرض المرجع والتحويل والقص والنقل بدلاً من الاكتفاء بسعر متر مربع غير قابل للمقارنة.",
            "تستقبل UNIVMAR طلبات المشاريع في تمارة والرباط والدار البيضاء وتازة ومراكش ومناطق أخرى. يمكنكم كذلك زيارة الورشة أو طلب عينة لتأكيد المرجع قبل بدء التحويل.",
          ],
        },
      ],
      applications: ["أرضية", "ردهة", "حمام", "درج", "جدار", "فندق", "فيلا", "مكتب"],
      whyTitle: "لماذا UNIVMAR لرخام تازة؟",
      whyPoints: [
        "اختيار بيجي تازة ورمادي تازة حسب الغرفة والاستعمال",
        "تحويل وقص حسب الطلب في تمارة",
        "تأكيد العينة والتشطيب قبل البدء في المشروع",
        "توصيل للمشاريع في المغرب حسب الحجم والبرنامج",
      ],
      faq: [
        { q: "هل رخام تازة مناسب للحمام؟", a: "يمكن استخدامه مع تشطيب ومعالجة وصيانة مناسبين. راجعوا تعرض السطح للماء ومنتجات التنظيف قبل الاختيار." },
        { q: "ما الفرق بين رخام تازة وحجر تازة؟", a: "غالباً يستخدم رخام تازة للتشطيبات الداخلية المصقولة أو الملسنة، وحجر تازة للتشطيبات الخارجية ذات الملمس. الاختيار يتبع الاستعمال الفعلي." },
        { q: "كيف أطلب سعر رخام تازة؟", a: "أرسلوا المساحة والاستخدام والتشطيب والسماكة والمدينة للحصول على عرض قابل للمقارنة." },
        { q: "هل توصلون خارج تمارة؟", a: "نعم، حسب حجم الطلب والبرنامج يمكن تنظيم التوصيل إلى مدن مغربية متعددة." },
      ],
      internalLinks: [
        { label: "حجر تازة", href: "/pierre-de-taza" },
        { label: "مقارنة رخام تازة وحجر تازة", href: "/blog/marbre-de-taza-vs-pierre-de-taza" },
        { label: "دليل رخام تازة", href: "/blog/marbre-de-taza-guide" },
        { label: "طلب عرض سعر", href: "/contact" },
      ],
    },
  ),
  "prix-marbre-maroc": bundle(
    {
      navLabel: "Prix marbre",
      metaTitle: "Prix marbre Maroc 2026 | Prix marbre m² & granit | UNIVMAR",
      metaDescription:
        "Prix marbre Maroc et prix marbre m² : fourchettes indicatives, facteurs de devis, marbre local, Crema Marfil, Volubilis, granit m². Devis gratuit UNIVMAR Temara.",
      h1: "Prix du marbre au Maroc — guide m² et devis 2026",
      intro:
        "Vous cherchez le prix marbre Maroc ou le prix marbre m² Maroc avant de contacter un fournisseur ? C’est la question la plus fréquente des particuliers, cuisinistes et architectes. Il n’existe pas un tarif unique : le prix du marbre au m² dépend de la référence (local ou importé), de la finition, de l’épaisseur, du volume et de la découpe. Cette page explique comment se construit un devis UNIVMAR — marbre, granit et pierre naturelle — depuis notre atelier à Temara, avec livraison Rabat, Casablanca, Marrakech et tout le Maroc.",
      sections: [
        {
          title: "Prix marbre m² Maroc : ce qui fait varier le devis",
          paragraphs: [
            "Le prix marbre m² Maroc affiché sans contexte (finition, épaisseur, lot, livraison) n’est pas comparable d’un chantier à l’autre. Un sol de 40 m² en marbre local poli 2 cm n’a pas la même structure de coût qu’un plan de travail avec découpes évier et plaque, ni qu’une façade en pierre de Taza bouchardée 3 cm.",
            "Chez UNIVMAR, le devis intègre la matière, la finition machine (poli, adouci, bouchardé, sablé, éclaté…), l’épaisseur, les chutes liées au calepinage, les découpes sur mesure et la logistique vers votre chantier. C’est pour cela que nous travaillons sur devis personnalisé plutôt que sur un catalogue figé en ligne.",
          ],
        },
        {
          title: "Fourchettes indicatives de prix marbre et pierre (matière)",
          paragraphs: [
            "À titre indicatif et selon les références catalogue UNIVMAR (matière et finition de base, hors pose, hors découpes complexes, susceptibles d’évoluer selon lot et saison 2026) :",
            "Pierre naturelle et éclatés (ardoise, éclaté beige/gris Taza, etc.) : souvent à partir d’environ 120 à 180 MAD/m². Marbre local et finitions Taza (beige, gris, vieilli, bouchardé, poli selon référence) : souvent entre environ 180 et 400 MAD/m². Marbres locaux premium type Volubilis, Noir Azilal ou Rouge Agadir : plutôt dans le haut de cette fourchette (souvent autour de 350 à 400 MAD/m² selon lot). Marbre importé (Crema Marfil, Volakas, Arabiscato, etc.) et granit importé : chiffrés sur devis selon disponibilité, format de plaque et cours d’importation — en règle générale au-dessus du marbre local standard.",
            "Ces ordres de grandeur aident à cadrer un budget ; seul un devis projet (surfaces, plans, ville, finitions) donne un prix marbre Maroc fiable. Demandez le vôtre gratuitement sous 24 h ouvrées.",
          ],
        },
        {
          title: "Prix granit m² Maroc et plans de travail",
          paragraphs: [
            "Le prix granit m² Maroc suit la même logique : référence (Noir Absolu, Noir Galaxy, Rose Porino, Blanc Perle…), épaisseur 2 ou 3 cm, finition et surtout découpes. Un granit en dalle pour sol ne se chiffre pas comme un plan de travail cuisine avec réservations d’évier, plaque de cuisson et chants spéciaux.",
            "Pour un plan de travail en marbre ou granit, le prix se calcule souvent à la pièce ou au mètre linéaire transformé, pas seulement au m² matière. UNIVMAR découpe sur mesure à Temara : envoyez les plans du cuisiniste ou un croquis coté pour un chiffrage précis. Voir aussi notre page Plan de travail marbre.",
          ],
        },
        {
          title: "Prix par type : local, Taza, importé, Crema Marfil, Volubilis",
          paragraphs: [
            "Marbre de Taza et pierre de Taza : excellent rapport qualité-prix pour sols, halls, façades et terrasses selon finition. Volubilis : marbre local recherché, souvent positionné plus haut que les finitions Taza standards. Crema Marfil et autres cremas importés : demandés pour halls et salles de bain lumineuses ; le prix dépend du stock et de la qualité du lot (veinage, pureté du fond).",
            "Pour un comparatif détaillé Crema Marfil / Volubilis et facteurs de prix, consultez notre article de blog dédié. Pour un prix pierre de Taza, voir aussi le guide prix pierre de Taza.",
          ],
        },
        {
          title: "Comment obtenir un devis prix marbre Maroc chez UNIVMAR",
          paragraphs: [
            "Préparez : usage (sol, mur, plan de travail, façade), surface approximative ou plans, finition souhaitée, épaisseur si connue, ville du chantier et délai. Photos d’inspiration ou d’échantillons aident. Nous répondons avec matériau recommandé, alternatives budgétaires et conditions de livraison.",
            "Atelier : Ouled Slama, Ain Atiq, Temara. Téléphone / WhatsApp : +212 660-419991. E-mail : contact@universmarbre.com. Visite d’atelier pour valider les plaques avant commande — le meilleur moyen d’éviter les écarts entre photo et réalité.",
          ],
        },
      ],
      applications: ["Sol m²", "Plan de travail", "Façade", "Salle de bain", "Escalier", "Villa", "Hôtel", "Cuisine"],
      whyTitle: "Pourquoi un devis UNIVMAR plutôt qu’un prix au hasard",
      whyPoints: [
        "Fourchettes transparentes + chiffrage projet réel",
        "Atelier Temara : finition et découpe contrôlées",
        "Marbre local, marbre importé, granit et pierre naturelle",
        "Livraison Rabat, Casablanca, Marrakech, Taza et Maroc",
      ],
      faq: [
        {
          q: "Quel est le prix marbre m² Maroc en 2026 ?",
          a: "Indicativement, le marbre local et les finitions type Taza se situent souvent entre environ 180 et 400 MAD/m² matière selon référence et finition. Le marbre importé et les projets sur mesure se chiffrent à part. Demandez un devis pour votre surface exacte.",
        },
        {
          q: "Pourquoi le prix marbre Maroc varie-t-il autant ?",
          a: "Parce que la référence, la finition, l’épaisseur, le volume, les découpes et la livraison changent le coût total. Un prix m² sans ces détails n’est pas comparable.",
        },
        {
          q: "Quel est le prix granit m² Maroc ?",
          a: "Le granit importé se chiffre sur devis (référence, format, épaisseur, découpes). Pour un plan de travail, le coût de transformation pèse autant que le m² matière.",
        },
        {
          q: "Le prix inclut-il la pose ?",
          a: "Nos devis matière et transformation UNIVMAR ne remplacent pas le devis poseur. Nous pouvons vous conseiller sur la finition adaptée à la pose prévue.",
        },
        {
          q: "Comment obtenir mon prix marbre Maroc rapidement ?",
          a: "Contactez UNIVMAR avec surfaces, usage, finition et ville : devis gratuit sous 24 heures ouvrées. Tél. +212 660-419991.",
        },
      ],
      internalLinks: [
        { label: "Plan de travail marbre", href: "/plan-de-travail-marbre" },
        { label: "Marbre Maroc", href: "/marbre-maroc" },
        { label: "Granit Maroc", href: "/granit-maroc" },
        { label: "Prix Crema Marfil & Volubilis", href: "/blog/prix-marbre-crema-marfil-volubilis" },
        { label: "Prix pierre de Taza", href: "/blog/prix-pierre-de-taza-maroc" },
        { label: "Demander un devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Marble prices",
      metaTitle: "Marble price Morocco 2026 | m² marble & granite | UNIVMAR",
      metaDescription:
        "Marble price Morocco and price per m²: indicative ranges, quote factors, local marble, granite m². Free quote UNIVMAR Temara.",
      h1: "Marble prices in Morocco — m² guide and 2026 quotes",
      intro:
        "Looking for marble price Morocco or price per m² before contacting a supplier? There is no single tariff: price depends on stone, finish, thickness, volume and cutting. UNIVMAR explains how quotes are built from Temara.",
    },
    {
      navLabel: "سعر الرخام",
      metaTitle: "سعر الرخام في المغرب 2026 | سعر المتر والجرانيت | UNIVMAR",
      metaDescription:
        "سعر الرخام في المغرب وسعر المتر المربع: نطاقات إرشادية وعوامل العرض. عرض سعر مجاني UNIVMAR تمارة.",
      h1: "سعر الرخام في المغرب — دليل المتر وعرض السعر 2026",
      intro:
        "تبحثون عن سعر الرخام في المغرب أو سعر المتر قبل الاتصال بمورد؟ لا يوجد تعريفة واحدة: يعتمد السعر على المرجع والتشطيب والسماكة والحجم والقص. توضح UNIVMAR كيف يُبنى عرض السعر من تمارة.",
    },
  ),
  "plan-de-travail-marbre": bundle(
    {
      navLabel: "Plan de travail",
      metaTitle: "Plan de travail marbre cuisine | Sur mesure Maroc | UNIVMAR",
      metaDescription:
        "Plan de travail marbre cuisine et plan de travail en marbre ou granit sur mesure au Maroc. Découpe Temara, devis gratuit, pose prête chantier.",
      h1: "Plan de travail marbre cuisine — sur mesure au Maroc",
      intro:
        "Un plan de travail marbre cuisine ou un plan de travail en marbre (ou granit) transforme la cuisine et les salles d’eau. UNIVMAR fabrique des plans de travail sur mesure à Temara : gabarits, découpes évier et plaque, chants, finitions polies ou adoucies, pour particuliers, cuisinistes et architectes à Rabat, Casablanca, Marrakech et partout au Maroc.",
      sections: [
        {
          title: "Plan de travail en marbre ou en granit ?",
          paragraphs: [
            "Le plan de travail marbre séduit par ses veinages uniques (Crema Marfil, Volakas, marbre local clair, etc.) et un rendu très haut de gamme. Il demande un entretien attentif face aux acides (citron, vinaigre). Le granit (Noir Absolu, Noir Galaxy, Rose Porino…) résiste mieux aux rayures et à la chaleur ponctuelle — souvent le choix le plus serein pour une cuisine intensive.",
            "UNIVMAR compare avec vous usage réel, style de meubles et budget. Beaucoup de projets combinent un plan granit en zone cuisson et un marbre en îlot ou salle de bain. Voir aussi notre article granit vs marbre plan de travail.",
          ],
        },
        {
          title: "Fabrication sur mesure : ce qui est inclus",
          paragraphs: [
            "Le sur-mesure commence par le gabarit ou les plans du cuisiniste : longueur, profondeur, découpes évier sous plan ou à poser, plaque de cuisson, robinetterie, angles et retours. Les chants peuvent être droits, arrondis ou biseautés. L’épaisseur courante est 2 ou 3 cm selon le rendu et la portée.",
            "À Temara, nous découpons, polissons et préparons le plan pour une pose propre. Le prix d’un plan de travail marbre cuisine dépend de la matière, de la surface, du nombre de découpes et des chants — pas seulement du m² catalogue. Un devis précis suit vos cotes.",
          ],
        },
        {
          title: "FAQ sur-mesure plans de travail",
          paragraphs: [
            "Délais : variables selon stock matière et charge atelier — anticipez avec le planning cuisine. Joints : sur longs linéaires, un joint peut être nécessaire ; nous l’anticipons au calepinage. Crédence : même matière ou contraste (quartz, carrelage, marbre plus clair). Entretien marbre : savon neutre, pas d’acide ; hydrofuge recommandé.",
            "Plans de toilette et vasques : même savoir-faire sur mesure pour salles de bain et hôtels. Tables et pièces décoratives en pierre naturelle sur demande.",
          ],
        },
        {
          title: "Prix plan de travail marbre au Maroc",
          paragraphs: [
            "Le prix d’un plan de travail en marbre au Maroc se chiffre à la pièce transformée. La matière (local vs importé), l’épaisseur, les découpes et la complexité des chants pèsent autant que le m². Pour des fourchettes matière et la logique de devis, consultez notre page Prix marbre Maroc.",
            "Envoyez plans ou mesures : devis gratuit sous 24 h ouvrées. Tél. / WhatsApp +212 660-419991 — contact@universmarbre.com.",
          ],
        },
      ],
      applications: ["Cuisine", "Îlot", "Crédence", "Salle de bain", "Vasque", "Bar", "Hôtel", "Sur mesure"],
      whyTitle: "Pourquoi UNIVMAR pour votre plan de travail",
      whyPoints: [
        "Découpe et finition sur mesure à Temara",
        "Marbre et granit : conseil selon usage cuisine",
        "Coordination cuisinistes, architectes et particuliers",
        "Livraison nationale et devis transparent",
      ],
      faq: [
        {
          q: "Quel matériau pour un plan de travail marbre cuisine ?",
          a: "Le marbre offre un veinage spectaculaire ; le granit est souvent plus résistant au quotidien. UNIVMAR vous oriente selon vos habitudes de cuisine et le style des meubles.",
        },
        {
          q: "Faites-vous les plans de travail sur mesure ?",
          a: "Oui. Gabarit ou plans, découpes évier/plaque, chants et finitions sont réalisés à l’atelier de Temara.",
        },
        {
          q: "Quel est le prix d’un plan de travail en marbre ?",
          a: "Il dépend de la référence, de la surface, de l’épaisseur et des découpes. Demandez un devis avec vos cotes pour un chiffrage réel.",
        },
        {
          q: "Livrez-vous hors de Rabat-Temara ?",
          a: "Oui, livraison Casablanca, Marrakech et autres villes du Maroc selon volume et accès.",
        },
        commonFaq[3],
      ],
      internalLinks: [
        { label: "Prix marbre Maroc", href: "/prix-marbre-maroc" },
        { label: "Granit Maroc", href: "/granit-maroc" },
        { label: "Granit vs marbre (blog)", href: "/blog/granit-vs-marbre-plan-de-travail" },
        { label: "Crema Marfil", href: "/produits/crema-marfil" },
        { label: "Noir Absolu", href: "/produits/noir-absolu" },
        { label: "Demander un devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Worktops",
      metaTitle: "Marble kitchen worktop | Custom Morocco | UNIVMAR",
      metaDescription:
        "Marble kitchen worktop and custom marble or granite worktops in Morocco. Temara fabrication, free quote.",
      h1: "Marble kitchen worktop — custom-made in Morocco",
      intro:
        "A marble or granite kitchen worktop transforms the space. UNIVMAR fabricates custom worktops in Temara: templates, sink and hob cut-outs, edges and finishes for homes and pros across Morocco.",
    },
    {
      navLabel: "سطح العمل",
      metaTitle: "سطح عمل رخام للمطبخ | تفصيل المغرب | UNIVMAR",
      metaDescription:
        "سطح عمل رخام للمطبخ وأسطح رخام أو غرانيت حسب الطلب في المغرب. تصنيع تمارة، عرض سعر مجاني.",
      h1: "سطح عمل رخام للمطبخ — تفصيل في المغرب",
      intro:
        "سطح عمل رخام أو غرانيت يغيّر المطبخ. تصنع UNIVMAR أسطحاً حسب الطلب في تمارة: قوالب وقص المغسلة والموقد والحواف والتشطيبات.",
    },
  ),
  "pierre-naturelle-maroc": bundle(
    {
      navLabel: "Pierre naturelle",
      metaTitle: "Pierre naturelle au Maroc | Façade, sol & mur | UNIVMAR",
      metaDescription:
        "Pierre naturelle au Maroc pour façades, sols, murs, jardins et projets architecturaux. Ardoise, Tahejart, éclatés de Taza et finitions sur devis avec UNIVMAR.",
      h1: "Pierre naturelle au Maroc",
      intro:
        "La pierre naturelle au Maroc répond à une demande forte pour des façades durables, des murs de caractère, des sols extérieurs et des aménagements qui gardent une identité minérale. UNIVMAR réunit ardoises, Tahejart, éclatés de Taza, pierres de parement et références locales pour les projets à Rabat, Temara, Casablanca, Taza et au-delà.",
      sections: [
        {
          title: "Une matière vivante pour façades et murs",
          paragraphs: [
            "Contrairement à un revêtement standardisé, la pierre naturelle garde des variations de ton, de relief et de texture. C'est précisément ce qui donne de la profondeur à une façade, un mur de jardin, une cheminée, un hall ou une clôture. Les éclatés apportent une présence plus brute, tandis que l'ardoise donne un aspect feuilleté plus contemporain.",
            "UNIVMAR conseille la pierre selon l'environnement : exposition extérieure, humidité, passage, style architectural, contraintes de pose et niveau d'entretien. Cette lecture technique permet d'éviter les choix uniquement décoratifs et de construire une solution cohérente pour le chantier.",
          ],
        },
        {
          title: "Ardoise, Tahejart et éclatés marocains",
          paragraphs: [
            "Notre sélection inclut des ardoises naturelles, des pierres éclatées comme Éclaté Beige Taza, Éclaté Gris Taza, Éclaté Volubilis, Éclaté Noir Khénifra ou Éclaté Noir Azilal, ainsi que des références destinées aux murs et habillages extérieurs. Chaque pierre possède son rythme : couleur chaude, gris minéral, noir profond, rouge rosé ou relief plus rustique.",
            "Pour les façades, la finition éclatée reste l'une des plus demandées car elle accroche la lumière et masque mieux les petites irrégularités du support. Pour les sols et terrasses, une finition plus régulière et antidérapante est généralement préférable.",
          ],
        },
        {
          title: "Accompagnement UNIVMAR",
          paragraphs: [
            "Depuis notre atelier à Temara, nous aidons les architectes, promoteurs, entreprises et particuliers à choisir la bonne pierre naturelle pour les façades, sols, murs, terrasses, villas, hôtels et projets commerciaux. Nous pouvons orienter vers les matériaux disponibles, les formats, les finitions et les solutions de livraison adaptées au chantier.",
            "Une pierre naturelle réussie dépend autant de la sélection que de la pose. C'est pourquoi UNIVMAR encourage la validation d'échantillons, l'étude du calepinage et la cohérence entre pierre, joints, éclairage et autres matériaux du projet.",
          ],
        },
        {
          title: "Choisir une pierre naturelle selon le rendu souhaité",
          paragraphs: [
            "Un projet en pierre naturelle peut viser plusieurs ambiances : rustique, contemporaine, méditerranéenne, minimaliste ou patrimoniale. Une ardoise foncée ne produit pas le même effet qu'un Éclaté Beige Taza, un Éclaté Volubilis ou une pierre grise plus sobre. UNIVMAR aide à comparer ces rendus avant de figer le choix.",
            "La décision doit aussi prendre en compte le format, le joint, la lumière, la surface totale et la proximité avec d'autres matières comme le bois, le métal, le verre ou l'enduit. Cette lecture globale permet d'obtenir une façade ou un mur harmonieux, durable et cohérent avec l'architecture du bâtiment.",
          ],
        },
      ],
      applications: ["Façade", "Mur", "Sol extérieur", "Terrasse", "Jardin", "Cheminée", "Piscine"],
      whyTitle: "Pourquoi UNIVMAR",
      whyPoints: [
        "Large choix de pierres naturelles marocaines et de parements",
        "Conseil sur les finitions extérieures et les usages intérieurs",
        "Livraison Rabat, Temara, Casablanca, Taza et Maroc",
        "Approche architecturale, premium et durable",
      ],
      faq: commonFaq,
      internalLinks: [
        { label: "Pierre de Taza", href: "/pierre-de-taza" },
        { label: "Éclaté Volubilis", href: "/produits/eclate-volubilis" },
        { label: "Éclaté Noir Khénifra", href: "/produits/eclate-noir-khenifra" },
        { label: "Contact UNIVMAR", href: "/contact" },
      ],
    },
    {
      navLabel: "Marble workshop",
      metaTitle: "Marble workshop in Morocco | UNIVMAR Temara",
      metaDescription: "Marble workshop in Morocco: marble, granite and natural stone selection, made-to-measure fabrication and delivery from Temara.",
      h1: "Marble workshop in Morocco",
      intro: "UNIVMAR is a marble workshop in Temara supplying marble, granite and natural stone with made-to-measure preparation for projects across Morocco.",
    },
    {
      navLabel: "حجر طبيعي",
      metaTitle: "حجر طبيعي في المغرب | UNIVMAR",
      metaDescription: "أردواز وحجر مكسور وتكسية. UNIVMAR — تمارة.",
      h1: "حجر طبيعي في المغرب",
      intro: "أردواز وحجر طبيعي للجدران والواجهات والتنسيق الخارجي.",
    },
  ),
  "granit-maroc": bundle(
    {
      navLabel: "Granit",
      metaTitle: "Granit au Maroc | Plans de travail, sols & façades | UNIVMAR",
      metaDescription:
        "Granit au Maroc pour plans de travail, cuisines, sols et escaliers : Noir Absolu, Noir Galaxy, Rose Porino et granits premium chez UNIVMAR.",
      h1: "Granit au Maroc",
      intro:
        "Le granit est l'une des matières les plus fiables pour les projets qui demandent résistance, stabilité et élégance. UNIVMAR fournit du granit au Maroc pour plans de travail, cuisines, sols à fort passage, escaliers, comptoirs, façades et aménagements professionnels, avec conseil depuis notre atelier à Temara.",
      sections: [
        {
          title: "Pourquoi choisir le granit ?",
          paragraphs: [
            "Le granit est une roche naturelle dure, dense et résistante. Il supporte mieux l'usage quotidien que beaucoup de pierres décoratives, ce qui en fait un choix privilégié pour les plans de travail de cuisine, les comptoirs, les restaurants, les espaces commerciaux et les sols très fréquentés. Sa résistance ne dispense pas d'un bon entretien, mais elle offre une sécurité appréciable sur les surfaces sollicitées.",
            "Au-delà de la technique, le granit apporte une esthétique très variée. Noir Absolu crée un rendu profond et minimaliste, Noir Galaxy ajoute un scintillement discret, Rose Porino apporte une chaleur mouchetée, Blanc Perle éclaircit les cuisines et Labrador donne une lecture plus expressive. UNIVMAR aide à comparer ces références selon la lumière, le mobilier, les usages et le style du projet.",
          ],
        },
        {
          title: "Applications : cuisine, sol, escalier et extérieur",
          paragraphs: [
            "En cuisine, le granit est recommandé pour les plans de travail, îlots, crédences et tables intégrées. Il peut être découpé sur mesure avec chants, réservations d'évier, plaques de cuisson et détails techniques. Pour les sols et escaliers, il convient aux zones de passage, aux halls, aux commerces et aux bureaux lorsque la finition est adaptée.",
            "En extérieur, certaines finitions comme flammée, bouchardée ou adoucie peuvent être étudiées selon l'exposition et l'adhérence souhaitée. UNIVMAR vérifie le format, l'épaisseur, la finition et les contraintes de pose pour éviter de choisir un granit uniquement sur photo.",
          ],
        },
        {
          title: "Finitions et devis granit au Maroc",
          paragraphs: [
            "Le granit peut être poli pour un rendu brillant et profond, adouci pour une lecture plus mate, ou texturé pour certains usages extérieurs. Le choix dépend du confort, de l'entretien, de la sécurité et de l'ambiance recherchée. Notre équipe accompagne les architectes, menuisiers, cuisinistes, promoteurs et particuliers dans ce choix.",
            "Pour demander un devis granit, indiquez les dimensions, découpes, chants, épaisseur, référence souhaitée et ville de livraison. UNIVMAR livre Rabat, Temara, Casablanca, Taza et d'autres villes du Maroc selon disponibilité et volume.",
          ],
        },
        {
          title: "Granit pour professionnels et particuliers",
          paragraphs: [
            "UNIVMAR accompagne aussi bien les particuliers qui rénovent une cuisine que les professionnels qui doivent équiper un restaurant, un hôtel, un commerce ou un bureau. Le granit répond à ces deux univers, car il associe une image premium à une résistance pratique sur les surfaces très utilisées.",
            "Pour les projets professionnels, les points importants sont les découpes, les chants, les jonctions, les réservations techniques et la facilité d'entretien. Pour les projets résidentiels, nous regardons davantage l'harmonie avec les façades de meubles, les sols, l'éclairage et les autres pierres sélectionnées dans la maison.",
          ],
        },
        {
          title: "Exemples de références granit chez UNIVMAR",
          paragraphs: [
            "Parmi les références demandées, Noir Absolu reste un classique pour les cuisines et comptoirs contemporains, Noir Galaxy apporte une profondeur scintillante, Rose Porino donne une tonalité plus chaleureuse et Blanc Perle éclaire les surfaces de travail. Labrador, Patagonia ou Matrix Titanium répondent à des projets plus expressifs.",
            "Ces références ne doivent pas être choisies seulement pour leur couleur. UNIVMAR analyse aussi la taille des pièces, les découpes, l'épaisseur, les chants, la finition, le poids, les accès au chantier et les contraintes d'entretien afin que le granit reste pratique après la pose.",
          ],
        },
      ],
      applications: ["Plan de travail", "Cuisine", "Sol", "Escalier", "Comptoir", "Façade", "Commerce"],
      whyTitle: "Pourquoi UNIVMAR Granit",
      whyPoints: [
        "Références recherchées : Noir Absolu, Noir Galaxy, Rose Porino, Blanc Perle, Labrador",
        "Conseil sur la finition selon cuisine, sol ou extérieur",
        "Découpe et préparation sur mesure selon plans",
        "Livraison à Temara, Rabat, Casablanca et au Maroc",
      ],
      faq: commonFaq,
      internalLinks: [
        { label: "Prix marbre & granit m²", href: "/prix-marbre-maroc" },
        { label: "Plan de travail marbre", href: "/plan-de-travail-marbre" },
        { label: "Granit Labrador Noir", href: "/produits/labrador-noir" },
        { label: "Granit Noir Galaxy", href: "/produits/noir-galaxy" },
        { label: "Noir Absolu", href: "/produits/noir-absolu" },
        { label: "Rose Porino", href: "/produits/rose-porino" },
        { label: "Marbre et granit Maroc", href: "/marbre-et-granit-maroc" },
        { label: "Demander un devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Granite",
      metaTitle: "Granite in Morocco | UNIVMAR",
      metaDescription: "Imported granite for worktops and flooring. UNIVMAR, Temara.",
      h1: "Granite in Morocco",
      intro: "Imported granite for kitchens, floors and high-traffic areas.",
    },
    {
      navLabel: "غرانيت",
      metaTitle: "غرانيت في المغرب | UNIVMAR",
      metaDescription: "غرانيت مستورد لأسطح العمل والأرضيات.",
      h1: "غرانيت في المغرب",
      intro: "غرانيت مستورد للمطابخ والأرضيات والمساحات عالية الاستخدام.",
    },
  ),
  "marbre-et-granit-maroc": bundle(
    {
      navLabel: "Marbre et granit",
      metaTitle: "Marbre et granit au Maroc : choix et devis | UNIVMAR",
      metaDescription:
        "UNIVMAR fournit marbre, granit et pierre naturelle au Maroc pour plans de travail, sols, façades, salles de bain, hôtels, villas et projets architecturaux.",
      h1: "Marbre et granit au Maroc",
      intro:
        "UNIVMAR accompagne les projets en marbre et granit au Maroc avec une sélection de matériaux locaux et importés, des conseils de finition et une logistique adaptée aux chantiers à Rabat, Temara, Casablanca, Taza et dans tout le pays. Notre approche réunit esthétique, résistance et précision technique.",
      sections: [
        {
          title: "Choisir entre marbre, granit et pierre naturelle",
          paragraphs: [
            "Le marbre est choisi pour la noblesse de son veinage, son toucher et son rendu architectural dans les halls, salons, escaliers, salles de bain et projets hôteliers. Le granit est privilégié lorsque la résistance devient prioritaire : plan de travail, cuisine, sol à fort passage, comptoir ou extérieur. La pierre naturelle, elle, apporte du relief et une identité plus brute aux façades, murs et jardins.",
            "UNIVMAR ne limite pas le conseil à la couleur. Nous analysons l'usage, l'exposition, la fréquence de passage, le niveau d'entretien et l'ambiance recherchée. Cette méthode aide à choisir une matière cohérente dès le départ et à éviter les erreurs entre esthétique et contraintes réelles du chantier.",
          ],
        },
        {
          title: "Exemples de matériaux disponibles",
          paragraphs: [
            "Notre catalogue rassemble Beige Taza, Gris Taza, Volubilis, Noir Khénifra, Gris Tiflet, Rouge Agadir, marbres importés comme Volakas, Arabiscato, Crema Marfil, Panda White ou Noir Portoro, ainsi que des granits comme Noir Absolu, Noir Galaxy, Rose Porino, Blanc Perle, Labrador et Patagonia.",
            "Chaque famille répond à une intention différente : un marbre clair pour agrandir visuellement un intérieur, un granit noir pour structurer une cuisine, une pierre de Taza pour habiller une façade, un onyx pour créer un détail décoratif premium. UNIVMAR aide à comparer ces options avec des échantillons et des références réelles.",
          ],
        },
        {
          title: "Services UNIVMAR pour les projets au Maroc",
          paragraphs: [
            "Depuis Temara, notre équipe accompagne architectes, promoteurs, entreprises et particuliers pour la sélection, les formats, les finitions, la préparation en atelier et la livraison. Nous intervenons pour villas, hôtels, résidences, commerces, bureaux, restaurants et projets institutionnels.",
            "La demande de devis peut inclure les plans, surfaces, matériaux souhaités, finitions et ville du chantier. Nous orientons ensuite vers les références disponibles, les alternatives pertinentes et les étapes nécessaires pour sécuriser la qualité finale.",
          ],
        },
        {
          title: "Comparer les matières avant devis",
          paragraphs: [
            "Un devis fiable commence par une comparaison claire entre les matières. Le marbre peut être idéal pour une salle de bain ou un hall, mais un granit sera souvent plus pertinent pour une cuisine intensive. Une pierre naturelle éclatée peut mieux servir une façade, tandis qu'un quartz offre une lecture plus régulière pour un plan de travail contemporain.",
            "UNIVMAR aide à poser les bonnes questions : la surface sera-t-elle mouillée, exposée au soleil, très fréquentée, facile à entretenir, visible en grande dimension ou utilisée comme accent décoratif ? Ces réponses orientent vers une matière durable plutôt qu'un choix seulement esthétique.",
          ],
        },
      ],
      applications: ["Plan de travail", "Sol", "Façade", "Mur", "Salle de bain", "Escalier", "Hôtel", "Villa"],
      whyTitle: "Pourquoi travailler avec UNIVMAR",
      whyPoints: [
        "Catalogue complet : marbre local, marbre importé, granit, quartz, onyx et pierre naturelle",
        "Atelier à Temara et livraison nationale",
        "Conseil professionnel sur la finition et l'usage",
        "Positionnement premium pour projets architecturaux et décoratifs",
      ],
      faq: commonFaq,
      internalLinks: [
        { label: "Catalogue produits", href: "/produits" },
        { label: "Marbre Maroc", href: "/marbre-maroc" },
        { label: "Pierre de Taza", href: "/pierre-de-taza" },
        { label: "Granit au Maroc", href: "/granit-maroc" },
        { label: "Granit Labrador Noir", href: "/produits/labrador-noir" },
        { label: "Marbre Rabat", href: "/marbre-rabat" },
        { label: "Marbre Casablanca", href: "/marbre-casablanca" },
        { label: "Contact devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Marble and granite",
      metaTitle: "Marble and granite in Morocco | UNIVMAR",
      metaDescription: "Marble, granite and natural stone supplier in Morocco for architectural projects.",
      h1: "Marble and granite in Morocco",
      intro: "UNIVMAR supplies marble, granite and natural stone for projects across Morocco.",
    },
    {
      navLabel: "الرخام والغرانيت",
      metaTitle: "الرخام والغرانيت في المغرب | UNIVMAR",
      metaDescription: "توريد الرخام والغرانيت والحجر الطبيعي في المغرب.",
      h1: "الرخام والغرانيت في المغرب",
      intro: "توفر UNIVMAR الرخام والغرانيت والحجر الطبيعي للمشاريع في المغرب.",
    },
  ),
  "marbre-local-maroc": bundle(
    {
      navLabel: "Marbre local",
      metaTitle: "Marbre local au Maroc | Taza, Volubilis, Khénifra | UNIVMAR",
      metaDescription:
        "Marbre local au Maroc pour sols, murs et façades : Beige Taza, Gris Taza, Volubilis, Khénifra, Tiflet et références UNIVMAR.",
      h1: "Marbre local marocain — pierre et marbre du Maroc",
      intro:
        "Le marbre local marocain permet de créer des projets élégants tout en valorisant les carrières et les matières du pays. UNIVMAR sélectionne des références comme Beige Taza, Gris Taza, Volubilis, Noir Khénifra, Gris Tiflet, Rouge Agadir, Noir Azilal et d'autres pierres locales pour villas, hôtels, façades, sols et aménagements intérieurs.",
      dateModified: "2026-08-10",
      sections: [
        {
          title: "Quel marbre local au Maroc choisir ?",
          paragraphs: [
            "Le terme « marbre local » recouvre plusieurs matières marocaines aux usages distincts. Beige Taza et Gris Taza se choisissent selon la teinte, la finition et l'exposition ; Volubilis apporte un caractère plus patrimonial ; Khénifra, Tiflet, Agadir ou Azilal permettent de travailler des contrastes et des couleurs spécifiques. La référence ne doit donc pas être sélectionnée sur le nom seul, mais sur l'échantillon, le lot disponible et l'usage final.",
            "UNIVMAR accompagne les projets de marbre local au Maroc depuis la comparaison des matières jusqu'au devis : dimensions, formats, épaisseur, finitions, découpes et livraison. Pour une terrasse ou une façade, une pierre de Taza bouchardée, sablée ou éclatée peut être préférable à une finition polie. Pour un hall, un escalier ou une salle de bain, une finition polie ou adoucie peut mieux convenir.",
          ],
        },
        {
          title: "Une identité minérale marocaine",
          paragraphs: [
            "Chaque région du Maroc possède une lecture minérale particulière. Taza apporte des beiges et gris adaptés aux façades et sols extérieurs. Khénifra offre des tons plus profonds, intéressants pour créer du contraste. Volubilis exprime une chaleur patrimoniale. Gris Tiflet, Rouge Agadir ou Noir Azilal permettent d'élargir la palette selon l'ambiance du projet.",
            "Choisir un marbre local ne signifie pas accepter un rendu moins premium. Au contraire, une matière bien sélectionnée, bien finie et bien posée peut offrir une signature architecturale très forte. UNIVMAR aide à comprendre les nuances, les lots, les formats et les finitions avant la commande.",
          ],
        },
        {
          title: "Usages du marbre local",
          paragraphs: [
            "Le marbre local marocain peut être utilisé en sol, mur, escalier, patio, salle de bain, façade, terrasse ou détail décoratif selon la référence et la finition. Les finitions polies et adoucies conviennent davantage aux espaces intérieurs, tandis que les finitions bouchardées, sablées, vieillies, brutes ou éclatées sont souvent préférables pour l'extérieur.",
            "Pour les projets à Rabat, Temara, Casablanca, Taza ou Marrakech, UNIVMAR conseille la matière selon le climat, l'usage, le passage et l'entretien. Un sol de hall, un mur de villa, une plage de piscine et une façade n'ont pas les mêmes contraintes techniques.",
          ],
        },
        {
          title: "Disponibilité, formats et devis",
          paragraphs: [
            "La disponibilité d'un marbre local dépend des carrières, des lots, des formats et des finitions. Il est donc recommandé de valider la référence tôt dans le projet, surtout pour les grandes surfaces qui demandent une homogénéité de ton. UNIVMAR peut orienter vers des alternatives proches lorsque le chantier impose un délai précis.",
            "Pour obtenir un devis, transmettez les surfaces, plans, formats, ville de livraison et usage prévu. Notre équipe prépare une proposition adaptée et vous conseille sur la finition la plus cohérente avec le rendu final attendu.",
          ],
        },
        {
          title: "Un choix responsable et cohérent",
          paragraphs: [
            "Travailler un marbre local permet souvent de mieux maîtriser la disponibilité, la logistique et la cohérence avec l'architecture marocaine. Les matières locales dialoguent naturellement avec les enduits, zelliges, bois, métaux et jardins minéraux que l'on retrouve dans les villas, riads, hôtels et résidences contemporaines.",
            "UNIVMAR ne présente pas le marbre local comme une solution unique, mais comme une famille de matières à comparer sérieusement avec les marbres importés, le granit et la pierre naturelle. Le bon choix dépend du rendu, du budget, de la finition, de l'usage et de la durabilité attendue.",
          ],
        },
      ],
      applications: ["Sol", "Mur", "Façade", "Escalier", "Patio", "Salle de bain", "Terrasse"],
      whyTitle: "Avantages du marbre local",
      whyPoints: [
        "Matières marocaines authentiques et adaptées aux projets locaux",
        "Délais souvent plus maîtrisés selon disponibilité",
        "Large palette : Beige Taza, Gris Taza, Volubilis, Khénifra, Tiflet, Agadir",
        "Conseil UNIVMAR sur les finitions et usages intérieurs/extérieurs",
      ],
      faq: commonFaq,
      internalLinks: [
        { label: "Marbre Maroc : matériaux et devis", href: "/marbre-maroc" },
        { label: "Pierre Taza / Pierre de Taza", href: "/pierre-de-taza" },
        { label: "Volubilis", href: "/produits/volubilis" },
        { label: "Marbre Rabat", href: "/marbre-rabat" },
        { label: "Demander un devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Local marble",
      metaTitle: "Moroccan local marble | UNIVMAR",
      metaDescription: "Local marble from Moroccan quarries. UNIVMAR Temara.",
      h1: "Moroccan local marble",
      intro: "Stones from Moroccan quarries for architectural projects.",
    },
    {
      navLabel: "رخام محلي",
      metaTitle: "رخام محلي مغربي | UNIVMAR",
      metaDescription: "رخام محلي من المحاجر المغربية.",
      h1: "رخام محلي مغربي",
      intro: "أحجار من المحاجر المغربية لمشاريعكم المعمارية.",
    },
  ),
  "marbre-importe": bundle(
    {
      navLabel: "Marbre importé",
      metaTitle: "Marbre importé au Maroc | Italie, Espagne, Grèce & Brésil | UNIVMAR",
      metaDescription:
        "Marbre importé au Maroc pour projets premium : Volakas, Crema Marfil, Panda White, Noir Portoro, Arabiscato et Calacatta chez UNIVMAR.",
      h1: "Marbre importé au Maroc",
      intro:
        "Le marbre importé est recherché au Maroc pour les projets qui exigent une esthétique internationale, des veinages spectaculaires ou des tons très spécifiques. UNIVMAR sélectionne des références premium pour villas, hôtels, halls, salles de bain, murs décoratifs, escaliers et projets commerciaux haut standing.",
      sections: [
        {
          title: "Des références internationales pour projets premium",
          paragraphs: [
            "Les marbres importés comme Volakas, Crema Marfil, Noir Portoro, Panda White, Arabiscato, Calacatta, Blanc Thassos ou Gris Armani offrent des rendus très différents. Certains agrandissent visuellement les espaces grâce à leur fond clair, d'autres créent un contraste fort avec des veines noires, dorées ou grises. Le choix dépend de l'ambiance, de la lumière, du mobilier et de la surface à habiller.",
            "UNIVMAR accompagne la sélection pour éviter un choix uniquement décoratif. Un marbre très veiné peut être magnifique sur un mur d'accent, mais plus délicat sur de grandes surfaces si le calepinage n'est pas étudié. La cohérence entre tranches, formats et orientation du veinage est essentielle.",
          ],
        },
        {
          title: "Applications en intérieur haut standing",
          paragraphs: [
            "Le marbre importé est particulièrement adapté aux halls, salons, escaliers, salles de bain, plans vasques, murs décoratifs, cheminées, comptoirs et espaces de réception. Il permet de donner une signature forte à un projet résidentiel, hôtelier ou commercial. Selon la finition, le rendu peut être brillant, satiné ou plus discret.",
            "Pour les zones très sollicitées, UNIVMAR vérifie la compatibilité entre la référence, l'usage, l'entretien et le type de pose. Dans certains cas, le granit ou le quartz peut être plus adapté, notamment pour les plans de travail très intensifs.",
          ],
        },
        {
          title: "Import, disponibilité et devis",
          paragraphs: [
            "La disponibilité d'un marbre importé dépend des lots, des arrivages et des formats. Il est important d'anticiper les quantités, surtout lorsqu'un projet demande une continuité de veinage ou une finition Open Book. UNIVMAR aide à vérifier les options disponibles et à proposer des alternatives cohérentes lorsque nécessaire.",
            "Pour demander un devis marbre importé au Maroc, envoyez la référence souhaitée, les surfaces, l'usage, les délais et la ville du chantier. Nous accompagnons les projets à Temara, Rabat, Casablanca, Marrakech, Taza et dans d'autres régions selon volume.",
          ],
        },
        {
          title: "Sélection des tranches et rendu final",
          paragraphs: [
            "Sur un marbre importé, la sélection des tranches est déterminante. Deux lots d'une même référence peuvent présenter des veinages, fonds et intensités très différents. Pour un mur décoratif ou un hall, cette variation peut devenir un atout ; pour un sol continu, elle doit être anticipée par un calepinage précis.",
            "UNIVMAR aide à lire la matière avant la pose : orientation du veinage, assemblage symétrique, équilibre entre pièces fortes et surfaces calmes, choix des joints et cohérence avec l'éclairage. Cette étape donne au marbre importé toute sa valeur architecturale.",
          ],
        },
      ],
      applications: ["Hall", "Salon", "Salle de bain", "Mur décoratif", "Escalier", "Plan vasque", "Hôtel"],
      whyTitle: "UNIVMAR et le marbre importé",
      whyPoints: [
        "Sélection de références premium internationales",
        "Conseil sur le veinage, le calepinage et les finitions",
        "Alternatives techniques entre marbre, granit, quartz et pierre naturelle",
        "Livraison et accompagnement de projets haut standing au Maroc",
      ],
      faq: commonFaq,
      internalLinks: [
        { label: "Marbre Maroc", href: "/marbre-maroc" },
        { label: "Pierre de Taza", href: "/pierre-de-taza" },
        { label: "Noir Portoro", href: "/produits/noir-portoro" },
        { label: "Crema Marfil", href: "/produits/crema-marfil" },
        { label: "Catalogue marbre", href: "/produits" },
        { label: "Demander un devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Imported marble",
      metaTitle: "Imported marble in Morocco | UNIVMAR",
      metaDescription: "Premium imported marble. UNIVMAR selection.",
      h1: "Imported marble",
      intro: "International marble selection for prestigious projects.",
    },
    {
      navLabel: "رخام مستورد",
      metaTitle: "رخام مستورد في المغرب | UNIVMAR",
      metaDescription: "رخام مستورد فاخر. تشكيلة UNIVMAR.",
      h1: "رخام مستورد",
      intro: "تشكيلة رخام مستورد للمشاريع المرموقة.",
    },
  ),
  "marbre-casablanca": bundle(
    {
      navLabel: "Marbre Casablanca",
      metaTitle: "Marbrerie à Casablanca : marbre et granit sur mesure | UNIVMAR",
      metaDescription:
        "Marbre, granit et pierre naturelle pour vos projets à Casablanca. Conseils, sélection de matériaux et devis personnalisé.",
      h1: "Marbre à Casablanca",
      intro:
        "Casablanca concentre une grande partie des projets résidentiels, commerciaux, hôteliers et corporate du Maroc. UNIVMAR accompagne cette demande avec une offre de marbre, granit et pierre naturelle livrée à Casablanca depuis notre atelier à Temara, avec un conseil adapté aux architectes, promoteurs, entreprises et particuliers.",
      sections: [
        {
          title: "Marbre et granit pour projets casablancais",
          paragraphs: [
            "Pour une villa à Anfa, un appartement haut standing, un restaurant, une boutique, un immeuble de bureaux ou un hôtel, le choix du matériau doit répondre à deux exigences : le rendu architectural et la résistance à l'usage. Le marbre apporte une esthétique noble aux halls, salles de bain, escaliers et revêtements muraux. Le granit convient aux plans de travail, cuisines, sols à fort passage et espaces commerciaux.",
            "UNIVMAR propose des références locales et importées : Beige Taza, Gris Taza, Volubilis, Noir Khénifra, Crema Marfil, Volakas, Noir Portoro, Panda White, Noir Absolu, Noir Galaxy, Rose Porino et d'autres matériaux selon disponibilité. Nous orientons chaque client vers la matière et la finition cohérentes avec l'ambiance du projet.",
          ],
        },
        {
          title: "Services et livraison à Casablanca",
          paragraphs: [
            "Notre emplacement à Temara facilite la préparation et la livraison vers Casablanca. Les demandes peuvent concerner des tranches, dalles, formats de sol, marches, plans vasques, plans de travail, parements ou pierres de façade. Nous étudions les quantités, les finitions, les délais et les contraintes de manutention selon le chantier.",
            "Pour les professionnels, UNIVMAR peut accompagner la sélection de matériaux en amont afin de sécuriser le rendu avant lancement. Pour les particuliers, nous aidons à clarifier les différences entre marbre, granit, quartz et pierre naturelle, puis à demander un devis lisible selon les surfaces et usages.",
          ],
        },
        {
          title: "Finitions adaptées au climat et à l'usage",
          paragraphs: [
            "À Casablanca, les projets peuvent combiner intérieur premium et extérieur exposé. Une finition polie valorise les espaces intérieurs, tandis qu'une finition bouchardée, sablée, vieillie ou éclatée est préférable pour terrasse, façade, entrée ou zone humide. Le choix dépend de l'adhérence, de l'entretien, de la lumière et du style architectural.",
            "Demander un devis UNIVMAR permet de comparer les options disponibles et de construire une solution adaptée à Casablanca sans perdre la qualité attendue sur un projet de marbre ou pierre naturelle.",
          ],
        },
        {
          title: "Devis et coordination pour chantiers à Casablanca",
          paragraphs: [
            "À Casablanca, les contraintes de chantier sont souvent liées au planning, aux accès, aux immeubles occupés, aux commerces en activité ou aux projets livrés par lots. UNIVMAR prend en compte ces réalités pour organiser la sélection, la préparation des matériaux et la livraison selon les volumes.",
            "Une demande de devis claire permet de gagner du temps : surfaces, plans, formats, finition, étage, accès, ville et photos du support. À partir de ces éléments, notre équipe peut orienter vers un marbre, un granit, une pierre de Taza ou une alternative plus adaptée techniquement.",
          ],
        },
        {
          title: "Matériaux adaptés aux quartiers et typologies de projets",
          paragraphs: [
            "Les projets casablancais peuvent aller d'une villa contemporaine à Anfa à un appartement rénové, un restaurant, un showroom ou un immeuble professionnel. Le niveau de passage, la luminosité, le style de mobilier et l'image attendue influencent fortement le choix entre marbre clair, granit noir, pierre de Taza ou parement naturel.",
            "UNIVMAR peut proposer des combinaisons cohérentes : granit pour les plans de travail, marbre pour les salles de bain et halls, pierre naturelle pour les murs extérieurs, Beige Taza ou Gris Taza pour les terrasses et façades. Cette approche par zones évite les choix trop uniformes.",
          ],
        },
      ],
      applications: ["Villa", "Hôtel", "Bureau", "Restaurant", "Plan de travail", "Salle de bain", "Façade"],
      whyTitle: "Pourquoi UNIVMAR pour Casablanca",
      whyPoints: [
        "Livraison régulière entre Temara, Rabat et Casablanca",
        "Catalogue marbre, granit, pierre naturelle, quartz et onyx",
        "Conseil sur les finitions intérieures et extérieures",
        "Devis adapté aux chantiers résidentiels et professionnels",
      ],
      faq: commonFaq,
      internalLinks: [
        { label: "Marbre et granit Maroc", href: "/marbre-et-granit-maroc" },
        { label: "Pierre de Taza", href: "/pierre-de-taza" },
        { label: "Catalogue", href: "/produits" },
        { label: "Contact devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Marble Casablanca",
      metaTitle: "Marble Casablanca — delivery | UNIVMAR",
      metaDescription: "Marble delivery to Casablanca. UNIVMAR workshop Temara.",
      h1: "Marble in Casablanca",
      intro: "Marble and natural stone delivery to Casablanca from our Temara workshop.",
    },
    {
      navLabel: "رخام الدار البيضاء",
      metaTitle: "رخام الدار البيضاء | UNIVMAR",
      metaDescription: "توصيل الرخام إلى الدار البيضاء.",
      h1: "رخام في الدار البيضاء",
      intro: "توصيل الرخام والحجر الطبيعي إلى الدار البيضاء من ورشتنا بتمارة.",
    },
  ),
  "marbre-rabat": bundle(
    {
      navLabel: "Marbre Rabat",
      metaTitle: "Marbrerie à Rabat : marbre et granit sur mesure | UNIVMAR",
      metaDescription:
        "Trouvez le marbre ou granit adapté à votre projet à Rabat. Découvrez nos matériaux, finitions et demandez votre devis.",
      h1: "Marbre à Rabat",
      intro:
        "UNIVMAR est un partenaire de proximité pour les projets en marbre à Rabat, Salé, Skhirat et Temara. Notre atelier à Ouled Slama, Ain Atiq, permet aux architectes, promoteurs, décorateurs et particuliers de découvrir des matériaux naturels, de comparer les finitions et de préparer un devis adapté.",
      sections: [
        {
          title: "Une marbrerie proche des chantiers de Rabat",
          paragraphs: [
            "Rabat demande des matériaux à la fois élégants, durables et cohérents avec des architectures très variées : villas contemporaines, résidences haut standing, bureaux, ambassades, restaurants, hôtels et rénovations patrimoniales. UNIVMAR propose du marbre local marocain, de la pierre de Taza, du marbre importé, du granit, du quartz et de l'onyx pour répondre à ces usages.",
            "La proximité de Temara facilite les échanges, les visites, la validation d'échantillons et la coordination de livraison. Elle permet aussi de mieux accompagner les projets qui évoluent rapidement, avec des contraintes de quantité, de finition ou de planning.",
          ],
        },
        {
          title: "Matériaux recommandés à Rabat",
          paragraphs: [
            "Pour les façades et murs extérieurs, Beige Taza, Gris Taza, Éclaté Volubilis ou Éclaté Noir Khénifra donnent un rendu minéral durable. Pour les intérieurs, Volakas, Crema Marfil, Arabiscato, Panda White, Noir Portoro, Gris Armani ou Volubilis peuvent créer des ambiances lumineuses, graphiques ou plus classiques.",
            "Le granit reste conseillé pour les plans de travail et les zones à fort passage. Noir Absolu, Noir Galaxy, Blanc Perle, Rose Porino ou Labrador apportent résistance et facilité d'usage dans les cuisines, comptoirs et surfaces professionnelles.",
          ],
        },
        {
          title: "Conseil, finition et devis",
          paragraphs: [
            "UNIVMAR aide à choisir entre finition polie, adoucie, bouchardée, sablée, vieillie, brute ou éclatée selon l'espace concerné. Un sol intérieur ne demande pas la même texture qu'une terrasse, une façade, une plage de piscine ou un plan de travail.",
            "Pour demander un devis à Rabat, il suffit de préciser la matière souhaitée, les surfaces, l'usage, la finition et l'adresse du chantier. Notre équipe revient avec une proposition claire et peut orienter vers des alternatives si une référence est plus pertinente techniquement ou esthétiquement.",
          ],
        },
        {
          title: "Une réponse locale pour projets exigeants",
          paragraphs: [
            "La région de Rabat regroupe des projets très différents : villas à Souissi ou Hay Riad, appartements haut standing, bureaux, restaurants, espaces institutionnels et rénovations. Cette diversité demande une lecture précise du matériau, car un même marbre peut être parfait pour un mur décoratif mais moins adapté à une terrasse exposée.",
            "UNIVMAR apporte une réponse de proximité grâce à son atelier à Temara. Les clients peuvent comparer les références, demander conseil sur les finitions et organiser plus facilement la livraison vers Rabat, Salé, Skhirat, Ain Atiq et les environs.",
          ],
        },
        {
          title: "Matériaux et finitions pour Rabat, Salé et Skhirat",
          paragraphs: [
            "Dans la région de Rabat, les projets résidentiels et institutionnels recherchent souvent une finition sobre, durable et élégante. Les marbres clairs conviennent aux intérieurs lumineux, les pierres de Taza aux façades et terrasses, tandis que les granits noirs ou gris structurent les cuisines, comptoirs et espaces professionnels.",
            "UNIVMAR conseille aussi les finitions selon les zones : poli ou adouci pour les intérieurs, bouchardé ou sablé pour l'extérieur, éclaté pour les murs de caractère. Cette précision améliore le confort, la sécurité et la tenue esthétique du projet dans le temps.",
            "Pour les projets proches de Rabat, la visite de l'atelier à Temara permet de confirmer les nuances, de comparer plusieurs options et de préparer une livraison plus fluide.",
          ],
        },
      ],
      applications: ["Villa", "Appartement", "Bureau", "Façade", "Salle de bain", "Escalier", "Plan de travail"],
      whyTitle: "Pourquoi choisir UNIVMAR à Rabat",
      whyPoints: [
        "Atelier à Temara, proche Rabat et Salé",
        "Visite possible sur rendez-vous pour voir les matériaux",
        "Conseil premium pour marbre, granit et pierre naturelle",
        "Livraison locale rapide selon disponibilité et volume",
      ],
      faq: commonFaq,
      internalLinks: [
        { label: "Marbrerie Temara", href: "/marbre-temara" },
        { label: "Pierre naturelle Maroc", href: "/pierre-naturelle-maroc" },
        { label: "Catalogue", href: "/produits" },
        { label: "Demander un devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Marble Rabat",
      metaTitle: "Marble Rabat — Temara workshop | UNIVMAR",
      metaDescription: "Marble in Rabat region. UNIVMAR Temara.",
      h1: "Marble in Rabat",
      intro: "Your local partner in Temara for Rabat region marble projects.",
    },
    {
      navLabel: "رخام الرباط",
      metaTitle: "رخام الرباط | UNIVMAR",
      metaDescription: "رخام في جهة الرباط. ورشة تمارة.",
      h1: "رخام في الرباط",
      intro: "شريككم بتمارة لمشاريع الرخام في الرباط والنواحي.",
    },
  ),
  "marbre-temara": bundle(
    {
      navLabel: "Marbrerie Temara",
      metaTitle: "Marbrerie à Témara : marbre et granit pour vos projets | UNIVMAR",
      metaDescription:
        "Marbre, granit et pierre naturelle à Témara. Choix de matériaux, conseils de projet et demande de devis.",
      h1: "Marbrerie à Temara",
      intro:
        "UNIVMAR est implantée à Temara avec un atelier de transformation et un espace de sélection dédiés au marbre, granit, quartz, onyx et pierre naturelle. Notre position à Ouled Slama, Ain Atiq, nous place au cœur des projets de Rabat, Temara, Skhirat, Salé et Casablanca.",
      sections: [
        {
          title: "Un atelier local pour choisir la bonne matière",
          paragraphs: [
            "Choisir un marbre ou une pierre naturelle uniquement depuis une photo peut être risqué. Les nuances, veinages, grains, reliefs et finitions changent selon la lumière et le format. Notre atelier à Temara permet de comparer les matériaux, de comprendre les différences entre marbre local, marbre importé, granit et pierre de façade, puis de préparer une demande de devis plus précise.",
            "UNIVMAR accompagne les particuliers, architectes, promoteurs, décorateurs et entreprises. Nous pouvons orienter vers Beige Taza, Gris Taza, Volubilis, Noir Khénifra, Crema Marfil, Volakas, Noir Portoro, Noir Absolu, Rose Porino, onyx ou quartz selon le projet.",
          ],
        },
        {
          title: "Services proposés à Temara",
          paragraphs: [
            "Nos services couvrent le conseil matériau, la sélection de finitions, la préparation des commandes, l'étude des formats, la coordination de livraison et l'accompagnement sur les usages. Les demandes concernent souvent des sols, murs, plans de travail, escaliers, salles de bain, façades, terrasses, hôtels, villas et commerces.",
            "La finition est un point essentiel : poli pour un rendu intérieur brillant, adouci pour une surface plus douce, bouchardé ou sablé pour l'extérieur, éclaté pour les murs et façades, vieilli pour un caractère plus authentique. UNIVMAR aide à faire le bon arbitrage avant la commande.",
          ],
        },
        {
          title: "Rabat, Temara, Casablanca et livraison nationale",
          paragraphs: [
            "Depuis Temara, nous livrons les projets proches de Rabat avec réactivité et nous organisons aussi les expéditions vers Casablanca, Taza, Marrakech et d'autres villes du Maroc. Les délais dépendent du matériau, du stock, du volume, du format et des finitions demandées.",
            "Pour visiter l'atelier ou demander un devis, contactez UNIVMAR avec les surfaces estimées, le type de projet et les matériaux qui vous intéressent. Notre équipe vous aide à structurer la demande pour obtenir une réponse claire et exploitable.",
          ],
        },
        {
          title: "Un point de départ pratique pour voir les matériaux",
          paragraphs: [
            "La visite de l'atelier à Temara permet de mieux comprendre la matière avant de choisir. Les photos en ligne donnent une première idée, mais la couleur, le grain, le relief et la brillance changent selon la lumière et la finition. Voir les matériaux aide à prendre une décision plus sûre.",
            "UNIVMAR recommande cette étape pour les projets importants : villa, hôtel, commerce, cuisine sur mesure, façade ou rénovation complète. Elle permet de comparer plusieurs options, d'écarter les matières moins adaptées et de préparer un devis plus précis.",
          ],
        },
        {
          title: "Conseil de proximité pour particuliers et professionnels",
          paragraphs: [
            "À Temara, UNIVMAR reçoit des demandes de particuliers, architectes, entreprises, cuisinistes et promoteurs. Les besoins sont très différents : une cuisine en granit, une façade en pierre de Taza, un escalier en marbre, une salle de bain premium ou une livraison de matériaux pour un chantier complet.",
            "Notre valeur ajoutée est de traduire ces besoins en choix concrets : référence, finition, épaisseur, format, quantité, délais et logistique. Cette proximité réduit les hésitations et facilite le passage de l'idée au devis exploitable.",
            "Cette approche est aussi utile pour comparer rapidement une pierre locale, un marbre importé, un granit ou un quartz selon l'usage réel du projet.",
            "Elle permet aussi de mieux anticiper les contraintes de pose, de transport et d'entretien avant de confirmer la commande finale.",
          ],
        },
      ],
      applications: ["Visite atelier", "Devis", "Conseil", "Sol", "Façade", "Plan de travail", "Salle de bain"],
      whyTitle: "Pourquoi UNIVMAR Temara",
      whyPoints: [
        "Atelier à Ouled Slama, Ain Atiq, Temara",
        "Sélection complète : marbre, granit, pierre naturelle, quartz et onyx",
        "Accompagnement technique et esthétique",
        "Livraison locale et nationale selon projet",
      ],
      faq: commonFaq,
      internalLinks: [
        { label: "Marbre Rabat", href: "/marbre-rabat" },
        { label: "Marbre Casablanca", href: "/marbre-casablanca" },
        { label: "Catalogue matériaux", href: "/produits" },
        { label: "Contact atelier", href: "/contact" },
      ],
    },
    {
      navLabel: "Temara marble",
      metaTitle: "Marble workshop Temara | UNIVMAR",
      metaDescription: "UNIVMAR workshop and showroom in Temara.",
      h1: "Marble in Temara",
      intro: "Visit our Temara workshop for marble, granite and natural stone.",
    },
    {
      navLabel: "رخام تمارة",
      metaTitle: "ورشة رخام تمارة | UNIVMAR",
      metaDescription: "ورشة ومعرض UNIVMAR بتمارة.",
      h1: "رخام في تمارة",
      intro: "زوروا ورشتنا بتمارة للرخام والغرانيت والحجر الطبيعي.",
    },
  ),
  "marbre-marrakech": bundle(
    {
      navLabel: "Marbre Marrakech",
      metaTitle: "Marbre Marrakech | Livraison marbre, granit & pierre naturelle | UNIVMAR",
      metaDescription:
        "UNIVMAR livre marbre, granit et pierre naturelle à Marrakech pour villas, riads, hôtels, terrasses, façades et projets architecturaux premium.",
      h1: "Marbre à Marrakech",
      intro:
        "Marrakech demande des matériaux capables de résister au climat tout en conservant une esthétique chaleureuse et haut de gamme. UNIVMAR livre marbre, granit et pierre naturelle à Marrakech pour villas, riads, hôtels, restaurants, terrasses, patios, façades et projets commerciaux.",
      sections: [
        {
          title: "Matériaux adaptés aux villas, riads et hôtels",
          paragraphs: [
            "Les projets à Marrakech recherchent souvent une continuité entre intérieur et extérieur : sols nobles, murs minéraux, patios, bassins, terrasses, escaliers et salles de bain. Beige Taza, Gris Taza, Volubilis, pierre éclatée, granit et marbre importé peuvent répondre à ces usages selon la finition choisie.",
            "Pour un riad, une pierre naturelle texturée peut renforcer l'authenticité sans sacrifier l'élégance. Pour une villa contemporaine, un marbre clair, un granit noir ou une pierre de Taza bien calepinée peuvent créer un contraste plus moderne. UNIVMAR conseille la matière selon le style architectural et le niveau d'entretien souhaité.",
          ],
        },
        {
          title: "Finitions pour climat chaud et espaces extérieurs",
          paragraphs: [
            "À Marrakech, le soleil, la poussière et les variations de température imposent de bien choisir les finitions. Les surfaces polies sont privilégiées en intérieur, tandis que les finitions bouchardées, sablées, vieillies, brutes ou éclatées sont souvent plus pertinentes pour terrasses, façades, entrées, jardins et abords de piscine.",
            "Le choix dépend aussi de la couleur. Les tons beiges et clairs peuvent garder une atmosphère lumineuse, alors que les noirs et gris profonds structurent davantage l'espace. UNIVMAR aide à arbitrer entre esthétique, confort, adhérence et entretien.",
          ],
        },
        {
          title: "Livraison et devis à Marrakech",
          paragraphs: [
            "Depuis Temara, UNIVMAR organise la livraison vers Marrakech selon les volumes, références et délais. Les demandes peuvent concerner des dalles, tranches, plans de travail, marches, parements, pierres de façade ou éléments décoratifs sur mesure.",
            "Pour préparer un devis, indiquez les surfaces, matériaux souhaités, finitions, photos ou plans et adresse du chantier. Notre équipe vous propose une solution cohérente avec le projet, qu'il s'agisse d'une villa, d'un hôtel, d'un riad ou d'un espace commercial.",
          ],
        },
        {
          title: "Associer tradition marocaine et lignes contemporaines",
          paragraphs: [
            "À Marrakech, le marbre et la pierre naturelle doivent souvent dialoguer avec des codes locaux forts : patios, bassins, murs texturés, ombre, lumière chaude, bois et enduits minéraux. Le choix de la matière doit respecter cette identité tout en répondant aux attentes contemporaines de confort et de durabilité.",
            "UNIVMAR conseille des associations équilibrées : pierre de Taza pour les murs et terrasses, marbre clair pour les intérieurs lumineux, granit pour les plans de travail, pierre éclatée pour les façades de caractère. Chaque projet mérite une combinaison adaptée à son usage réel.",
          ],
        },
        {
          title: "Matériaux pour hôtels, restaurants et maisons d'hôtes",
          paragraphs: [
            "Les hôtels, restaurants et maisons d'hôtes à Marrakech ont besoin de matières photogéniques, solides et cohérentes avec une expérience client premium. Le marbre peut valoriser les halls et salles de bain, le granit sécuriser les comptoirs et cuisines, et la pierre naturelle renforcer les murs, patios et jardins.",
            "UNIVMAR aide à composer une palette durable plutôt qu'une sélection isolée. Les matériaux doivent fonctionner ensemble : sol, mur, plan de travail, façade, terrasse et éclairage. Cette cohérence donne au projet une identité plus forte et une meilleure perception de qualité.",
            "Pour les chantiers de Marrakech, nous recommandons d'anticiper les formats, les finitions extérieures et les délais de livraison afin de sécuriser la pose.",
          ],
        },
      ],
      applications: ["Riad", "Villa", "Hôtel", "Terrasse", "Patio", "Façade", "Salle de bain", "Plan de travail"],
      whyTitle: "Pourquoi UNIVMAR pour Marrakech",
      whyPoints: [
        "Matériaux adaptés aux projets intérieurs et extérieurs",
        "Conseil sur les finitions pour climat chaud et espaces exposés",
        "Catalogue marbre local, importé, granit et pierre naturelle",
        "Livraison nationale organisée selon volume et planning",
      ],
      faq: commonFaq,
      internalLinks: [
        { label: "Pierre de Taza", href: "/pierre-de-taza" },
        { label: "Pierre naturelle Maroc", href: "/pierre-naturelle-maroc" },
        { label: "Catalogue produits", href: "/produits" },
        { label: "Contact devis", href: "/contact" },
      ],
    },
    {
      navLabel: "Marble Marrakech",
      metaTitle: "Marble Marrakech — delivery | UNIVMAR",
      metaDescription: "Marble delivery to Marrakech. UNIVMAR.",
      h1: "Marble in Marrakech",
      intro: "Marble and stone delivery for Marrakech projects.",
    },
    {
      navLabel: "رخام مراكش",
      metaTitle: "رخام مراكش | UNIVMAR",
      metaDescription: "توصيل الرخام إلى مراكش.",
      h1: "رخام في مراكش",
      intro: "توصيل الرخام والحجر لمشاريع مراكش.",
    },
  ),
};

export function getSeoPage(slug: SeoPageSlug, lang: Lang): SeoPageContent {
  return PAGES[slug][lang];
}

export function getSeoPageNavLabel(slug: SeoPageSlug, lang: Lang): string {
  return PAGES[slug][lang].navLabel;
}

export function isSeoPageSlug(slug: string): slug is SeoPageSlug {
  return slug in PAGES;
}

export function allSeoPageSlugs(): SeoPageSlug[] {
  return Object.keys(PAGES) as SeoPageSlug[];
}

export function seoPagePath(slug: SeoPageSlug, lang: Locale): string {
  return localePath(lang, `/${slug}`);
}
