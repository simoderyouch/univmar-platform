import type { Lang } from "@/lib/i18n";
import type { ProductRecord } from "@/lib/products";
import { inferProductColor, type ProductColor } from "@/lib/productMeta";

export type ProductSeoContent = {
  title: string;
  description: string;
  paragraphs: string[];
  bullets: string[];
  faq: { q: string; a: string }[];
  imageAlt: string;
};

const COLOR_LABELS: Record<ProductColor, string> = {
  beige: "beige",
  blanc: "blanche",
  gris: "grise",
  noir: "noire",
  rose: "rose",
  rouge: "rouge",
  marron: "marron",
  jaune: "jaune",
  orange: "orangée",
  vert: "verte",
  bleu: "bleue",
  violet: "violette",
  dore: "dorée",
};

const FINISH_PATTERNS: { key: string; label: string; use: string }[] = [
  { key: "bouchard", label: "bouchardée", use: "idéale pour les sols extérieurs, les plages de piscine et les zones qui demandent une accroche naturelle" },
  { key: "sable", label: "sablée", use: "appréciée en extérieur pour son toucher mat, son relief discret et sa bonne lecture en façade" },
  { key: "strie", label: "striée", use: "conseillée pour les parements muraux, les soubassements et les compositions graphiques" },
  { key: "polli", label: "polie", use: "adaptée aux intérieurs, halls, salons et espaces où l'on recherche une surface lumineuse" },
  { key: "poli", label: "polie", use: "adaptée aux intérieurs, halls, salons et espaces où l'on recherche une surface lumineuse" },
  { key: "vieille", label: "vieillie", use: "choisie pour les terrasses, patios, villas et projets au caractère authentique" },
  { key: "brut", label: "brute", use: "pertinente pour les façades minérales, les murs décoratifs et les aménagements paysagers" },
  { key: "eclate", label: "éclatée", use: "parfaite pour les façades, murs de clôture, cheminées et habillages à fort relief" },
  { key: "flamme", label: "flammée", use: "recommandée pour les extérieurs et les sols soumis au passage" },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function inferFinish(name: string) {
  const normalized = normalize(name);
  return FINISH_PATTERNS.find((item) => normalized.includes(item.key));
}

function assetVariant(product: ProductRecord) {
  const file = product.images.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim();
  if (!file || normalize(file) === normalize(product.name)) return "";
  return ` Cette référence correspond à une variante visuelle ${file}, utile pour comparer les nuances au moment du choix.`;
}

function visualSignature(product: ProductRecord, colorLabel: string) {
  const name = normalize(product.name);
  const variant = assetVariant(product);
  if (name.includes("taza")) return `une tonalité ${colorLabel} issue de la région de Taza, avec un grain naturel adapté aux architectures marocaines${variant}`;
  if (name.includes("volubilis")) return "un fond chaleureux inspiré des pierres marocaines patrimoniales, avec une présence élégante en parement" + variant;
  if (name.includes("khenifra")) return `une matière ${colorLabel} au caractère profond, intéressante pour créer des contrastes nets${variant}`;
  if (name.includes("azilal")) return "un aspect sombre et minéral qui donne de la profondeur aux murs, sols et détails décoratifs" + variant;
  if (name.includes("porino") || name.includes("porino")) return "un grain de granit régulier, apprécié pour les projets durables et les plans de travail" + variant;
  if (name.includes("galaxy") || name.includes("absolu") || name.includes("matrix")) return "un noir dense et contemporain, recherché pour les cuisines, escaliers et espaces commerciaux" + variant;
  if (name.includes("calac") || name.includes("statuario") || name.includes("volakas") || name.includes("thassos")) return "un fond clair traversé de veinages décoratifs, pensé pour les intérieurs lumineux" + variant;
  if (name.includes("onyx")) return `une matière ${colorLabel} expressive, souvent choisie pour des détails décoratifs et des ambiances premium${variant}`;
  if (name.includes("ardoise")) return "une texture feuilletée et naturelle, très adaptée aux murs décoratifs et aux aménagements extérieurs" + variant;
  return `une teinte ${colorLabel} et un dessin minéral qui apportent de la profondeur au projet${variant}`;
}


type PriorityProductCopy = {
  title: string;
  paragraphs: string[];
  bullets: string[];
  faq: { q: string; a: string }[];
  imageAlt: string;
};

const PRIORITY_PRODUCT_COPY: Record<string, PriorityProductCopy> = {
  "beige taza polli": {
    title: "Beige Taza poli : usages et conseils UNIVMAR",
    paragraphs: [
      "Beige Taza poli est une pierre marocaine lumineuse, appréciée pour les intérieurs qui recherchent une base chaude, naturelle et élégante. Son fond beige adoucit les grands volumes et s'accorde avec le bois, les enduits minéraux, le laiton, le verre et les menuiseries sombres. En finition polie, la matière gagne en profondeur visuelle et devient particulièrement intéressante pour halls, salons, escaliers et murs décoratifs.",
      "UNIVMAR recommande Beige Taza poli pour les projets résidentiels haut standing, villas, hôtels et espaces de réception où le confort visuel compte autant que la durabilité. Pour les zones humides ou extérieures, une finition moins glissante peut être préférable. Notre équipe vérifie l'usage, le format, l'épaisseur et l'entretien attendu avant de confirmer la solution.",
      "Disponible sur devis, cette référence peut être préparée pour Rabat, Temara, Casablanca, Taza et d'autres villes du Maroc. Pour une réponse précise, envoyez les surfaces, plans ou photos du chantier et la finition souhaitée.",
    ],
    bullets: ["Catégorie : marbre local marocain", "Teinte : beige Taza", "Finition : polie", "Usage conseillé : intérieur premium"],
    faq: [
      { q: "Beige Taza poli convient-il pour un sol intérieur ?", a: "Oui, il convient très bien aux sols intérieurs, halls, salons et escaliers lorsque la pose et l'entretien sont adaptés." },
      { q: "Peut-on utiliser Beige Taza poli en extérieur ?", a: "Pour l'extérieur, UNIVMAR conseille plutôt une finition bouchardée, sablée ou vieillie afin d'améliorer l'accroche." },
      { q: "Comment demander un devis Beige Taza poli ?", a: "Indiquez les surfaces, formats, épaisseurs, ville du chantier et contraintes de pose pour recevoir une proposition personnalisée." },
    ],
    imageAlt: "Pierre Beige Taza polie pour sol intérieur et projet architectural au Maroc",
  },
  "beige taza boucharde": {
    title: "Beige Taza bouchardé pour extérieur et façade",
    paragraphs: [
      "Beige Taza bouchardé offre une surface texturée, mate et naturellement antidérapante. Cette finition valorise le ton chaud de la pierre tout en renforçant son intérêt pour les sols extérieurs, les terrasses, les entrées de villa, les patios et les zones exposées au passage. Le rendu reste sobre, minéral et très compatible avec l'architecture marocaine contemporaine.",
      "La finition bouchardée est particulièrement pertinente lorsque la sécurité et la tenue visuelle priment sur la brillance. Elle accroche la lumière sans produire d'effet miroir, ce qui en fait un bon choix pour les façades, soubassements et aménagements extérieurs. UNIVMAR conseille aussi le calepinage, l'épaisseur et le traitement selon la destination du chantier.",
      "Cette référence peut être livrée sur devis à Rabat, Temara, Casablanca, Taza et partout au Maroc. Pour avancer rapidement, partagez vos surfaces, votre usage et vos attentes de finition.",
    ],
    bullets: ["Catégorie : pierre marocaine", "Teinte : beige", "Finition : bouchardée", "Usage conseillé : extérieur, terrasse, façade"],
    faq: [
      { q: "Beige Taza bouchardé est-il antidérapant ?", a: "La finition bouchardée offre une meilleure accroche qu'une surface polie, ce qui la rend adaptée aux extérieurs." },
      { q: "Cette pierre convient-elle pour une façade ?", a: "Oui, elle peut être utilisée en façade, soubassement ou mur extérieur selon le système de pose." },
      { q: "Livrez-vous Beige Taza bouchardé à Casablanca ?", a: "Oui, UNIVMAR livre Casablanca, Rabat, Temara, Taza et d'autres villes selon le volume." },
    ],
    imageAlt: "Pierre de Taza beige bouchardée pour façade et sol extérieur au Maroc",
  },
  "gris taza boucharde": {
    title: "Gris Taza bouchardé : pierre naturelle extérieure",
    paragraphs: [
      "Gris Taza bouchardé apporte une lecture plus contemporaine de la pierre de Taza. Sa teinte grise donne du relief aux façades, aux terrasses et aux sols extérieurs sans alourdir l'architecture. La finition bouchardée crée une texture régulière qui convient aux zones de passage, aux entrées, aux patios, aux abords de piscine et aux projets commerciaux.",
      "Cette référence est intéressante pour les architectes qui recherchent une alternative marocaine aux pierres grises importées. Elle s'associe bien avec le béton clair, l'aluminium noir, le verre et les jardins minéraux. UNIVMAR conseille le format et l'épaisseur selon l'exposition, la pente, la fréquence de passage et le style de joint souhaité.",
      "Gris Taza bouchardé est disponible sur devis avec livraison possible à Temara, Rabat, Casablanca, Taza et dans d'autres villes du Maroc.",
    ],
    bullets: ["Catégorie : pierre naturelle Taza", "Teinte : grise", "Finition : bouchardée", "Usage conseillé : terrasse, façade, sol extérieur"],
    faq: [
      { q: "Gris Taza bouchardé convient-il pour une terrasse ?", a: "Oui, c'est l'un des usages recommandés grâce à sa texture mate et à son accroche." },
      { q: "Quelle différence avec Beige Taza ?", a: "Gris Taza donne un rendu plus sobre et contemporain, tandis que Beige Taza apporte une chaleur plus lumineuse." },
      { q: "Le Gris Taza bouchardé est-il disponible sur devis ?", a: "Oui, le prix dépend du format, de l'épaisseur, de la quantité et de la livraison." },
    ],
    imageAlt: "Gris Taza bouchardé pour terrasse et façade extérieure au Maroc",
  },
  "gris taza sable": {
    title: "Gris Taza sablé pour sols et murs extérieurs",
    paragraphs: [
      "Gris Taza sablé est une pierre naturelle marocaine au rendu doux, mat et architectural. Le sablage atténue la brillance, révèle une texture fine et permet une lecture homogène sur les grandes surfaces. Cette finition est souvent appréciée pour les sols extérieurs, les murs, les terrasses, les patios et les projets qui recherchent une matière grise sans effet trop brut.",
      "Sa tonalité sobre fonctionne bien dans les villas contemporaines, hôtels, restaurants et espaces commerciaux. Elle peut accompagner des façades claires, des menuiseries foncées, des jardins secs ou des murs en pierre éclatée. UNIVMAR vérifie avec vous le niveau d'accroche, le format et le traitement nécessaire selon l'environnement.",
      "Pour un devis Gris Taza sablé, indiquez vos surfaces, la ville du chantier et l'usage prévu. Notre équipe vous conseille depuis Temara et livre dans plusieurs régions du Maroc.",
    ],
    bullets: ["Catégorie : pierre de Taza", "Teinte : gris minéral", "Finition : sablée", "Usage conseillé : sol extérieur, mur, terrasse"],
    faq: [
      { q: "Gris Taza sablé est-il adapté à l'extérieur ?", a: "Oui, la finition sablée est adaptée aux murs et sols extérieurs lorsqu'elle est correctement posée." },
      { q: "Le sablé est-il plus doux que le bouchardé ?", a: "Oui, le sablé donne une texture plus fine, tandis que le bouchardé offre un relief plus marqué." },
      { q: "UNIVMAR livre-t-il Gris Taza sablé à Rabat ?", a: "Oui, livraison possible à Rabat, Temara, Casablanca, Taza et selon le chantier." },
    ],
    imageAlt: "Pierre Gris Taza sablée pour sol extérieur et mur architectural au Maroc",
  },
  "eclate beige taza": {
    title: "Éclaté Beige Taza pour façade et mur de caractère",
    paragraphs: [
      "Éclaté Beige Taza est une pierre de parement marocaine pensée pour donner du relief aux façades, murs de clôture, cheminées, patios et entrées de villa. Sa couleur beige garde une chaleur naturelle tandis que la finition éclatée accroche fortement la lumière. Le résultat est architectural, authentique et durable, avec une présence plus expressive qu'une dalle lisse.",
      "Cette référence convient particulièrement aux projets qui veulent affirmer l'identité minérale marocaine : villa contemporaine, hôtel, restaurant, jardin, mur d'accueil ou soubassement. UNIVMAR conseille le choix du format, du joint et de la composition afin d'éviter un rendu trop chargé ou irrégulier.",
      "Éclaté Beige Taza est disponible sur devis. Nous accompagnons les chantiers à Rabat, Temara, Casablanca, Taza et dans tout le Maroc selon les quantités et délais demandés.",
    ],
    bullets: ["Catégorie : pierre naturelle de parement", "Teinte : beige Taza", "Finition : éclatée", "Usage conseillé : façade, mur, clôture"],
    faq: [
      { q: "Éclaté Beige Taza est-il adapté aux façades ?", a: "Oui, c'est l'un de ses usages principaux, notamment pour murs extérieurs, soubassements et entrées." },
      { q: "Peut-on l'utiliser en intérieur ?", a: "Oui, sur un mur décoratif, une cheminée ou un espace de réception lorsque le relief est souhaité." },
      { q: "Comment obtenir le prix d'Éclaté Beige Taza ?", a: "Le prix dépend du format, du volume et de la livraison. UNIVMAR prépare un devis personnalisé." },
    ],
    imageAlt: "Éclaté Beige Taza pour façade extérieure et mur en pierre naturelle au Maroc",
  },
  "eclate gris taza": {
    title: "Éclaté Gris Taza pour façade contemporaine",
    paragraphs: [
      "Éclaté Gris Taza donne aux murs et façades une texture plus contemporaine que les parements beiges traditionnels. Sa teinte grise crée un contraste élégant avec les enduits blancs, les menuiseries noires, le verre et les aménagements paysagers sobres. La finition éclatée apporte du relief et une profondeur naturelle qui évolue avec la lumière de la journée.",
      "UNIVMAR recommande cette référence pour façades, murs d'entrée, clôtures, restaurants, commerces, villas et projets d'architectes. Le choix du joint, du format et de la répartition des nuances est essentiel pour obtenir un rendu haut de gamme et maîtrisé.",
      "Disponible sur devis, Éclaté Gris Taza peut être livré à Rabat, Temara, Casablanca, Taza et dans d'autres villes du Maroc avec conseil sur la mise en œuvre.",
    ],
    bullets: ["Catégorie : pierre de parement", "Teinte : gris Taza", "Finition : éclatée", "Usage conseillé : façade contemporaine, mur extérieur"],
    faq: [
      { q: "Éclaté Gris Taza convient-il aux projets modernes ?", a: "Oui, sa teinte grise et son relief naturel s'intègrent très bien dans une architecture contemporaine." },
      { q: "Quelle pose choisir pour un mur éclaté ?", a: "La pose dépend du support, du format et du joint. UNIVMAR conseille la solution adaptée au chantier." },
      { q: "Cette pierre est-elle livrable à Casablanca ?", a: "Oui, la livraison est possible selon quantité, disponibilité et planning." },
    ],
    imageAlt: "Éclaté Gris Taza pour façade contemporaine en pierre naturelle au Maroc",
  },
  "volubilis": {
    title: "Marbre Volubilis marocain : caractère et élégance",
    paragraphs: [
      "Volubilis est une pierre marocaine à forte identité, recherchée pour son caractère chaleureux et son lien avec le patrimoine minéral du pays. Elle apporte une présence élégante aux sols, murs, escaliers, patios et espaces de réception. Sa lecture naturelle permet de créer un décor noble sans tomber dans une esthétique trop froide ou standardisée.",
      "UNIVMAR conseille Volubilis pour les projets qui souhaitent valoriser une matière locale dans une ambiance premium : villa, riad, hôtel, restaurant, hall ou résidence haut standing. Selon la finition, la pierre peut être plus lumineuse, plus mate ou plus texturée. Le choix dépend de l'usage intérieur ou extérieur et de l'entretien prévu.",
      "Pour un devis Volubilis au Maroc, contactez UNIVMAR avec vos surfaces, formats souhaités et ville du chantier. Nous préparons une proposition selon disponibilité et finition.",
    ],
    bullets: ["Catégorie : marbre local marocain", "Teinte : chaleureuse et naturelle", "Finitions : selon projet", "Usage conseillé : sol, mur, escalier, patio"],
    faq: [
      { q: "Le marbre Volubilis est-il marocain ?", a: "Oui, Volubilis fait partie des références locales valorisées dans les projets en pierre naturelle au Maroc." },
      { q: "Volubilis convient-il à un projet haut standing ?", a: "Oui, son rendu chaleureux et patrimonial convient aux villas, hôtels, halls et espaces de réception." },
      { q: "Comment choisir la finition Volubilis ?", a: "La finition dépend de l'usage : intérieur, extérieur, sol, mur ou élément décoratif." },
    ],
    imageAlt: "Marbre Volubilis naturel pour projet architectural haut standing au Maroc",
  },
  "rose porino": {
    title: "Rose Porino : granit durable pour projets 2026",
    paragraphs: [
      "Rose Porino est un granit au grain régulier, apprécié pour les projets qui demandent une matière résistante et une teinte plus chaleureuse que les granits gris ou noirs. Il peut être utilisé en plan de travail, sol, escalier, comptoir, cuisine, aménagement commercial ou détail extérieur selon la finition choisie.",
      "Sa résistance mécanique en fait une option intéressante pour les surfaces sollicitées. Le rendu rose moucheté apporte de la personnalité sans dominer l'espace, ce qui convient aux cuisines familiales, restaurants, espaces professionnels et projets où la durabilité prime. UNIVMAR conseille la finition polie, adoucie ou flammée selon l'usage.",
      "Pour un devis Rose Porino au Maroc, partagez vos dimensions, chants, découpes et contraintes de livraison. Notre équipe prépare une réponse adaptée depuis Temara.",
    ],
    bullets: ["Catégorie : granit", "Teinte : rose moucheté", "Finitions : polie, adoucie ou flammée", "Usage conseillé : plan de travail, sol, escalier"],
    faq: [
      { q: "Rose Porino convient-il pour un plan de travail ?", a: "Oui, le granit Rose Porino est adapté aux plans de travail grâce à sa résistance." },
      { q: "Rose Porino peut-il être utilisé en extérieur ?", a: "Oui, avec une finition adaptée et une pose correcte selon l'exposition." },
      { q: "Quel est le prix du granit Rose Porino ?", a: "Le prix dépend des dimensions, de la finition, des découpes et de la livraison." },
    ],
    imageAlt: "Granit Rose Porino pour plan de travail et projet durable au Maroc",
  },
  "noir absolu": {
    title: "Noir Absolu : granit noir poli pour cuisine et architecture",
    paragraphs: [
      "Noir Absolu est l'une des références les plus demandées pour les projets contemporains. Ce granit noir dense apporte une lecture sobre, luxueuse et très structurante aux plans de travail, îlots de cuisine, comptoirs, escaliers, sols et détails décoratifs. En finition polie, il reflète la lumière et renforce l'effet premium d'un espace.",
      "UNIVMAR recommande Noir Absolu lorsque la résistance et la facilité d'association sont prioritaires. Il se marie avec le bois, le blanc, les métaux, les marbres clairs et les ambiances minimalistes. Pour les zones extérieures ou très passantes, la finition doit être étudiée pour garder confort et durabilité.",
      "Noir Absolu est disponible sur devis avec découpes, chants et formats selon projet. Livraison possible à Rabat, Temara, Casablanca et dans plusieurs villes du Maroc.",
    ],
    bullets: ["Catégorie : granit noir", "Teinte : noir profond", "Finition : polie ou selon projet", "Usage conseillé : plan de travail, comptoir, escalier"],
    faq: [
      { q: "Noir Absolu est-il adapté aux cuisines ?", a: "Oui, c'est une excellente option pour plans de travail et îlots grâce à sa résistance." },
      { q: "Noir Absolu se raye-t-il facilement ?", a: "Le granit est très résistant, mais une utilisation et un entretien adaptés restent recommandés." },
      { q: "UNIVMAR réalise-t-il les découpes sur mesure ?", a: "Oui, les dimensions, chants et découpes sont étudiés selon le projet." },
    ],
    imageAlt: "Granit Noir Absolu poli pour plan de travail et cuisine au Maroc",
  },
  "noir portoro": {
    title: "Noir Portoro : marbre noir veiné pour intérieurs premium",
    paragraphs: [
      "Noir Portoro est un marbre spectaculaire, reconnu pour son fond sombre et ses veines contrastées. Il crée immédiatement une ambiance premium dans les halls, salles de bain, murs décoratifs, cheminées, escaliers, plans vasques et espaces de réception. C'est une matière de caractère, à utiliser avec précision pour éviter de surcharger l'architecture.",
      "UNIVMAR conseille Noir Portoro pour les projets qui veulent un point focal fort : mur d'accent, habillage de comptoir, salle de bain haut de gamme ou détail décoratif. La finition polie révèle la profondeur du noir et la richesse du veinage, tandis qu'une approche plus mate peut adoucir le rendu selon l'ambiance souhaitée.",
      "Pour un devis Noir Portoro au Maroc, indiquez les surfaces, formats, type de pose et ville du chantier. Notre équipe vous accompagne dans le choix des tranches, des finitions et de la livraison.",
    ],
    bullets: ["Catégorie : marbre importé", "Teinte : noir veiné", "Finition : polie ou adoucie", "Usage conseillé : mur décoratif, salle de bain, hall"],
    faq: [
      { q: "Noir Portoro convient-il pour une salle de bain ?", a: "Oui, il convient aux salles de bain premium avec une finition et un entretien adaptés." },
      { q: "Noir Portoro est-il plutôt décoratif ?", a: "Oui, son veinage fort en fait une matière idéale pour créer un point focal architectural." },
      { q: "Peut-on choisir les tranches ?", a: "Selon disponibilité, UNIVMAR accompagne la sélection pour harmoniser le veinage et le rendu final." },
    ],
    imageAlt: "Marbre Noir Portoro veiné pour intérieur premium et projet architectural au Maroc",
  },
  "labrador noir": {
    title: "Labrador Noir : granit premium pour projets d'exception",
    paragraphs: [
      "Le Labrador Noir est un granit d'exception, reconnu pour sa profondeur minérale et ses reflets subtils qui évoluent selon la lumière. Cette pierre naturelle dense et résistante apporte une élégance discrète mais affirmée aux plans de travail, sols, escaliers et façades. Son caractère changeant en fait une matière vivante, particulièrement appréciée dans les projets haut standing.",
      "UNIVMAR sélectionne le Labrador Noir pour les cuisines contemporaines, les halls d'entrée, les comptoirs de réception et les espaces commerciaux qui recherchent une signature minérale forte. Sa résistance mécanique exceptionnelle le rend adapté aux surfaces très sollicitées, tandis que son esthétique premium s'accorde avec le bois, les métaux et les ambiances épurées.",
      "Pour un devis Labrador Noir au Maroc, précisez les dimensions, finitions souhaitées et ville de livraison. UNIVMAR accompagne votre projet depuis la sélection jusqu'à la pose à Rabat, Casablanca, Temara et au-delà.",
    ],
    bullets: ["Catégorie : granit premium", "Teinte : noir aux reflets changeants", "Finition : polie, adoucie ou flammée", "Usage conseillé : plan de travail, sol, escalier, façade"],
    faq: [
      { q: "Quel est le prix du Labrador Noir au Maroc ?", a: "Le prix dépend du format, de l'épaisseur, de la finition et de la quantité. UNIVMAR prépare un devis personnalisé selon votre projet." },
      { q: "Labrador Noir convient-il pour une cuisine ?", a: "Oui, c'est un excellent choix pour les plans de travail et îlots grâce à sa résistance et son esthétique premium." },
      { q: "Quelle est la différence entre Labrador Noir et Noir Absolu ?", a: "Le Labrador Noir présente des reflets minéraux changeants, tandis que le Noir Absolu offre un noir plus uniforme et profond." },
    ],
    imageAlt: "Granit Labrador Noir premium pour cuisine et projet architectural au Maroc",
  },
  "galaxy noir": {
    title: "Galaxy Noir : granit étoilé pour intérieurs contemporains",
    paragraphs: [
      "Le Galaxy Noir est un granit spectaculaire, caractérisé par son fond noir profond parsemé de reflets dorés ou argentés qui évoquent un ciel étoilé. Cette matière unique crée immédiatement une ambiance luxueuse dans les cuisines, salles de bain, halls et espaces de réception. Chaque plaque révèle un dessin minéral différent, garantissant l'unicité de chaque projet.",
      "UNIVMAR recommande le Galaxy Noir pour les plans de travail, îlots de cuisine, crédences et sols intérieurs qui recherchent un effet wow durable. Sa résistance naturelle au quotidien, à la chaleur et aux rayures en fait un choix pragmatique malgré son apparence spectaculaire. Il se marie particulièrement bien avec les cuisines blanches, les mobiliers minimalistes et les accents dorés.",
      "Disponible sur devis, le Galaxy Noir peut être préparé selon vos dimensions et finitions. UNIVMAR livre à Rabat, Casablanca, Temara, Marrakech et dans tout le Maroc avec conseil technique inclus.",
    ],
    bullets: ["Catégorie : granit noir", "Teinte : noir aux reflets dorés/argentés", "Finition : polie ou adoucie", "Usage conseillé : plan de travail, crédence, sol intérieur"],
    faq: [
      { q: "Galaxy Noir est-il résistant aux rayures ?", a: "Oui, le granit Galaxy Noir est très résistant et convient aux usages intensifs en cuisine." },
      { q: "Peut-on utiliser Galaxy Noir en extérieur ?", a: "Oui, avec une finition adaptée comme flammée ou bouchardée pour améliorer l'adhérence." },
      { q: "Quel entretien pour le Galaxy Noir ?", a: "Un entretien régulier avec des produits adaptés au granit suffit pour préserver son éclat." },
    ],
    imageAlt: "Granit Galaxy Noir étoilé pour plan de travail et cuisine au Maroc",
  },
  "marbre galaxy": {
    title: "Marbre Galaxy : élégance noire pour projets premium",
    paragraphs: [
      "Le Marbre Galaxy est une pierre d'exception qui allie la noblesse du marbre à un fond noir profond ponctué de reflets minéraux subtils. Cette matière crée des ambiances sophistiquées dans les salles de bain, les halls d'hôtel, les murs décoratifs et les détails architecturaux. Son caractère premium en fait un choix privilégié pour les projets qui recherchent l'exception.",
      "UNIVMAR conseille le Marbre Galaxy pour les surfaces où l'esthétique prime : plans vasques, murs d'accent, encadrements de cheminée et sols de réception. La finition polie révèle toute la profondeur de la matière et la richesse de ses reflets. Pour les zones très sollicitées, le granit Galaxy Noir peut être une alternative plus résistante.",
      "Pour obtenir un devis Marbre Galaxy au Maroc, contactez UNIVMAR avec les surfaces, formats et ville de votre projet. Notre équipe vous guide dans le choix des tranches et la coordination de la livraison.",
    ],
    bullets: ["Catégorie : marbre noir premium", "Teinte : noir aux reflets minéraux", "Finition : polie recommandée", "Usage conseillé : salle de bain, mur décoratif, hall"],
    faq: [
      { q: "Marbre Galaxy vs Galaxy Noir : quelle différence ?", a: "Le Marbre Galaxy offre une noblesse et un veinage typiques du marbre, tandis que le Galaxy Noir est un granit plus résistant." },
      { q: "Le Marbre Galaxy convient-il pour un sol ?", a: "Oui, en intérieur avec une pose et un entretien adaptés. Pour les zones très passantes, le granit est préférable." },
      { q: "Quel est le prix du Marbre Galaxy au Maroc ?", a: "Le prix varie selon la qualité des tranches, les formats et la finition. Demandez un devis personnalisé à UNIVMAR." },
    ],
    imageAlt: "Marbre Galaxy noir pour salle de bain et intérieur premium au Maroc",
  },
  "crema royal": {
    title: "Crema Royal : marbre beige élégant pour intérieurs lumineux",
    paragraphs: [
      "Le Crema Royal est un marbre beige d'une grande douceur, apprécié pour sa capacité à agrandir visuellement les espaces et à créer des ambiances chaleureuses et raffinées. Son fond crème uniforme, ponctué de veinages discrets, apporte une élégance intemporelle aux sols, murs, salles de bain et halls de réception. C'est une référence incontournable des projets classiques et contemporains.",
      "UNIVMAR sélectionne le Crema Royal pour les villas, hôtels, résidences haut standing et espaces commerciaux qui recherchent une base lumineuse et noble. Il s'associe harmonieusement avec le bois foncé, le laiton, le noir mat et les textiles naturels. La finition polie sublime sa brillance naturelle, tandis qu'une finition adoucie offre un rendu plus contemporain et discret.",
      "Pour un devis Crema Royal au Maroc, indiquez vos surfaces, formats préférés, finition et ville de livraison. UNIVMAR accompagne votre projet de la sélection des tranches à la livraison finale à Rabat, Casablanca, Temara et au-delà.",
    ],
    bullets: ["Catégorie : marbre importé", "Teinte : crème/beige royal", "Finition : polie ou adoucie", "Usage conseillé : sol, mur, salle de bain, hall"],
    faq: [
      { q: "Quel est le prix du Crema Royal au Maroc ?", a: "Le prix dépend de la qualité des tranches, des formats, de l'épaisseur et de la finition. UNIVMAR établit un devis sur mesure." },
      { q: "Crema Royal convient-il pour une salle de bain ?", a: "Oui, c'est un choix excellent pour les salles de bain premium avec une finition polie et un entretien adapté." },
      { q: "Quelle différence entre Crema Royal et Crema Marfil ?", a: "Le Crema Royal a un fond plus uniforme et chaud, tandis que le Crema Marfil présente des variations et des veinages plus marqués." },
    ],
    imageAlt: "Marbre Crema Royal beige pour sol et intérieur lumineux au Maroc",
  },
  "marbre ibiza": {
    title: "Marbre Ibiza : blanc méditerranéen pour projets éclatants",
    paragraphs: [
      "Le Marbre Ibiza est une pierre blanche d'une pureté remarquable, inspirée des lumières méditerranéennes. Son fond blanc lumineux, parfois ponctué de veinages gris très fins, apporte une clarté exceptionnelle aux intérieurs. Cette matière est particulièrement recherchée pour les projets qui recherchent une ambiance aérée, contemporaine et haut de gamme.",
      "UNIVMAR recommande le Marbre Ibiza pour les sols de villas, les salles de bain, les plans vasques, les murs de réception et les escaliers où la lumière et l'espace sont primordiaux. Il crée des associations magnifiques avec le bois naturel, le métal noir, le verre et les touches de couleur vives. La finition polie maximise son effet miroir et son pouvoir d'agrandissement visuel.",
      "Pour un devis Marbre Ibiza au Maroc, partagez les surfaces, formats, finition et localisation de votre chantier. UNIVMAR livre et conseille à Rabat, Casablanca, Temara, Marrakech et dans tout le Maroc.",
    ],
    bullets: ["Catégorie : marbre importé blanc", "Teinte : blanc pur méditerranéen", "Finition : polie ou adoucie", "Usage conseillé : sol, salle de bain, vasque, escalier"],
    faq: [
      { q: "Quel est le prix du Marbre Ibiza au Maroc ?", a: "Le prix du Marbre Ibiza dépend de la qualité des tranches, des formats et de la finition. Contactez UNIVMAR pour un devis précis." },
      { q: "Marbre Ibiza convient-il pour un sol ?", a: "Oui, c'est un excellent choix pour les sols intérieurs lumineux, notamment dans les villas et hôtels." },
      { q: "Comment entretenir le Marbre Ibiza ?", a: "Un entretien régulier avec des produits neutres et l'absence de produits acides permettent de préserver sa blancheur." },
    ],
    imageAlt: "Marbre Ibiza blanc pour salle de bain et sol lumineux au Maroc",
  },
  "crema marfil": {
    title: "Crema Marfil : classique espagnol pour architectures raffinées",
    paragraphs: [
      "Le Crema Marfil est l'un des marbres les plus emblématiques d'Espagne, reconnu mondialement pour sa teinte crème chaleureuse et ses veinages caractéristiques. Cette pierre naturelle apporte une élégance discrète et intemporelle aux sols, murs, escaliers et salles de bain. Sa versatilité en fait un choix sûr pour les projets résidentiels et hôteliers.",
      "UNIVMAR propose le Crema Marfil pour les projets qui recherchent une esthétique classique avec une touche méditerranéenne. Il s'harmonise parfaitement avec les menuiseries en bois, les ferronneries noires, les zelliges et les architectures marocaines contemporaines. La sélection des tranches permet de moduler l'intensité des veinages selon l'ambiance souhaitée.",
      "Pour un devis Crema Marfil au Maroc, précisez les surfaces, formats, finition et ville de livraison. UNIVMAR assure la sélection, la préparation et la livraison à Temara, Rabat, Casablanca et dans tout le Maroc.",
    ],
    bullets: ["Catégorie : marbre importé espagnol", "Teinte : crème chaleureuse", "Finition : polie, adoucie ou brossée", "Usage conseillé : sol, mur, escalier, salle de bain"],
    faq: [
      { q: "Quel est le prix du Crema Marfil au Maroc ?", a: "Le prix varie selon la qualité, les formats, l'épaisseur et la finition. UNIVMAR établit un devis personnalisé." },
      { q: "Crema Marfil est-il adapté aux cuisines ?", a: "Oui, en plan de travail avec un entretien adapté. Pour une résistance maximale, le granit ou le quartz peuvent être préférables." },
      { q: "Quelle différence avec le marbre beige local ?", a: "Le Crema Marfil est un marbre espagnol avec des veinages caractéristiques, tandis que le beige local comme Beige Taza a une identité marocaine distincte." },
    ],
    imageAlt: "Marbre Crema Marfil crème pour sol et intérieur classique au Maroc",
  },
  "marbre onyx": {
    title: "Marbre Onyx : transparence et luxe pour détails d'exception",
    paragraphs: [
      "L'Onyx est une pierre semi-précieuse d'une beauté rare, caractérisée par sa transparence naturelle et ses veinages spectaculaires qui évoquent des paysages minéraux. Cette matière exceptionnelle crée des effets de lumière uniques lorsqu'elle est rétroéclairée, transformant les bars, comptoirs, murs et niches en œuvres d'art vivantes. Chaque plaque d'onyx est une pièce unique.",
      "UNIVMAR sélectionne l'Onyx pour les projets qui recherchent l'exception et le wow effect : bars d'hôtel, réceptions, salles de bain luxueuses, détails décoratifs et pièces de réception. Sa fragilité relative exige une mise en œuvre experte, mais le résultat est incomparable. Le rétroéclairage LED révèle toute la profondeur et la magie de ses veinages.",
      "Pour un devis Onyx au Maroc, contactez UNIVMAR avec les surfaces, l'usage prévu et la ville de votre projet. Nous vous conseillons sur la sélection des tranches, le rétroéclairage et la pose à Rabat, Casablanca, Temara et au-delà.",
    ],
    bullets: ["Catégorie : pierre semi-précieuse", "Teinte : variable selon les veinages", "Finition : polie", "Usage conseillé : bar, comptoir, mur décoratif, niche rétroéclairée"],
    faq: [
      { q: "L'Onyx est-il fragile ?", a: "L'onyx est plus fragile que le marbre ou le granit. Il convient aux usages décoratifs plutôt qu'aux surfaces très sollicitées." },
      { q: "Peut-on rétroéclairer l'Onyx ?", a: "Oui, c'est l'un de ses usages les plus spectaculaires. Le rétroéclairage LED révèle sa transparence naturelle." },
      { q: "Quel est le prix de l'Onyx au Maroc ?", a: "L'onyx est une pierre premium. Le prix dépend de la qualité des tranches, des formats et de la finition. Demandez un devis à UNIVMAR." },
    ],
    imageAlt: "Onyx marbre translucide pour bar et décoration luxueuse au Maroc",
  },
  "blanc carrare": {
    title: "Blanc Carrare : l'élégance italienne intemporelle",
    paragraphs: [
      "Le Blanc Carrare est le marbre italien par excellence, célèbre depuis l'Antiquité pour sa blancheur pure et ses veinages gris délicats. Cette pierre noble a habillé les plus grands chefs-d'œuvre de la Renaissance et continue aujourd'hui de symboliser l'élégance et le raffinement dans l'architecture contemporaine. Son charme intemporel en fait un investissement durable.",
      "UNIVMAR propose le Blanc Carrare pour les projets qui recherchent une référence classique et prestigieuse : salles de bain, plans vasques, sols, murs de réception, encadrements de cheminée et détails décoratifs. Sa blancheur lumineuse agrandit visuellement les espaces et apporte une touche d'exception irréprochable. Il s'accorde avec tous les styles, du classique au minimaliste.",
      "Pour un devis Blanc Carrare au Maroc, indiquez les surfaces, formats, finition et ville de livraison. UNIVMAR sélectionne les meilleures tranches et accompagne votre projet de A à Z à Rabat, Casablanca, Temara et dans tout le Maroc.",
    ],
    bullets: ["Catégorie : marbre importé italien", "Teinte : blanc aux veinages gris", "Finition : polie ou adoucie", "Usage conseillé : salle de bain, vasque, sol, mur décoratif"],
    faq: [
      { q: "Le Blanc Carrare est-il un bon investissement ?", a: "Oui, c'est une référence intemporelle qui valorise durablement les projets résidentiels et hôteliers." },
      { q: "Blanc Carrare vs Blanc Ibiza : quelle différence ?", a: "Le Carrare a des veinages gris caractéristiques, tandis que l'Ibiza est plus uniformément blanc. Les deux sont d'excellente qualité." },
      { q: "Comment entretenir le Blanc Carrare ?", a: "Un entretien régulier avec des produits adaptés au marbre et l'absence de produits acides permettent de préserver sa blancheur et son éclat." },
    ],
    imageAlt: "Marbre Blanc Carrare italien pour salle de bain et intérieur premium au Maroc",
  },
};

function categoryAdvice(categoryName: string) {
  if (categoryName.includes("Granit")) {
    return {
      type: "granit",
      uses: "plans de travail, escaliers, sols à fort passage, comptoirs, cuisines professionnelles et surfaces extérieures",
      setting: "Le granit supporte très bien l'usage quotidien, l'humidité et les contraintes mécaniques lorsqu'il est correctement posé et entretenu.",
    };
  }
  if (categoryName.includes("Onyx")) {
    return {
      type: "onyx",
      uses: "murs décoratifs, bars, comptoirs, salles de bain, niches lumineuses et pièces de réception",
      setting: "L'onyx est privilégié pour l'effet visuel et la noblesse de la matière, avec une mise en œuvre soignée en intérieur.",
    };
  }
  if (categoryName.includes("Quartz")) {
    return {
      type: "quartz",
      uses: "plans de travail, îlots de cuisine, vasques, crédences et surfaces intérieures contemporaines",
      setting: "Le quartz offre une lecture régulière, pratique pour les cuisines et les espaces qui demandent une finition propre et maîtrisée.",
    };
  }
  if (categoryName.includes("Pierre Naturelle")) {
    return {
      type: "pierre naturelle",
      uses: "façades, murs, clôtures, terrasses, jardins, cheminées et villas au style marocain contemporain",
      setting: "Cette famille de pierres garde un relief vivant et une excellente présence en extérieur, notamment sur les façades et murs décoratifs.",
    };
  }
  if (categoryName.includes("Marbre local")) {
    return {
      type: "marbre local marocain",
      uses: "sols, murs, façades, escaliers, patios, villas, hôtels et projets résidentiels haut standing",
      setting: "Le marbre local valorise les carrières marocaines et permet de travailler une esthétique authentique avec des délais maîtrisés.",
    };
  }
  return {
    type: "marbre",
    uses: "sols, murs, salles de bain, escaliers, halls, plans vasques et projets hôteliers ou résidentiels premium",
    setting: "Le marbre convient aux projets intérieurs élégants et peut être décliné en finitions adaptées selon l'usage prévu.",
  };
}

export function buildProductSeoContent(
  product: ProductRecord,
  categoryLabel: string,
  lang: Lang,
): ProductSeoContent | null {
  if (lang !== "fr") return null;

  const category = categoryAdvice(categoryLabel);
  const color = inferProductColor(product.name);
  const colorLabel = color ? COLOR_LABELS[color] : "naturelle";
  const finish = inferFinish(product.name);
  const finishText = finish ? `La finition ${finish.label} est ${finish.use}.` : "La finition peut être étudiée selon le rendu souhaité : polie, adoucie, bouchardée, sablée, vieillie ou brute selon la matière et le chantier.";
  const visual = visualSignature(product, colorLabel);
  const name = product.name;
  const priority = PRIORITY_PRODUCT_COPY[normalize(name)];

  if (priority) {
    return {
      ...priority,
      description: priority.paragraphs.join("\n\n"),
    };
  }

  const paragraphs = [
    `${name} est une référence de ${category.type} sélectionnée par UNIVMAR pour les projets d'architecture, de décoration et d'aménagement au Maroc. Elle se distingue par ${visual}. Cette matière permet de composer des surfaces durables et expressives, tout en conservant une lecture premium compatible avec les villas, hôtels, commerces et résidences contemporaines.`,
    `Pour l'usage, ${name} convient notamment aux ${category.uses}. ${category.setting} ${finishText} UNIVMAR conseille le choix de l'épaisseur, du calepinage et du traitement de surface en fonction de l'exposition, du passage et du niveau d'entretien attendu.`,
    `Disponible sur devis, ${name} peut être intégré à un projet à Rabat, Temara, Casablanca, Taza ou dans d'autres villes du Maroc. Notre équipe accompagne les architectes, maîtres d'ouvrage et particuliers depuis la sélection de la tranche ou du format jusqu'à la préparation en atelier. Pour confirmer la disponibilité, les formats et la finition, demandez un devis personnalisé UNIVMAR.`,
  ];

  return {
    title: `Applications et conseils pour ${name}`,
    description: paragraphs.join("\n\n"),
    paragraphs,
    bullets: [
      `Catégorie : ${category.type}`,
      `Teinte dominante : ${colorLabel}`,
      finish ? `Finition : ${finish.label}` : "Finitions : selon projet",
      "Usage : intérieur et/ou extérieur selon la finition choisie",
    ],
    faq: [
      {
        q: `Quel est le prix de ${name} au Maroc ?`,
        a: `Le prix de ${name} dépend du format, de l'épaisseur, de la finition, de la quantité et de la livraison. UNIVMAR prépare un devis personnalisé après analyse du projet.`,
      },
      {
        q: `${name} convient-il pour l'extérieur ?`,
        a: `Oui, lorsque la finition et la pose sont adaptées. Les finitions bouchardée, sablée, vieillie, brute ou éclatée sont souvent privilégiées pour les zones extérieures.`,
      },
      {
        q: `Livrez-vous ${name} à Rabat, Temara et Casablanca ?`,
        a: "Oui, UNIVMAR livre régulièrement à Rabat, Temara, Casablanca et dans plusieurs villes du Maroc selon le volume et le planning du chantier.",
      },
    ],
    imageAlt: `${name} ${category.type} ${colorLabel} pour projet architectural au Maroc`,
  };
}
