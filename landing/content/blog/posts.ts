import type { Lang } from "@/lib/i18n";
import { GRANITE_MOROCCO_GUIDE } from "./granite-morocco-guide";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type BlogFaq = {
  q: string;
  a: string;
};

export type BlogLink = {
  label: string;
  href: string;
};

export type BlogPostContent = {
  title: string;
  description: string;
  excerpt: string;
  sections: BlogSection[];
};

export type BlogPost = {
  slug: string;
  datePublished: string;
  /** Use a real substantive-edit date; publication date is used when omitted. */
  dateModified?: string;
  readingMinutes: number;
  content: Record<Lang, BlogPostContent>;
  images?: Partial<Record<Lang, BlogImage[]>>;
  faqs?: Partial<Record<Lang, BlogFaq[]>>;
  relatedLinks?: Partial<Record<Lang, BlogLink[]>>;
};

export const BLOG_POSTS: BlogPost[] = [
  GRANITE_MOROCCO_GUIDE,
  {
    slug: "guide-pierre-de-taza-2026",
    datePublished: "2026-01-15",
    dateModified: "2026-07-25",
    readingMinutes: 12,
    content: {
      fr: {
        title: "Guide complet de la pierre de Taza en 2026",
        description:
          "Origine, finitions, usages façade, terrasse et piscine, conseils de pose et entretien — tout savoir sur la pierre de Taza au Maroc avec UNIVMAR.",
        excerpt:
          "Calcaire noble des carrières de Taza et Oued Amlil, la pierre de Taza est l'un des matériaux les plus demandés pour les façades et aménagements extérieurs au Maroc. Ce guide rassemble l'essentiel pour architectes, promoteurs et particuliers.",
        sections: [
          {
            heading: "Qu'est-ce que la pierre de Taza ?",
            paragraphs: [
              "La pierre de Taza est un calcaire sédimentaire extrait des carrières de la région de Taza, notamment autour d'Oued Amlil, au nord-est du Maroc. Reconnue pour ses teintes beige chaud, crème ou gris perle, elle fait partie du patrimoine géologique marocain et s'inscrit dans une longue tradition architecturale — des médinas historiques aux villas contemporaines de Rabat, Casablanca ou Marrakech.",
              "Contrairement au marbre, qui est une roche métamorphique, la pierre de Taza conserve une structure plus poreuse et une excellente résistance aux intempéries. C'est ce qui en fait un choix privilégié pour l'extérieur : façades ventilées, murets, terrasses, margelles de piscine et allées piétonnes.",
            ],
          },
          {
            heading: "Les principales variétés et coloris",
            paragraphs: [
              "Le catalogue UNIVMAR propose plusieurs déclinaisons de pierre de Taza, chacune avec un caractère propre. Les tons beige Taza — parfois veinés de fossilisations discrètes — apportent chaleur et luminosité aux façades. Les variantes grises conviennent aux projets minimalistes ou aux contrastes avec des menuiseries sombres.",
              "La homogénéité du lot est essentielle sur un même chantier. C'est pourquoi nous sélectionnons rigoureusement nos approvisionnements auprès de carrières partenaires et contrôlons chaque livraison avant transformation à l'atelier de Temara.",
            ],
            bullets: [
              "Beige Taza — classique, lumineux, idéal façades et terrasses",
              "Gris Taza — contemporain, sobre, bon comportement au soleil",
              "Finitions bouchardées ou sablées — texture antidérapante pour piscine",
              "Finitions polies ou adoucies — intérieur, hall, salle de bain",
            ],
          },
          {
            heading: "Finitions : brut, bouchardé, poli, sablé",
            paragraphs: [
              "Le choix de la finition détermine à la fois l'esthétique et la performance. En brut ou éclaté, la pierre affiche un relief naturel très apprécié en architecture vernaculaire. Le bouchardé — obtenu par martelage mécanique — crée une surface antidérapante durable, parfaite pour les abords de piscine et les terrasses exposées à la pluie.",
              "Le poli ou l'adouci révèle la profondeur des teintes et convient aux sols intérieurs, aux murs de séjour ou aux halls d'entrée. Le sablé offre un compromis entre douceur visuelle et adhérence au pied. Chez UNIVMAR, nous transformons la pierre brute en plaques, dalles ou éléments sur mesure selon les plans de votre architecte.",
            ],
          },
          {
            heading: "Usages recommandés",
            paragraphs: [
              "En façade, la pierre de Taza protège l'enveloppe du bâtiment tout en apportant une identité forte. Associée à un traitement hydrofuge adapté, elle vieillit avec élégance sous le soleil marocain. Pour les terrasses et les piscines, privilégiez une épaisseur suffisante (souvent 2 à 3 cm selon la pose) et une finition antidérapante.",
              "En intérieur, elle peut habiller un mur d'accent, un escalier ou une salle de bain à condition de choisir une finition adaptée à l'humidité et d'envisager un entretien régulier. Nos équipes conseillent sur la compatibilité entre matériau, colle, joint et système de pose.",
            ],
            bullets: [
              "Façade ventilée ou collée",
              "Terrasse et allée",
              "Margelles et plage de piscine",
              "Mur intérieur et escalier",
              "Soubassement et muret",
            ],
          },
          {
            heading: "Pourquoi passer par UNIVMAR ?",
            paragraphs: [
              "UNIVMAR est une entreprise marocaine spécialisée dans l'extraction, la transformation et la distribution de marbre et de pierre naturelle. Ancrée dans le riche patrimoine géologique du Maroc, nous accompagnons architectes, designers, promoteurs et maîtres d'ouvrage de la sélection du matériau jusqu'à la livraison.",
              "Notre atelier à Temara (Ain Atiq) permet de découper, finir et préparer vos dalles selon vos cotes. Nous avons livré des projets emblématiques — Mall Le Caroussel, UM6P, résidences haut standing — et mettons la même exigence sur chaque commande, qu'il s'agisse d'une villa ou d'un programme immobilier.",
              "Pour un devis pierre de Taza, contactez-nous par téléphone, e-mail ou WhatsApp. Nous étudions votre surface, la finition souhaitée et la logistique vers Rabat, Casablanca, Marrakech ou ailleurs au Maroc.",
            ],
          },
        ],
      },
      en: {
        title: "Complete guide to Taza stone in 2026",
        description:
          "Origin, finishes, façade, terrace and pool applications, installation and care tips — everything you need to know about Taza stone in Morocco with UNIVMAR.",
        excerpt:
          "Noble limestone from the Taza and Oued Amlil quarries, Taza stone is one of the most requested materials for façades and outdoor projects in Morocco. This guide covers the essentials for architects, developers and homeowners.",
        sections: [
          {
            heading: "What is Taza stone?",
            paragraphs: [
              "Taza stone is a sedimentary limestone quarried in the Taza region, especially around Oued Amlil in north-eastern Morocco. Known for warm beige, cream or pearl-grey tones, it is part of Morocco's geological heritage and a long architectural tradition — from historic medinas to contemporary villas in Rabat, Casablanca and Marrakech.",
              "Unlike marble, which is metamorphic rock, Taza stone retains a more porous structure and excellent weather resistance. That makes it the preferred choice for outdoor use: ventilated façades, retaining walls, terraces, pool copings and pedestrian walkways.",
            ],
          },
          {
            heading: "Main varieties and colours",
            paragraphs: [
              "The UNIVMAR catalogue offers several Taza stone options, each with its own character. Beige Taza tones — sometimes veined with subtle fossils — bring warmth and brightness to façades. Grey variants suit minimalist projects or contrast with dark joinery.",
              "Lot homogeneity is essential on a single site. That is why we rigorously select supplies from partner quarries and inspect every delivery before processing at our Temara workshop.",
            ],
            bullets: [
              "Beige Taza — classic, bright, ideal for façades and terraces",
              "Grey Taza — contemporary, understated, performs well in sun",
              "Bush-hammered or sandblasted finishes — slip-resistant texture for pools",
              "Polished or honed finishes — interior, hall, bathroom",
            ],
          },
          {
            heading: "Finishes: raw, bush-hammered, polished, sandblasted",
            paragraphs: [
              "Finish choice determines both aesthetics and performance. In raw or split form, the stone shows a natural relief prized in vernacular architecture. Bush-hammering — achieved by mechanical texturing — creates a durable slip-resistant surface, perfect for pool surrounds and rain-exposed terraces.",
              "Polish or honing reveals depth of tone and suits interior floors, living-room walls or entrance halls. Sandblasting offers a compromise between visual softness and grip underfoot. At UNIVMAR, we transform raw stone into slabs, tiles or custom pieces to your architect's plans.",
            ],
          },
          {
            heading: "Recommended applications",
            paragraphs: [
              "On façades, Taza stone protects the building envelope while giving a strong identity. With suitable hydrophobic treatment, it ages gracefully under the Moroccan sun. For terraces and pools, choose sufficient thickness (often 2 to 3 cm depending on installation) and a slip-resistant finish.",
              "Indoors, it can clad an accent wall, staircase or bathroom provided you choose a finish suited to humidity and plan regular maintenance. Our teams advise on compatibility between material, adhesive, grout and fixing system.",
            ],
            bullets: [
              "Ventilated or bonded façade",
              "Terrace and walkway",
              "Pool coping and surround",
              "Interior wall and staircase",
              "Plinth and low wall",
            ],
          },
          {
            heading: "Why choose UNIVMAR?",
            paragraphs: [
              "UNIVMAR is a Moroccan company specialised in extracting, processing and distributing marble and natural stone. Rooted in Morocco's rich geological heritage, we support architects, designers, developers and project owners from material selection through to delivery.",
              "Our workshop in Temara (Ain Atiq) cuts, finishes and prepares your slabs to size. We have delivered landmark projects — Mall Le Caroussel, UM6P, high-end residences — and apply the same standards to every order, whether a single villa or a full development.",
              "For a Taza stone quote, contact us by phone, email or WhatsApp. We review your area, desired finish and logistics to Rabat, Casablanca, Marrakech or elsewhere in Morocco.",
            ],
          },
        ],
      },
      ar: {
        title: "دليل شامل لحجر تازة 2026",
        description:
          "الأصل والتشطيبات واستخدامات الواجهات والتراسات والمسابح ونصائح التركيب والصيانة — كل ما يجب معرفته عن حجر تازة في المغرب مع UNIVMAR.",
        excerpt:
          "حجر جيري نبيل من محاجر تازة وواد أميليل، يُعد حجر تازة من أكثر المواد طلباً للواجهات والمشاريع الخارجية في المغرب. يجمع هذا الدليل الأساسيات للمهندسين والمطورين والأفراد.",
        sections: [
          {
            heading: "ما هو حجر تازة؟",
            paragraphs: [
              "حجر تازة هو حجر جيري رسوبي يُستخرج من محاجر منطقة تازة، ولا سيما حول واد أميليل في شمال شرق المغرب. يُعرف بألوانه البيجي الدافئة والكريمية أو الرمادية اللؤلؤية، وهو جزء من التراث الجيولوجي المغربي وتقليد معماري عريق — من المدن التاريخية إلى الفيلات المعاصرة في الرباط والدار البيضاء ومراكش.",
              "على عكس الرخام الذي هو صخر متحول، يحتفظ حجر تازة ببنية أكثر مسامية ومقاومة ممتازة للعوامل الجوية. لذلك يُفضّل للاستخدام الخارجي: الواجهات المهواة والجدران الاستنادية والتراسات وحواف المسابح والممرات.",
            ],
          },
          {
            heading: "الأصناف والألوان الرئيسية",
            paragraphs: [
              "يقدم كتالوج UNIVMAR عدة أنواع من حجر تازة، لكل منها طابع خاص. تضفي درجات البيجي — أحياناً بعروق أحفورية خفية — دفئاً وإشراقاً على الواجهات. تناسب الدرجات الرمادية المشاريع البسيطة أو التباين مع النجارة الداكنة.",
              "تجانس الدفعة ضروري في موقع واحد. لذلك نختار بعناية من المحاجر الشريكة ونفحص كل شحنة قبل التحويل في ورشتنا بتمارة.",
            ],
            bullets: [
              "بيجي تازة — كلاسيكي ومشرق، مثالي للواجهات والتراسات",
              "رمادي تازة — عصري وهادئ، يتحمل الشمس جيداً",
              "تشطيب مبوشارد أو رملي — ملمس مقاوم للانزلاق للمسابح",
              "تشطيب مصقول أو ملسّن — للداخل والردهة والحمام",
            ],
          },
          {
            heading: "التشطيبات: خام، مبوشارد، مصقول، رملي",
            paragraphs: [
              "يحدد اختيار التشطيب الجمالية والأداء معاً. في شكله الخام أو المفتت، يظهر الحجر بإغاثة طبيعية تُقدَّر في العمارة التقليدية. التشطيب المبوشارد — بالطرق الميكانيكي — يخلق سطحاً متيناً مقاوماً للانزلاق، مثالياً لمحيط المسابح والتراسات المعرضة للمطر.",
              "يكشف التلميع أو التليين عمق اللون ويناسب الأرضيات الداخلية وجدران الصالون أو مداخل المنازل. يوفر التشطيب الرملي توازناً بين النعومة البصرية والتماسك تحت القدم. في UNIVMAR، نحول الحجر الخام إلى ألواح أو بلاط أو عناصر مخصصة حسب مخططات مهندسكم.",
            ],
          },
          {
            heading: "الاستخدامات الموصى بها",
            paragraphs: [
              "في الواجهات، يحمي حجر تازة غلاف المبنى ويمنحه هوية قوية. مع معالجة مقاومة للماء مناسبة، يتقادم بأناقة تحت شمس المغرب. للتراسات والمسابح، اختاروا سماكة كافية (غالباً 2 إلى 3 سم حسب التركيب) وتشطيباً مقاوماً للانزلاق.",
              "في الداخل، يمكنه تكسية جدار مميز أو درج أو حمام بشرط اختيار تشطيب مناسب للرطوبة والتخطيط لصيانة منتظمة. يرشدكم فريقنا حول توافق المادة واللاصق والمونة ونظام التثبيت.",
            ],
            bullets: [
              "واجهة مهواة أو ملصقة",
              "تراس وممر",
              "حافة ومحيط المسبح",
              "جدار داخلي ودرج",
              "قاعدة وجدار منخفض",
            ],
          },
          {
            heading: "لماذا UNIVMAR؟",
            paragraphs: [
              "UNIVMAR شركة مغربية متخصصة في استخراج وتحويل وتوزيع الرخام والحجر الطبيعي. من جذورنا في التراث الجيولوجي الغني للمغرب، نرافق المهندسين والمصممين والمطورين وأصحاب المشاريع من اختيار المادة حتى التسليم.",
              "تتيح ورشتنا بتمارة (عين عتيق) قص وتشطيب وتحضير ألواحكم حسب المقاسات. سلّمنا مشاريع بارزة — مول الكاروسيل، جامعة محمد السادس ببنكيران، إقامات فاخرة — ونطبق نفس المعايير على كل طلب، سواء فيلا واحدة أو برنامج عقاري كامل.",
              "لعرض سعر حجر تازة، تواصلوا معنا هاتفياً أو بالبريد أو واتساب. ندرس المساحة والتشطيب المطلوب والنقل إلى الرباط أو الدار البيضاء أو مراكش أو أي منطقة في المغرب.",
            ],
          },
        ],
      },
    },
    faqs: {
      fr: [
        { q: "Pierre Taza et pierre de Taza : y a-t-il une différence ?", a: "Dans les recherches et les devis, les deux formulations renvoient généralement à la même famille de pierre. La référence finale dépend ensuite du lot, de la couleur, de la finition, du format et de l'usage." },
        { q: "Pourquoi Oued Amlil est-il associé à la pierre de Taza ?", a: "Oued Amlil est un repère géographique de la région de Taza. Pour comparer une offre, demandez surtout la référence, l'échantillon, la finition, l'épaisseur et la disponibilité du lot." },
      ],
      ar: [
        { q: "هل توجد فائدة من فرق حجر تازة وعبارة حجر تازة المختصرة؟", a: "غالباً تشير العبارتان إلى عائلة الحجر نفسها في البحث وعروض الأسعار. المرجع النهائي يتحدد بالدفعة واللون والتشطيب والمقاس والاستعمال." },
        { q: "لماذا يرتبط وادي أمليل بحجر تازة؟", a: "وادي أمليل اسم جغرافي مرتبط بمنطقة تازة. عند مقارنة عرض، اطلبوا المرجع والعينة والتشطيب والسماكة وتوفر الدفعة." },
      ],
      en: [
        { q: "Are Pierre Taza and Pierre de Taza different materials?", a: "They usually refer to the same stone family in searches and quotes. The final specification depends on batch, colour, finish, format and intended use." },
      ],
    },
    relatedLinks: {
      fr: [
        { label: "Pierre de Taza : page matière et devis", href: "/pierre-de-taza" },
        { label: "Pierre de Taza et Oued Amlil : guide de provenance", href: "/blog/pierre-de-taza-oued-amlil-guide-chantier" },
        { label: "Marbre de Taza : usages intérieurs", href: "/marbre-de-taza" },
      ],
      ar: [
        { label: "حجر تازة: الصفحة الرئيسية للمادة", href: "/pierre-de-taza" },
        { label: "حجر تازة ووادي أمليل: دليل المصدر", href: "/blog/pierre-de-taza-oued-amlil-guide-chantier" },
        { label: "رخام تازة: الاستخدامات الداخلية", href: "/marbre-de-taza" },
      ],
      en: [
        { label: "Taza stone: material and quote page", href: "/pierre-de-taza" },
        { label: "Taza marble: interior applications", href: "/marbre-de-taza" },
      ],
    },
  },
  {
    slug: "pierre-de-taza-oued-amlil-guide-chantier",
    datePublished: "2026-07-25",
    readingMinutes: 9,
    content: {
      fr: {
        title: "Pierre de Taza et Oued Amlil : guide de provenance et cahier des charges",
        description: "Pierre de Taza, pierre Taza et Oued Amlil : comment vérifier la référence, choisir la finition et préparer un cahier des charges pour façade, terrasse ou piscine au Maroc.",
        excerpt: "La recherche « pierre Taza » ou « pierre Oued Amlil » mène vite à un problème concret : comment comparer deux offres qui utilisent le même nom mais ne proposent pas nécessairement la même finition, épaisseur ou préparation ?",
        sections: [
          {
            heading: "Pierre de Taza, pierre Taza et Oued Amlil : lire correctement les appellations",
            paragraphs: [
              "Dans un devis, une recherche ou une discussion de chantier, « pierre de Taza » est souvent raccourcie en « pierre Taza ». Oued Amlil est aussi fréquemment cité comme repère de la région. Ces expressions sont utiles pour situer une famille de pierre, mais elles ne suffisent pas à définir une commande. Une même appellation peut couvrir des lots, des teintes, des épaisseurs et des finitions très différents.",
              "La bonne démarche consiste à transformer le nom de la pierre en spécification. Demandez la référence exacte proposée, la couleur dominante, la finition visible, l'épaisseur, les formats, les tolérances de variation et la disponibilité du lot. Cela protège le projet contre les comparaisons de prix qui ne portent pas sur le même matériau préparé.",
            ],
          },
          {
            heading: "Le cahier des charges utile avant de demander un prix",
            paragraphs: [
              "Un bon cahier des charges commence par l'usage : façade, mur de clôture, terrasse, cheminement, plage de piscine, sol intérieur ou escalier. Ajoutez ensuite la surface, les plans, la ville du chantier, l'exposition au soleil et à l'eau, le délai et les contraintes d'accès. Ces informations guident la finition, le format, la réserve de coupe et le mode de livraison.",
              "Pour une façade, le support, le système de fixation, le poids et les détails d'angle doivent être traités avec l'équipe de conception et le poseur. Pour une terrasse ou une piscine, la pente, l'évacuation de l'eau, l'adhérence et le joint sont essentiels. Le fournisseur peut préparer la pierre ; la validation de mise en œuvre relève du professionnel qui connaît le bâtiment et le système de pose.",
            ],
            bullets: [
              "Référence et couleur : Beige Taza, Gris Taza ou autre lot identifié",
              "Finition : éclatée, bouchardée, sablée, vieillie, polie ou adoucie",
              "Dimensions : format, épaisseur, bords, découpes et calepinage",
              "Contexte : intérieur, façade, terrasse, piscine, passage et exposition",
              "Logistique : quantité, ville, accès chantier, stockage et délai",
            ],
          },
          {
            heading: "Choisir une finition qui répond à l'usage",
            paragraphs: [
              "La finition n'est pas un simple détail esthétique. Une pierre éclatée apporte du relief à un mur ou une clôture ; une surface bouchardée ou sablée est étudiée pour offrir davantage d'accroche dans les zones extérieures ; un poli ou un adouci s'envisage plutôt pour les espaces intérieurs ou protégés. Il faut comparer l'échantillon dans des conditions proches de la lumière et de l'usage réel.",
              "La couleur agit aussi avec la finition. Le Beige Taza donne une lecture chaude et lumineuse ; le Gris Taza peut structurer une architecture plus contemporaine. Sur une grande surface, le calepinage et la répartition des nuances naturelles sont aussi importants que le choix initial de couleur. Validez une zone témoin ou des échantillons avant la transformation complète.",
            ],
          },
          {
            heading: "De l'échantillon à la livraison : une méthode de comparaison claire",
            paragraphs: [
              "Comparez deux offres ligne par ligne : pierre, finition, épaisseur, format, quantité, chutes, découpes, emballage, transport et éventuelle préparation spécifique. Un prix au m² qui omet une épaisseur, une finition machine ou la livraison ne permet pas de décider sereinement. Une offre claire réduit aussi les ajustements coûteux une fois le chantier engagé.",
              "UNIVMAR sélectionne les références auprès de carrières partenaires et les prépare à son atelier de Temara. Pour demander un devis, envoyez les plans ou la surface, l'usage, les photos d'inspiration, la ville et le calendrier. L'équipe peut proposer une finition cohérente, préparer les formats et organiser la livraison selon le projet.",
            ],
          },
        ],
      },
      ar: {
        title: "حجر تازة وحجر وادي أمليل: دليل المصدر والتشطيب وكراسة المشروع",
        description: "حجر تازة وحجر وادي أمليل: كيف تتحققون من المرجع وتختارون التشطيب وتجهزون كراسة طلب للواجهة أو التراس أو المسبح في المغرب.",
        excerpt: "تؤدي عبارات حجر تازة وحجر وادي أمليل إلى سؤال عملي: كيف نقارن عرضين يستخدمان الاسم نفسه لكن يختلفان في التشطيب أو السماكة أو التحضير؟",
        sections: [
          {
            heading: "حجر تازة ووادي أمليل: فهم الاسم قبل شراء المادة",
            paragraphs: [
              "يظهر اسم حجر تازة أحياناً بصيغة مختصرة في البحث أو عرض السعر، ويرتبط وادي أمليل جغرافياً بمنطقة تازة. تساعد هذه الأسماء على تحديد عائلة الحجر، لكنها لا تكفي لوصف طلب كامل. قد تختلف الدفعات والألوان والسماكات والتشطيبات رغم استعمال الاسم نفسه.",
              "لذلك حوّلوا الاسم إلى مواصفات واضحة: المرجع المعروض، اللون الغالب، التشطيب، السماكة، المقاسات، تفاوت الدفعة وتوفرها. بهذه الطريقة تقارنون مادة متشابهة فعلاً بدلاً من مقارنة سعرين لا يصفان المنتج نفسه.",
            ],
          },
          {
            heading: "كراسة طلب مفيدة قبل عرض السعر",
            paragraphs: [
              "ابدؤوا بالاستعمال: واجهة أو سور أو تراس أو ممر أو محيط مسبح أو أرضية داخلية أو درج. أضيفوا المساحة أو المخطط ومدينة المشروع والتعرض للشمس والماء والمدة وظروف الوصول. تقود هذه المعلومات اختيار التشطيب والمقاس والقص والنقل.",
              "في الواجهة، يجب أن يراجع المصمم والمركب الدعم ونظام التثبيت والوزن والزوايا. وفي التراس أو المسبح، يكون الميل وتصريف الماء والتماسك والفواصل أساسية. يمكن للمورد تحضير الحجر، لكن اعتماد طريقة التنفيذ مسؤولية المختص الذي يعرف المبنى ونظام التركيب.",
            ],
            bullets: [
              "المرجع واللون: بيجي تازة أو رمادي تازة أو دفعة محددة",
              "التشطيب: متشقق أو مبوشارد أو رملي أو معتق أو مصقول أو ملسّن",
              "الأبعاد: المقاس والسماكة والحواف والقص والتقسيم",
              "الموقع: داخل أو واجهة أو تراس أو مسبح والتعرض والحركة",
              "اللوجستيك: الكمية والمدينة والوصول والتخزين والمدة",
            ],
          },
          {
            heading: "التشطيب الصحيح لكل استعمال",
            paragraphs: [
              "التشطيب ليس تفصيلاً شكلياً فقط. الحجر المتشقق يعطي بروزاً للجدار أو السور، والمبوشارد أو الرملي يناسبان غالباً المناطق الخارجية التي تحتاج تماسكاً أكبر، بينما يناقش المصقول أو الملسّن للمساحات الداخلية أو المحمية. قارِنوا العينة في ضوء واستعمال قريبين من الواقع.",
              "يتفاعل اللون مع التشطيب كذلك. بيجي تازة دافئ ومضيء، ورمادي تازة أكثر هدوءاً ومعاصرة. وفي المساحات الكبيرة، يكون توزيع التدرجات الطبيعية والتقسيم مهماً بقدر اختيار اللون. اعتمدوا عينة أو منطقة تجريبية قبل التحويل الكامل.",
            ],
          },
          {
            heading: "من العينة إلى التوصيل: مقارنة عادلة",
            paragraphs: [
              "قارنوا العروض بنداً بنداً: الحجر والتشطيب والسماكة والمقاس والكمية والقص والتغليف والنقل والتحضير الخاص إن وجد. سعر المتر الذي لا يوضح هذه العناصر لا يكفي لاتخاذ قرار. العرض الواضح يقلل أيضاً التعديلات المكلفة في الورشة أو الموقع.",
              "تختار UNIVMAR المراجع من محاجر شريكة ثم تحضرها في ورشتها بتمارة. أرسلوا المخطط أو المساحة والاستعمال وصور الإلهام والمدينة والموعد للحصول على اقتراح قابل للمقارنة وخيارات تجهيز وتوصيل مناسبة.",
            ],
          },
        ],
      },
      en: {
        title: "Taza stone and Oued Amlil: provenance and specification guide",
        description: "How to verify a Taza stone reference, choose a finish and prepare a clear specification for Moroccan façade, terrace and pool projects.",
        excerpt: "A stone name alone does not define a project. This guide turns Taza and Oued Amlil origin searches into a practical, comparable specification.",
        sections: [
          { heading: "Use origin terms correctly", paragraphs: ["Taza stone and Oued Amlil are useful regional references, but a project still needs an exact material specification. Confirm the proposed batch, colour, finish, thickness, format and availability before comparing quotes.", "A clear specification avoids treating different finishes or thicknesses as the same product simply because they share a regional name."] },
          { heading: "Prepare the project brief", paragraphs: ["State the use, area or drawing, project city, sun and water exposure, timing and site access. These details determine finish, format, fabrication allowance and delivery.", "For façades, the designer and installer must validate support and fixing. For terraces and pools, slope, drainage, grip and joints are central."] },
          { heading: "Match finish to use", paragraphs: ["Split-face stone gives relief to walls; bush-hammered or sandblasted finishes are generally considered for exterior grip; polished or honed finishes are assessed for protected or interior spaces.", "Approve a representative sample and consider colour variation and layout across large surfaces before complete fabrication."] },
          { heading: "Compare clear quotes", paragraphs: ["Compare material, finish, thickness, format, quantity, cuts, packaging and delivery line by line. A bare m² price is not enough for a reliable decision.", "UNIVMAR prepares selected partner-quarry references at its Temara workshop and can quote from drawings, intended use, city and timing."] },
        ],
      },
    },
    relatedLinks: {
      fr: [
        { label: "Pierre de Taza : matière, finitions et devis", href: "/pierre-de-taza" },
        { label: "Guide complet de la pierre de Taza", href: "/blog/guide-pierre-de-taza-2026" },
        { label: "Marbre de Taza : choix intérieur", href: "/marbre-de-taza" },
      ],
      ar: [
        { label: "حجر تازة: تشطيبات وعرض سعر", href: "/pierre-de-taza" },
        { label: "الدليل الشامل لحجر تازة", href: "/blog/guide-pierre-de-taza-2026" },
        { label: "رخام تازة: الاختيار للداخل", href: "/marbre-de-taza" },
      ],
      en: [
        { label: "Taza stone: finishes and quotation", href: "/pierre-de-taza" },
        { label: "Complete Taza stone guide", href: "/blog/guide-pierre-de-taza-2026" },
      ],
    },
  },
  {
    slug: "pierre-de-taza-vs-marbre",
    datePublished: "2026-02-01",
    readingMinutes: 10,
    content: {
      fr: {
        title: "Pierre de Taza ou marbre : comment choisir ?",
        description:
          "Comparatif technique et esthétique entre pierre de Taza et marbre pour vos projets au Maroc — extérieur, intérieur, budget et entretien.",
        excerpt:
          "Deux matériaux nobles, deux géologies différentes. La pierre de Taza excelle en extérieur ; le marbre sublime les intérieurs. Voici comment arbitrer selon votre projet.",
        sections: [
          {
            heading: "Deux familles de roches, deux logiques",
            paragraphs: [
              "La pierre de Taza est un calcaire sédimentaire : elle se forme par dépôt de sédiments en milieu marin ou lacustre. Le marbre, lui, est une roche métamorphique issue du recristallisation d'un calcaire sous forte pression et chaleur. Cette différence explique leurs comportements : le marbre offre un poli profond et des veinages spectaculaires ; la pierre de Taza reste plus mate et plus tolérante aux UV et à l'humidité extérieure.",
              "Sur un même projet, il est courant de combiner les deux : pierre de Taza en façade et terrasse, marbre importé ou local en hall, salle de bain ou plan de travail.",
            ],
          },
          {
            heading: "Résistance et environnement",
            paragraphs: [
              "Au Maroc, l'ensoleillement, les écarts thermiques et les pluies hivernales imposent des contraintes réelles. En extérieur non abrité, la pierre de Taza — surtout en finition bouchardée ou sablée — est généralement plus sûre qu'un marbre poli qui peut s'altérer ou devenir glissant.",
              "En intérieur climatisé ou semi-protégé, le marbre local (Taza, Khénifra, Azilal) ou importé (Carrare, Emperador, Travertin) apporte prestige et finesse. Pour une salle de bain, anticipez l'entretien : certains marbres clairs marquent plus facilement au contact de l'eau calcaire ou des cosmétiques.",
            ],
            bullets: [
              "Extérieur exposé → pierre de Taza en priorité",
              "Hall, salon, salle de bain → marbre",
              "Piscine → pierre de Taza antidérapante, pas marbre poli",
              "Escalier intérieur → marbre ou pierre selon le trafic",
            ],
          },
          {
            heading: "Esthétique et style architectural",
            paragraphs: [
              "La pierre de Taza dialogue avec l'architecture marocaine contemporaine et traditionnelle : murs en pisé, volumes cubiques, villas de Rabat-Souissi ou de la Corniche. Le marbre, avec ses veinages graphiques, convient aux intérieurs luxueux, hôtels 5 étoiles et espaces de réception.",
              "UNIVMAR propose les deux familles dans un catalogue de plus de 80 références — marbre local, marbre importé, granit et pierre naturelle — pour harmoniser votre projet sans multiplier les interlocuteurs.",
            ],
          },
          {
            heading: "Budget et devis",
            paragraphs: [
              "Le prix au m² dépend de la finition, l'épaisseur, la complexité de découpe et le volume — pas seulement du nom du matériau. En règle générale, la pierre de Taza en finition façade reste compétitive pour de grandes surfaces ; un marbre importé rare sera positionné plus haut.",
              "Plutôt que de comparer des chiffres génériques trouvés en ligne, demandez un devis chiffré avec plans et quantités. Notre équipe à Temara répond sous 24 h avec une proposition adaptée à votre chantier.",
            ],
          },
        ],
      },
      en: {
        title: "Taza stone or marble: how to choose?",
        description:
          "Technical and aesthetic comparison between Taza stone and marble for your projects in Morocco — exterior, interior, budget and maintenance.",
        excerpt:
          "Two noble materials, two different geologies. Taza stone excels outdoors; marble elevates interiors. Here is how to decide for your project.",
        sections: [
          {
            heading: "Two rock families, two logics",
            paragraphs: [
              "Taza stone is sedimentary limestone: it forms from sediment deposited in marine or lacustrine environments. Marble is metamorphic rock formed by recrystallisation of limestone under heat and pressure. This explains their behaviour: marble offers deep polish and spectacular veining; Taza stone stays more matte and more tolerant of UV and outdoor humidity.",
              "On the same project, it is common to combine both: Taza stone on façade and terrace, local or imported marble in the hall, bathroom or worktop.",
            ],
          },
          {
            heading: "Resistance and environment",
            paragraphs: [
              "In Morocco, sunshine, thermal swings and winter rain impose real constraints. In exposed outdoor areas, Taza stone — especially bush-hammered or sandblasted — is generally safer than polished marble, which can weather or become slippery.",
              "In air-conditioned or semi-protected interiors, local marble (Taza, Khénifra, Azilal) or imported (Carrara, Emperador, travertine) brings prestige and refinement. For bathrooms, plan for maintenance: some light marbles mark more easily with hard water or cosmetics.",
            ],
            bullets: [
              "Exposed exterior → Taza stone first",
              "Hall, living room, bathroom → marble",
              "Pool → slip-resistant Taza stone, not polished marble",
              "Interior staircase → marble or stone depending on traffic",
            ],
          },
          {
            heading: "Aesthetics and architectural style",
            paragraphs: [
              "Taza stone works with contemporary and traditional Moroccan architecture: pisé walls, cubic volumes, villas in Rabat-Souissi or the Corniche. Marble, with its graphic veining, suits luxurious interiors, five-star hotels and reception spaces.",
              "UNIVMAR offers both families in a catalogue of 80+ references — local marble, imported marble, granite and natural stone — to harmonise your project without multiple suppliers.",
            ],
          },
          {
            heading: "Budget and quotes",
            paragraphs: [
              "Price per m² depends on finish, thickness, cutting complexity and volume — not just the material name. Generally, Taza stone in façade finish stays competitive for large areas; rare imported marble will be priced higher.",
              "Rather than comparing generic online figures, request a detailed quote with plans and quantities. Our Temara team responds within 24 hours with a proposal suited to your site.",
            ],
          },
        ],
      },
      ar: {
        title: "حجر تازة أم الرخام: كيف تختار؟",
        description:
          "مقارنة تقنية وجمالية بين حجر تازة والرخام لمشاريعكم في المغرب — خارجي، داخلي، ميزانية وصيانة.",
        excerpt:
          "مادتان نبيلتان وجيولوجيتان مختلفتان. يتفوق حجر تازة في الخارج؛ والرخام يُجمّل الداخل. إليك كيفية الاختيار حسب مشروعكم.",
        sections: [
          {
            heading: "عائلتان من الصخور، منطقان مختلفان",
            paragraphs: [
              "حجر تازة حجر جيري رسوبي يتشكل من ترسب الرواسب في بيئة بحرية أو بحيرية. الرخام صخر متحول ناتج عن إعادة تبلور الحجر الجيري تحت الحرارة والضغط. يفسر هذا سلوكهما: يمنح الرخام تلميعاً عميقاً وعروقاً مذهلة؛ يبقى حجر تازة أكثر مطمسية ويتسامح مع الأشعة فوق البنفسجية والرطوبة الخارجية.",
              "في مشروع واحد، من الشائع الجمع بينهما: حجر تازة للواجهة والتراس، ورخام محلي أو مستورد للردهة والحمام أو سطح العمل.",
            ],
          },
          {
            heading: "المقاومة والبيئة",
            paragraphs: [
              "في المغرب، تفرض الشمس وتقلبات الحرارة وأمطار الشتاء قيوداً حقيقية. في الخارج المكشوف، حجر تازة — خاصة المبوشارد أو الرملي — أكثر أماناً عموماً من الرخام المصقول الذي قد يتأثر أو يصبح زلقاً.",
              "في الداخل المكيف أو شبه المحمي، يمنح الرخام المحلي (تازة، خنيفرة، أزيلال) أو المستورد (كارارا، إمبرادور، ترافرتين) فخامة ورقي. للحمام، خططوا للصيانة: بعض الرخامات الفاتحة تتأثر أسهل بماء الجير أو مستحضرات التجميل.",
            ],
            bullets: [
              "خارج مكشوف → حجر تازة أولاً",
              "ردهة وصالون وحمام → رخام",
              "مسبح → حجر تازة مقاوم للانزلاق، لا رخام مصقول",
              "درج داخلي → رخام أو حجر حسب الاستخدام",
            ],
          },
          {
            heading: "الجمالية والطراز المعماري",
            paragraphs: [
              "يتناغم حجر تازة مع العمارة المغربية المعاصرة والتقليدية: جدران الطين المكدس والأحجام المكعبة وفيلات الرباط السويسي أو الكورنيش. يناسب الرخام بعروقه البيانية الداخل الفاخر والفنادق الخمس نجوم وقاعات الاستقبال.",
              "تقدم UNIVMAR العائلتين في كتالوج يضم أكثر من 80 مرجعاً — رخام محلي ومستورد وغرانيت وحجر طبيعي — لتوحيد مشروعكم دون تعدد الموردين.",
            ],
          },
          {
            heading: "الميزانية وعرض السعر",
            paragraphs: [
              "يعتمد سعر المتر المربع على التشطيب والسماكة وتعقيد القص والحجم — وليس اسم المادة فقط. عموماً، يبقى حجر تازة بتشطيب الواجهة تنافسياً للمساحات الكبيرة؛ والرخام المستورد النادر أعلى سعراً.",
              "بدلاً من مقارنة أرقام عامة على الإنترنت، اطلبوا عرض سعر مفصلاً مع المخططات والكميات. يرد فريقنا بتمارة خلال 24 ساعة باقتراح مناسب لموقعكم.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "prix-pierre-de-taza-maroc",
    datePublished: "2026-02-10",
    readingMinutes: 9,
    content: {
      fr: {
        title: "Prix du marbre et de la pierre de Taza au Maroc : comprendre votre devis",
        description:
          "Facteurs de prix au m², finitions, épaisseurs, marbre local, Crema Marfil et pierre de Taza — comment obtenir un devis transparent pour votre marbre au Maroc avec UNIVMAR.",
        excerpt:
          "Il n'existe pas un prix unique pour le marbre au Maroc ni pour la pierre de Taza. Finition, épaisseur, type de pierre (locale ou importée) et logistique expliquent les écarts entre projets. Voici ce qu'il faut savoir sur les prix du marbre Maroc avant de demander un devis.",
        sections: [
          {
            heading: "Pourquoi les prix du marbre et de la pierre varient-ils autant ?",
            paragraphs: [
              "Sur internet, vous trouverez parfois des fourchettes de prix marbre Maroc au m² qui ne correspondent pas à votre réalité de chantier. Le marbre et la pierre de Taza se vendent en dalles, plaques ou éléments sur mesure — pas en produit standardisé comme une peinture en pot. Le prix intègre la qualité du lot, la finition demandée, l'épaisseur, les chutes liées à la découpe et parfois la complexité des angles ou des retours.",
              "Un mur de façade de 200 m² en pierre de Taza bouchardée 3 cm n'a pas la même structure de coût qu'un sol de 40 m² en marbre Volubilis ou Crema Marfil adouci 2 cm. C'est normal, et c'est pourquoi UNIVMAR travaille sur devis personnalisé plutôt que sur un tarif catalogue affiché.",
            ],
          },
          {
            heading: "Les 5 facteurs qui pèsent sur le devis",
            paragraphs: [
              "Chaque projet est chiffré en tenant compte de paramètres précis. Plus vous les clarifiez en amont, plus le devis sera fiable.",
            ],
            bullets: [
              "Finition : brut < adouci < bouchardé / sablé < poli (selon épaisseur et temps machine)",
              "Épaisseur : 2 cm, 3 cm ou plus pour terrasse et piscine",
              "Volume : les grandes quantités permettent d'optimiser le prix au m²",
              "Découpe : formes simples vs marches, margelles, angles sortants",
              "Logistique : livraison Temara → Rabat, Casablanca, Marrakech ou autre région",
            ],
          },
          {
            heading: "Ce que comprend un devis UNIVMAR",
            paragraphs: [
              "Lorsque vous nous contactez, nous étudions vos plans ou une description détaillée (surface, usage, finition souhaitée, adresse de chantier). Le devis précise le matériau, la quantité estimée, les options de finition et les conditions de livraison. Nous pouvons également proposer des alternatives — autre teinte de Taza, autre finition — si le budget est contraint.",
              "Notre atelier à Temara centralise la transformation : vous traitez directement avec le transformateur, sans intermédiaire superflu. Téléphone : +212 660-419991 — e-mail : contact@universmarbre.com.",
            ],
          },
          {
            heading: "Comment obtenir le meilleur rapport qualité-prix",
            paragraphs: [
              "Anticipez votre commande : les délais de carrière et d'atelier varient selon la saison. Regroupez les surfaces identiques pour limiter les chutes. Visitez notre atelier pour voir les lots disponibles et valider la teinte réelle — l'écran ne remplace jamais l'échantillon.",
              "En résumé : le « prix m² pierre de Taza Maroc » n'a de sens qu'au sein d'un devis complet. Demandez le vôtre gratuitement ; nous répondons sous 24 heures ouvrées.",
            ],
          },
        ],
      },
      en: {
        title: "Taza stone pricing in Morocco: understanding your quote",
        description:
          "m² price factors, finishes, thickness, transport and volume — how to get a transparent Taza stone quote with UNIVMAR.",
        excerpt:
          "There is no single price for Taza stone. Finish, thickness, quantity and logistics explain differences between projects. Here is what to know before requesting a quote.",
        sections: [
          {
            heading: "Why do prices vary so much?",
            paragraphs: [
              "Online you may find m² ranges that do not match your site reality. Taza stone is sold as slabs, tiles or custom pieces — not a standardised product like a tin of paint. Price includes lot quality, requested finish, thickness, cutting waste and sometimes corner or return complexity.",
              "A 200 m² bush-hammered 3 cm façade wall does not have the same cost structure as a 40 m² honed 2 cm terrace. That is normal, and why UNIVMAR works on personalised quotes rather than a published catalogue price.",
            ],
          },
          {
            heading: "The 5 factors in your quote",
            paragraphs: [
              "Every project is priced against precise parameters. The clearer you are upfront, the more reliable the quote.",
            ],
            bullets: [
              "Finish: raw < honed < bush-hammered / sandblasted < polished (by thickness and machine time)",
              "Thickness: 2 cm, 3 cm or more for terrace and pool",
              "Volume: larger quantities optimise price per m²",
              "Cutting: simple shapes vs steps, copings, external angles",
              "Logistics: delivery Temara → Rabat, Casablanca, Marrakech or other region",
            ],
          },
          {
            heading: "What a UNIVMAR quote includes",
            paragraphs: [
              "When you contact us, we review your plans or a detailed brief (area, use, desired finish, site address). The quote specifies material, estimated quantity, finish options and delivery terms. We can also suggest alternatives — another Taza shade or finish — if budget is tight.",
              "Our Temara workshop centralises processing: you deal directly with the fabricator, without unnecessary middlemen. Phone: +212 660-419991 — email: contact@universmarbre.com.",
            ],
          },
          {
            heading: "How to get the best value",
            paragraphs: [
              "Plan ahead: quarry and workshop lead times vary by season. Group identical surfaces to limit waste. Visit our workshop to see available lots and confirm the real shade — a screen never replaces a sample.",
              "In short: « Taza stone price per m² Morocco » only makes sense within a full quote. Request yours free of charge; we respond within 24 business hours.",
            ],
          },
        ],
      },
      ar: {
        title: "سعر حجر تازة في المغرب: فهم عرض السعر",
        description:
          "عوامل السعر للمتر المربع والتشطيبات والسماكة والنقل والحجم — كيفية الحصول على عرض سعر شفاف لحجر تازة مع UNIVMAR.",
        excerpt:
          "لا يوجد سعر واحد لحجر تازة. التشطيب والسماكة والكمية واللوجستيك تفسر الفروقات بين المشاريع. إليك ما يجب معرفته قبل طلب عرض السعر.",
        sections: [
          {
            heading: "لماذا تختلف الأسعار كثيراً؟",
            paragraphs: [
              "قد تجدون على الإنترنت نطاقات للمتر المربع لا تطابق واقع موقعكم. يُباع حجر تازة على شكل ألواح أو بلاط أو قطع مخصصة — وليس منتجاً موحداً كعلبة دهان. يشمل السعر جودة الدفعة والتشطيب المطلوب والسماكة وفضلات القص وأحياناً تعقيد الزوايا.",
              "جدار واجهة 200 م² بحجر مبوشارد 3 سم ليس له نفس هيكل تكلفة تراس 40 م² ببلاط ملسّن 2 سم. هذا طبيعي، ولذلك تعمل UNIVMAR بعروض أسعار مخصصة وليس بسعر كتالوج معلن.",
            ],
          },
          {
            heading: "العوامل الخمسة في عرض السعر",
            paragraphs: [
              "يُسعَّر كل مشروع وفق معايير دقيقة. كلما وضحتمها مسبقاً، كان العرض أكثر موثوقية.",
            ],
            bullets: [
              "التشطيب: خام < ملسّن < مبوشارد / رملي < مصقول (حسب السماكة ووقت الآلة)",
              "السماكة: 2 سم أو 3 سم أو أكثر للتراس والمسبح",
              "الحجم: الكميات الكبيرة تحسّن سعر المتر المربع",
              "القص: أشكال بسيطة مقابل درجات وحواف وزوايا بارزة",
              "اللوجستيك: التوصيل من تمارة إلى الرباط أو الدار البيضاء أو مراكش أو مناطق أخرى",
            ],
          },
          {
            heading: "ما يشمله عرض سعر UNIVMAR",
            paragraphs: [
              "عند التواصل معنا، ندرس مخططاتكم أو وصفاً مفصلاً (المساحة والاستخدام والتشطيب المطلوب وعنوان الموقع). يحدد العرض المادة والكمية التقديرية وخيارات التشطيب وشروط التسليم. يمكننا أيضاً اقتراح بدائل — لون تازة أو تشطيب آخر — إذا كانت الميزانية محدودة.",
              "تمركز ورشتنا بتمارة التحويل: تتعاملون مباشرة مع المُحوِّل دون وسطاء غير ضروريين. الهاتف: +212 660-419991 — البريد: contact@universmarbre.com.",
            ],
          },
          {
            heading: "كيفية الحصول على أفضل قيمة",
            paragraphs: [
              "خططوا مسبقاً: تختلف آجال المحاجر والورشة حسب الموسم. جمّعوا الأسطح المتشابهة للحد من الفضلات. زوروا ورشتنا لرؤية الدفعات المتاحة والتحقق من اللون الحقيقي — الشاشة لا تغني عن العينة.",
              "باختصار: « سعر متر مربع حجر تازة المغرب » له معنى فقط ضمن عرض سعر كامل. اطلبوا عرضكم مجاناً؛ نرد خلال 24 ساعة عمل.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "facades-pierre-naturelle-maroc",
    datePublished: "2026-03-01",
    readingMinutes: 11,
    content: {
      fr: {
        title: "Façades en pierre naturelle au Maroc : guide pratique",
        description:
          "Pierre de Taza, éclatés, ardoise : choix du matériau, systèmes de pose, hydrofuge et inspirations pour villas et immeubles.",
        excerpt:
          "Habiller une façade en pierre naturelle, c'est affirmer une identité durable. Ce guide détaille les matériaux, les finitions et les bonnes pratiques au Maroc.",
        sections: [
          {
            heading: "Pourquoi choisir la pierre naturelle en façade ?",
            paragraphs: [
              "La façade est la première signature d'un bâtiment. En pierre naturelle, elle résiste au temps, ne se décolore pas comme certains enduits et apporte une texture que le mortier ne reproduit pas. Au Maroc, où l'architecture oscille entre héritage et modernité, la pierre de Taza et les pierres locales s'imposent sur villas, résidences et programmes tertiaires.",
              "Au-delà de l'esthétique, la pierre protège l'enveloppe et participe à la valeur patrimoniale du bien — un argument fort pour l'investissement locatif haut standing ou la revente.",
            ],
          },
          {
            heading: "Matériaux adaptés aux façades marocaines",
            paragraphs: [
              "La pierre de Taza en finition bouchardée ou éclatée reste la référence pour un rendu chaleureux et une bonne tenue au soleil. L'ardoise et certains granits entrent dans des compositions plus contemporaines. Le marbre local peut être utilisé en façade abritée ou en éléments décoratifs, mais demande une réflexion sur l'exposition et l'entretien.",
            ],
            bullets: [
              "Pierre de Taza beige ou grise — polyvalente, patrimoine marocain",
              "Pierre éclatée — relief naturel, style rustique chic",
              "Ardoise — lignes contemporaines, teintes sombres",
              "Granit — zones à fort impact, socles et soubassements",
            ],
          },
          {
            heading: "Pose collée ou façade ventilée",
            paragraphs: [
              "En pose collée, les dalles sont fixées directement sur le support préparé (béton, bloc, isolant compatible). C'est la solution la plus courante sur villas individuelles. La façade ventilée laisse une lame d'air entre la pierre et l'isolant : meilleure gestion de l'humidité et de la chaleur, souvent retenue sur immeubles ou projets certifiés.",
              "Le choix dépend du bureau d'études, des normes locales et du budget. UNIVMAR fournit les dalles et conseille sur les épaisseurs ; la mise en œuvre relève du corps de métier façade agréé par votre architecte.",
            ],
          },
          {
            heading: "Entretien et hydrofuge",
            paragraphs: [
              "Un traitement hydrofuge adapté à la pierre poreuse limite les taches d'eau et facilite le nettoyage en période pluvieuse. Il ne remplace pas une finition de qualité ni une pose soignée, mais prolonge la beauté de la façade pendant des années.",
              "Évitez les produits acides sur le calcaire. Un rinçage à l'eau claire et un entretien périodique suffisent souvent sur une façade bien conçue.",
            ],
          },
          {
            heading: "S'inspirer de réalisations UNIVMAR",
            paragraphs: [
              "Des résidences de haut standing aux projets institutionnels comme l'UM6P ou le Mall Le Caroussel, nous avons l'habitude de travailler avec des architectes exigeants. Chaque façade est une commande sur mesure : teinte, format de dalle, joints et rythme de pose sont définis en amont.",
              "Vous avez un projet de façade en pierre naturelle ? Envoyez-nous vos plans ou organisez une visite à l'atelier de Temara pour choisir le lot qui correspond à votre vision.",
            ],
          },
        ],
      },
      en: {
        title: "Natural stone façades in Morocco: practical guide",
        description:
          "Taza stone, split stone, slate: material choice, fixing systems, hydrophobic treatment and inspiration for villas and buildings.",
        excerpt:
          "Cladding a façade in natural stone asserts a lasting identity. This guide details materials, finishes and best practices in Morocco.",
        sections: [
          {
            heading: "Why choose natural stone for façades?",
            paragraphs: [
              "The façade is a building's first signature. In natural stone, it withstands time, does not fade like some renders and brings a texture mortar cannot replicate. In Morocco, where architecture balances heritage and modernity, Taza stone and local stones are standard on villas, residences and commercial projects.",
              "Beyond aesthetics, stone protects the envelope and adds patrimonial value — a strong argument for high-end rental investment or resale.",
            ],
          },
          {
            heading: "Materials suited to Moroccan façades",
            paragraphs: [
              "Taza stone in bush-hammered or split finish remains the reference for a warm look and good performance in sun. Slate and some granites suit more contemporary compositions. Local marble can be used on sheltered façades or as decorative elements, but exposure and maintenance must be considered.",
            ],
            bullets: [
              "Beige or grey Taza stone — versatile, Moroccan heritage",
              "Split stone — natural relief, rustic chic",
              "Slate — contemporary lines, dark tones",
              "Granite — high-impact zones, plinths and bases",
            ],
          },
          {
            heading: "Bonded fixing or ventilated façade",
            paragraphs: [
              "With bonded fixing, slabs are attached directly to the prepared substrate (concrete, block, compatible insulation). This is most common on individual villas. A ventilated façade leaves an air gap between stone and insulation: better moisture and heat management, often chosen on apartment blocks or certified projects.",
              "The choice depends on the engineer, local standards and budget. UNIVMAR supplies slabs and advises on thickness; installation is carried out by a façade contractor approved by your architect.",
            ],
          },
          {
            heading: "Maintenance and hydrophobic treatment",
            paragraphs: [
              "Hydrophobic treatment suited to porous stone limits water marks and eases cleaning in rainy periods. It does not replace quality finish or careful installation, but extends façade beauty for years.",
              "Avoid acid products on limestone. Clear-water rinsing and periodic maintenance are often enough on a well-designed façade.",
            ],
          },
          {
            heading: "Learn from UNIVMAR projects",
            paragraphs: [
              "From high-end residences to institutional projects such as UM6P or Mall Le Caroussel, we routinely work with demanding architects. Every façade is bespoke: shade, slab format, joints and laying rhythm are defined in advance.",
              "Have a natural stone façade project? Send us your plans or arrange a visit to our Temara workshop to choose the lot that matches your vision.",
            ],
          },
        ],
      },
      ar: {
        title: "واجهات حجر طبيعي في المغرب: دليل عملي",
        description:
          "حجر تازة والحجر المفتت والأردواز: اختيار المادة وأنظمة التثبيت والعزل المائي وإلهام للفيلات والمباني.",
        excerpt:
          "تكسية الواجهة بالحجر الطبيعي تعبّر عن هوية دائمة. يفصل هذا الدليل المواد والتشطيبات وأفضل الممارسات في المغرب.",
        sections: [
          {
            heading: "لماذا الحجر الطبيعي للواجهات؟",
            paragraphs: [
              "الواجهة هي التوقيع الأول للمبنى. بالحجر الطبيعي، تتحمل الزمن ولا تبهت كبعض الجص وتمنح ملمساً لا يحاكيه الملاط. في المغرب، حيث يوازن العمار بين التراث والحداثة، يفرض حجر تازة والأحجار المحلية نفسه على الفيلات والإقامات والمشاريع التجارية.",
              "فوق الجمالية، يحمي الحجر الغلاف ويرفع القيمة العقارية — حجة قوية للاستثمار الفاخر أو إعادة البيع.",
            ],
          },
          {
            heading: "مواد مناسبة للواجهات المغربية",
            paragraphs: [
              "يبقى حجر تازة بتشطيب مبوشارد أو مفتت المرجع لمظهر دافئ وأداء جيد تحت الشمس. يدخل الأردواز وبعض أنواع الغرانيت في تركيبات عصرية. يمكن استخدام الرخام المحلي في واجهات محمية أو عناصر زخرفية، مع مراعاة التعرض والصيانة.",
            ],
            bullets: [
              "حجر تازة بيجي أو رمادي — متعدد الاستخدامات وتراث مغربي",
              "حجر مفتت — إغاثة طبيعية وأسلوب ريفي أنيق",
              "أردواز — خطوط عصرية وألوان داكنة",
              "غرانيت — مناطق عالية الاستخدام والقواعد",
            ],
          },
          {
            heading: "تثبيت ملصق أو واجهة مهواة",
            paragraphs: [
              "في التثبيت الملصق، تُثبت الألواح مباشرة على الأساس المُعد (خرسانة أو طوب أو عزل متوافق). هذا الأكثر شيوعاً في الفيلات. تترك الواجهة المهواة فجوة هواء بين الحجر والعزل: إدارة أفضل للرطوبة والحرارة، وغالباً في العمارات أو المشاريع المعتمدة.",
              "يعتمد الاختيار على المكتب الدراسات والمعايير المحلية والميزانية. توفر UNIVMAR الألواح وتنصح بالسماكة؛ التنفيذ يكون عبر مقاول واجهات معتمد من مهندسكم.",
            ],
          },
          {
            heading: "الصيانة والعزل المائي",
            paragraphs: [
              "معالجة مقاومة للماء مناسبة للحجر المسامي تحد من بقع الماء وتسهّل التنظيف في موسم الأمطار. لا تغني عن تشطيب جيد أو تركيب دقيق، لكنها تطيل جمال الواجهة لسنوات.",
              "تجنبوا المنتجات الحمضية على الحجر الجيري. غالباً يكفي الشطف بالماء الصافي والصيانة الدورية للواجهة المصممة جيداً.",
            ],
          },
          {
            heading: "استلهام مشاريع UNIVMAR",
            paragraphs: [
              "من الإقامات الفاخرة إلى المشاريع المؤسسية مثل جامعة محمد السادس ببنكيران أو مول الكاروسيل، نعمل بانتظام مع مهندسين صارمين. كل واجهة طلب مخصص: اللون وصيغة اللوح والفواصل وإيقاع التركيب تُحدد مسبقاً.",
              "لديكم مشروع واجهة حجر طبيعي؟ أرسلوا مخططاتكم أو رتبوا زيارة لورشتنا بتمارة لاختيار الدفعة المناسبة لرؤيتكم.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "entretien-marbre-pierre-naturelle",
    datePublished: "2026-03-15",
    readingMinutes: 10,
    content: {
      fr: {
        title: "Entretien du marbre et de la pierre naturelle : le guide UNIVMAR",
        description:
          "Nettoyage quotidien, produits à éviter, hydrofuge, taches courantes et entretien spécifique marbre poli vs pierre de Taza.",
        excerpt:
          "Marbre poli ou pierre de Taza en terrasse : chaque surface a ses règles. Ce guide pratique prolonge la beauté de vos matériaux nobles au Maroc.",
        sections: [
          {
            heading: "Les principes de base",
            paragraphs: [
              "Marbre et pierre naturelle sont durables, mais pas invulnérables. L'ennemi numéro un du marbre poli est l'acidité : jus de citron, vinaigre, certains produits ménagers « multi-usages » ou anti-calcaire agressifs. Ils attaquent la surface et laissent des marques mates difficiles à rattraper.",
              "La règle d'or : chiffon doux, eau tiède, savon neutre pH 7. Essuyez les liquides renversés rapidement, surtout sur les plans de travail et les sols de salle de bain.",
            ],
          },
          {
            heading: "Entretien du marbre",
            paragraphs: [
              "En intérieur, dépoussiérez régulièrement pour éviter que les grains de sable rayent le poli. Utilisez des feutres sous les objets décoratifs lourds. Pour un sol en marbre à fort passage, un entretien professionnel (cristallisation ou polissage) peut être envisagé tous les quelques années selon l'usage.",
              "En salle de bain, séchez les zones d'eau stagnante et aérez pour limiter les dépôts calcaires. Un traitement hydro-oléofuge en usine ou après pose réduit la pénétration des taches.",
            ],
            bullets: [
              "Interdit : vinaigre, acide, javel sur marbre poli",
              "Recommandé : nettoyant pH neutre, microfibre",
              "Taches d'eau : chiffon sec + produit adapté calcaire doux",
            ],
          },
          {
            heading: "Entretien de la pierre de Taza",
            paragraphs: [
              "En extérieur, la pierre de Taza vieillit naturellement. Un léger voile ou une patine peuvent apparaître sans compromettre la solidité. Un hydrofuge respirant, reappliqué selon les préconisations du fabricant (souvent tous les 3 à 5 ans), protège contre les taches d'humidité et les salissures urbaines.",
              "Nettoyez à la brosse souple et à l'eau claire. Évitez le nettoyeur haute pression trop près du joint qui pourrait décoller les plaques. En terrasse, balayez régulièrement pour éliminer le sable abrasif.",
            ],
          },
          {
            heading: "Taches courantes et que faire",
            paragraphs: [
              "Tache de vin ou de café sur marbre : absorbez immédiatement, nettoyez au savon neutre. Si la tache a pénétré, contactez un professionnel du ponçage localisé. Sur pierre poreuse extérieure, une lessive douce et un rinçage abondant suffisent souvent.",
              "Lors de la livraison de vos matériaux, UNIVMAR vous indique les précautions spécifiques à la finition choisie. N'hésitez pas à demander une fiche d'entretien pour vos équipes de ménage ou de facility management.",
            ],
          },
        ],
      },
      en: {
        title: "Marble and natural stone maintenance: the UNIVMAR guide",
        description:
          "Daily cleaning, products to avoid, hydrophobic treatment, common stains and specific care for polished marble vs Taza stone.",
        excerpt:
          "Polished marble or Taza stone on a terrace: each surface has its rules. This practical guide preserves the beauty of your noble materials in Morocco.",
        sections: [
          {
            heading: "Basic principles",
            paragraphs: [
              "Marble and natural stone are durable but not invulnerable. The number-one enemy of polished marble is acidity: lemon juice, vinegar, some « multi-purpose » cleaners or aggressive limescale removers. They etch the surface and leave dull marks that are hard to fix.",
              "The golden rule: soft cloth, lukewarm water, pH-neutral soap. Wipe spills quickly, especially on worktops and bathroom floors.",
            ],
          },
          {
            heading: "Marble care",
            paragraphs: [
              "Indoors, dust regularly so sand grains do not scratch the polish. Use felt pads under heavy décor. For high-traffic marble floors, professional care (crystallisation or repolishing) may be needed every few years depending on use.",
              "In bathrooms, dry standing water and ventilate to limit limescale. Factory or post-install hydro-oleophobic treatment reduces stain penetration.",
            ],
            bullets: [
              "Avoid: vinegar, acid, bleach on polished marble",
              "Recommended: pH-neutral cleaner, microfibre",
              "Water marks: dry cloth + mild limescale product",
            ],
          },
          {
            heading: "Taza stone care",
            paragraphs: [
              "Outdoors, Taza stone ages naturally. A light veil or patina may appear without compromising strength. Breathable hydrophobic treatment, reapplied per manufacturer guidance (often every 3 to 5 years), protects against moisture stains and urban dirt.",
              "Clean with a soft brush and clear water. Avoid pressure washers too close to joints that could loosen slabs. On terraces, sweep regularly to remove abrasive sand.",
            ],
          },
          {
            heading: "Common stains and what to do",
            paragraphs: [
              "Wine or coffee on marble: absorb immediately, clean with neutral soap. If the stain has penetrated, contact a professional for local honing. On porous outdoor stone, mild detergent and thorough rinsing are often enough.",
              "When we deliver your materials, UNIVMAR explains precautions for your chosen finish. Ask for a care sheet for your housekeeping or facility management team.",
            ],
          },
        ],
      },
      ar: {
        title: "صيانة الرخام والحجر الطبيعي: دليل UNIVMAR",
        description:
          "التنظيف اليومي والمنتجات المحظورة والعزل المائي والبقع الشائعة وصيانة الرخام المصقول مقابل حجر تازة.",
        excerpt:
          "رخام مصقول أو حجر تازة على تراس: لكل سطح قواعده. يطيل هذا الدليل العملي جمال موادكم النبيلة في المغرب.",
        sections: [
          {
            heading: "المبادئ الأساسية",
            paragraphs: [
              "الرخام والحجر الطبيعي متينان لكن ليسا محصنين. العدو الأول للرخام المصقول هو الحموضة: عصير الليمون والخل وبعض المنظفات متعددة الاستخدامات أو مزيلات الجير القوية. تهاجم السطح وتترك بقعاً باهتة يصعب إصلاحها.",
              "القاعدة الذهبية: قماش ناعم وماء فاتر وصابون محايد pH 7. امسحوا الانسكابات فوراً، خاصة على أسطح العمل وأرضيات الحمام.",
            ],
          },
          {
            heading: "صيانة الرخام",
            paragraphs: [
              "في الداخل، أزل الغبار بانتظام حتى لا يخدش الرمل التلميع. استخدموا لاصقات لباد تحت الديكور الثقيل. لأرضيات رخام عالية الاستخدام، قد يلزم صيانة مهنية (تبلور أو تلميع) كل بضع سنوات حسب الاستخدام.",
              "في الحمام، جففوا المياه الراكدة وتهووا للحد من ترسب الجير. معالجة مقاومة للماء والزيوت في المصنع أو بعد التركيب تقلل نفاذ البقع.",
            ],
            bullets: [
              "ممنوع: خل وحامض وكلور على رخام مصقول",
              "موصى به: منظف محايد وقماش ميكروفايبر",
              "بقع الماء: قماش جاف + منتج لطيف للجير",
            ],
          },
          {
            heading: "صيانة حجر تازة",
            paragraphs: [
              "في الخارج، يتقادم حجر تازة طبيعياً. قد يظهر غشاء خفيف أو باتينا دون المس بالمتانة. معالجة مقاومة للماء قابلة للتنفس، تُعاد حسب توصيات الصانع (غالباً كل 3 إلى 5 سنوات)، تحمي من بقع الرطوبة والأوساخ الحضرية.",
              "نظفوا بفرشاة ناعمة وماء صافٍ. تجنبوا الغسيل بالضغط العالي قرب الفواصل التي قد تفكك الألواح. على التراس، كنسوا بانتظام لإزالة الرمل الكاشط.",
            ],
          },
          {
            heading: "البقع الشائعة وما يجب فعله",
            paragraphs: [
              "نبيذ أو قهوة على الرخام: امتصوا فوراً ونظفوا بصابون محايد. إذا نفذت البقعة، اتصلوا بمحترف للصقل الموضعي. على الحجر المسامي الخارجي، غالباً يكفي منظف لطيف وشطف وفير.",
              "عند تسليم موادكم، توضح UNIVMAR احتياطات التشطيب المختار. اطلبوا ورقة صيانة لفريق النظافة أو إدارة المرافق.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "granit-vs-marbre-plan-de-travail",
    datePublished: "2026-04-01",
    readingMinutes: 9,
    content: {
      fr: {
        title: "Granit ou marbre pour le plan de travail cuisine ?",
        description:
          "Résistance, entretien, esthétique et budget — comparatif pour choisir votre plan de travail en pierre naturelle au Maroc.",
        excerpt:
          "Le plan de travail est la zone la plus sollicitée de la cuisine. Granit ou marbre ? Voici comment trancher selon votre mode de vie et votre style.",
        sections: [
          {
            heading: "Usage réel de la cuisine",
            paragraphs: [
              "Avant de choisir une pierre pour son veinage, listez vos habitudes : cuisine quotidienne intensive, pâtisserie, enfants, plats chauds posés directement, vin rouge, citrons… Le granit, roche ignée très dure, résiste mieux aux rayures et à la chaleur ponctuelle qu'un marbre calcaire.",
              "Le marbre — notamment blanc ou clair — marque plus facilement et patine avec le temps. Certains propriétaires assument cette patine comme un signe de vie ; d'autres préfèrent la stabilité visuelle du granit.",
            ],
          },
          {
            heading: "Comparatif rapide",
            paragraphs: ["Les deux matériaux sont nobles et valorisent la cuisine. La différence se joue surtout sur la résistance mécanique et l'entretien."],
            bullets: [
              "Granit — très résistant, rayures rares, entretien simple",
              "Marbre — veinages uniques, plus sensible aux acides et aux chocs",
              "Les deux — plans sur mesure découpés à l'atelier UNIVMAR",
              "Devis — selon épaisseur 2 ou 3 cm et découpe (évier, plaque)",
            ],
          },
          {
            heading: "Esthétique et tendances au Maroc",
            paragraphs: [
              "Les cuisines marocaines haut de gamme combinent souvent un plan granit sombre (noir, gris) avec des menuiseries laquées ou en bois. Le marbre blanc type Carrare ou Volakas reste prisé pour les cuisines lumineuses style méditerranéen.",
              "Dans notre catalogue, vous trouverez granits et marbres importés ainsi que des pierres locales. Venez voir les plaques à l'atelier : le veinage varie d'un lot à l'autre, et c'est en physique que l'on valide le bon choix.",
            ],
          },
          {
            heading: "Pose et finitions de chant",
            paragraphs: [
              "Un plan de travail en pierre se commande avec le gabarit exact de la cuisine : découpes évier, robinetterie, plaque. Les chants peuvent être droits, biseautés ou arrondis. Anticipez la jonction avec la crédence — même matériau ou contraste.",
              "Contactez UNIVMAR avec les plans de votre cuisiniste ou architecte d'intérieur. Nous chiffrons le matériau, la découpe et les finitions pour un résultat durable et élégant.",
            ],
          },
        ],
      },
      en: {
        title: "Granite or marble for kitchen worktops?",
        description:
          "Resistance, maintenance, aesthetics and budget — comparison to choose your natural stone worktop in Morocco.",
        excerpt:
          "The worktop is the hardest-working zone in the kitchen. Granite or marble? Here is how to decide based on your lifestyle and style.",
        sections: [
          {
            heading: "Real kitchen use",
            paragraphs: [
              "Before choosing stone for its veining, list your habits: heavy daily cooking, baking, children, hot pans placed directly, red wine, lemons… Granite, a very hard igneous rock, resists scratches and occasional heat better than limestone marble.",
              "Marble — especially white or light — marks more easily and patinates over time. Some owners embrace that patina as a sign of life; others prefer granite's visual stability.",
            ],
          },
          {
            heading: "Quick comparison",
            paragraphs: ["Both materials are noble and add value to the kitchen. The difference is mainly mechanical resistance and maintenance."],
            bullets: [
              "Granite — very tough, rare scratches, simple care",
              "Marble — unique veining, more sensitive to acids and impacts",
              "Both — bespoke worktops cut at UNIVMAR workshop",
              "Quote — by 2 or 3 cm thickness and cut-outs (sink, hob)",
            ],
          },
          {
            heading: "Aesthetics and trends in Morocco",
            paragraphs: [
              "High-end Moroccan kitchens often pair dark granite (black, grey) with lacquered or timber joinery. White Carrara- or Volakas-type marble remains popular for bright Mediterranean-style kitchens.",
              "In our catalogue you will find imported granites and marbles as well as local stones. Visit the workshop to see slabs: veining varies by lot, and the right choice is validated in person.",
            ],
          },
          {
            heading: "Installation and edge finishes",
            paragraphs: [
              "A stone worktop is ordered to the exact kitchen template: sink, tap and hob cut-outs. Edges can be straight, bevelled or rounded. Plan the junction with the splashback — same material or contrast.",
              "Contact UNIVMAR with your kitchen designer or interior architect's plans. We price material, cutting and finishes for a durable, elegant result.",
            ],
          },
        ],
      },
      ar: {
        title: "غرانيت أم رخام لسطح المطبخ؟",
        description:
          "المقاومة والصيانة والجمالية والميزانية — مقارنة لاختيار سطح المطبخ من الحجر الطبيعي في المغرب.",
        excerpt:
          "سطح العمل هو أكثر منطقة استخداماً في المطبخ. غرانيت أم رخام؟ إليك كيفية الاختيار حسب نمط حياتكم وأسلوبكم.",
        sections: [
          {
            heading: "الاستخدام الفعلي للمطبخ",
            paragraphs: [
              "قبل اختيار الحجر لعروقه، اذكروا عاداتكم: طبخ يومي مكثف، معجنات، أطفال، أوانٍ ساخنة توضع مباشرة، نبيذ أحمر، ليمون… الغرانيت، صخر ناري صلب جداً، يقاوم الخدوش والحرارة العرضية أفضل من الرخام الجيري.",
              "الرخام — خاصة الأبيض أو الفاتح — يتأثر أسهل ويكتسب باتينا مع الوقت. بعض المالكين يعتبرونها علامة حياة؛ وآخرون يفضلون استقرار الغرانيت البصري.",
            ],
          },
          {
            heading: "مقارنة سريعة",
            paragraphs: ["كلاهما مادة نبيلة ترفع قيمة المطبخ. الفرق أساساً في المقاومة الميكانيكية والصيانة."],
            bullets: [
              "غرانيت — متين جداً، خدوش نادرة، صيانة بسيطة",
              "رخام — عروق فريدة، أكثر حساسية للأحماض والصدمات",
              "كلاهما — أسطح مخصصة تُقطع في ورشة UNIVMAR",
              "عرض السعر — حسب سماكة 2 أو 3 سم والقص (مغسلة، موقد)",
            ],
          },
          {
            heading: "الجمالية والاتجاهات في المغرب",
            paragraphs: [
              "تجمع المطابخ المغربية الفاخرة غالباً غرانيتاً داكناً (أسود، رمادي) مع نجارة ملمعة أو خشبية. يبقى الرخام الأبيض من نوع كارارا أو فولاكاس مطلوباً للمطابخ المشرقة بطراز متوسطي.",
              "في كتالوجنا ستجدون غرانيت ورخاماً مستورداً وأحجاراً محلية. زوروا الورشة لرؤية الألواح: تختلف العروق حسب الدفعة، والاختيار الصحيح يُثبت حضورياً.",
            ],
          },
          {
            heading: "التركيب وتشطيب الحواف",
            paragraphs: [
              "يُطلب سطح العمل الحجر وفق قالب المطبخ الدقيق: قص المغسلة والحنفية والموقد. يمكن أن تكون الحواف مستقيمة أو مائلة أو مستديرة. خططوا للوصلة مع البلاط الخلفي — نفس المادة أو تباين.",
              "تواصلوا مع UNIVMAR مع مخططات مصمم المطبخ أو مهندس الديكور. نُسعّر المادة والقص والتشطيبات لنتيجة متينة وأنيقة.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "marbre-maroc-guide-complet-2026",
    datePublished: "2026-05-12",
    readingMinutes: 14,
    content: {
      fr: {
        title: "Marbre Maroc : guide complet pour bien choisir en 2026",
        description:
          "Marbre Maroc — types, marbre local, marbre de Taza, importé, finitions, prix et fournisseur. Guide expert UNIVMAR Temara pour villas, hôtels et chantiers.",
        excerpt:
          "Chercher « marbre Maroc » mène souvent à des catalogues génériques. Ce guide vous aide à choisir le bon marbre, la bonne finition et le bon fournisseur — avec le regard d'un transformateur installé à Temara.",
        sections: [
          {
            heading: "Pourquoi le marbre Maroc reste incontournable",
            paragraphs: [
              "Le marbre au Maroc équipe villas, hôtels 5 étoiles, halls d'entreprise, salles de bain et plans de travail. La demande combine prestige, durabilité et identité minérale. Que vous soyez architecte, promoteur ou particulier, le marché marbre Maroc offre aujourd'hui deux grandes familles : le marbre local marocain (Taza, Khénifra, Azilal, Tiflet, Agadir…) et le marbre importé (Italie, Espagne, Grèce, Brésil…).",
              "UNIVMAR, fondée en 2004, transforme et livre ce marbre depuis Temara (Ain Atiq). Notre rôle n'est pas seulement de vendre une plaque : c'est de faire correspondre matière, finition, usage et budget pour que le rendu tienne dans le temps sous le climat marocain.",
            ],
          },
          {
            heading: "Marbre local vs marbre importé",
            paragraphs: [
              "Le marbre local — dont le marbre de Taza (Beige Taza, Gris Taza), le Volubilis, le Noir Khénifra ou le Gris Tiflet — valorise le patrimoine géologique marocain et réduit souvent les délais d'approvisionnement. Il convient parfaitement aux projets qui veulent une signature « made in Morocco ».",
              "Le marbre importé (Volakas, Crema Marfil, Arabiscato, Panda White, Noir Portoro, Gris Armani…) apporte des veinages internationaux et des ambiances plus graphiques ou lumineuses. UNIVMAR propose les deux familles dans un catalogue de plus de 80 références, pour un interlocuteur unique.",
            ],
            bullets: [
              "Marbre local — identité marocaine, bons délais, excellent rapport qualité-prix",
              "Marbre de Taza — star du local pour sols, halls et façades selon finition",
              "Marbre importé — veinages rares, projets hôteliers et luxe",
              "Granit et pierre naturelle — alternatives pour cuisine et extérieur",
            ],
          },
          {
            heading: "Finitions : poli, adouci, bouchardé, sablé",
            paragraphs: [
              "Sur le marché marbre Maroc, la finition change tout. Le poli sublime les intérieurs mais glisse à l'extérieur mouillé. L'adouci reste élégant avec moins de reflet. Le bouchardé et le sablé offrent de l'accroche pour terrasses et abords de piscine. L'éclaté structure les façades et les clôtures.",
              "Avant de commander, validez usage + exposition + passage. Une salle de bain n'a pas les mêmes contraintes qu'une plage de piscine. Notre atelier à Temara réalise ces finitions sur mesure selon vos cotes.",
            ],
          },
          {
            heading: "Comment choisir un fournisseur marbre Maroc",
            paragraphs: [
              "Un bon fournisseur de marbre au Maroc combine stock ou accès carrière, atelier de transformation, échantillons réels et devis transparent. Méfiez-vous des prix au m² affichés sans précision d'épaisseur, de finition ni de lot.",
              "Chez UNIVMAR, vous visitez l'atelier, voyez les plaques, validez la teinte et recevez un devis détaillé (matériau, quantité, finition, livraison). Nous livrons Rabat, Casablanca, Marrakech, Taza et le reste du pays. Contact : +212 660-419991 — contact@universmarbre.com.",
            ],
            bullets: [
              "Demandez un échantillon physique, pas seulement une photo",
              "Précisez surface, usage, ville et délai de chantier",
              "Comparez finition et épaisseur, pas seulement le prix m²",
              "Privilégiez un transformateur avec atelier (contrôle qualité)",
            ],
          },
          {
            heading: "FAQ marbre Maroc",
            paragraphs: [
              "Quel marbre pour un sol de villa ? Beige Taza ou marbre clair importé en poli/adouci, selon le style. Quel marbre pour la cuisine ? Souvent le granit est plus sûr ; le marbre reste possible avec entretien soigné. Combien coûte le marbre au Maroc ? Cela dépend du matériau, de la finition, de l'épaisseur et du volume — seul un devis projet a du sens.",
              "Pour aller plus loin : consultez aussi nos pages Marbre de Taza, Pierre de Taza et Marbre local marocain, ou demandez un devis gratuit sous 24 h ouvrées.",
            ],
          },
        ],
      },
      en: {
        title: "Marble Morocco: complete buying guide for 2026",
        description:
          "Marble Morocco — types, local marble, Taza marble, imports, finishes, pricing and suppliers. Expert UNIVMAR Temara guide for villas, hotels and sites.",
        excerpt:
          "Searching « marble Morocco » often leads to generic catalogues. This guide helps you pick the right marble, finish and supplier — from a fabricator based in Temara.",
        sections: [
          {
            heading: "Why marble in Morocco still leads",
            paragraphs: [
              "Marble in Morocco equips villas, five-star hotels, corporate halls, bathrooms and worktops. Demand combines prestige, durability and mineral identity. Whether you are an architect, developer or homeowner, the marble Morocco market offers two main families: local Moroccan marble (Taza, Khénifra, Azilal, Tiflet, Agadir…) and imported marble (Italy, Spain, Greece, Brazil…).",
              "UNIVMAR, founded in 2004, fabricates and delivers this marble from Temara (Ain Atiq). Our role is not only to sell a slab: it is to match material, finish, use and budget so the result lasts under Morocco's climate.",
            ],
          },
          {
            heading: "Local vs imported marble",
            paragraphs: [
              "Local marble — including Taza marble (Beige Taza, Grey Taza), Volubilis, Noir Khénifra or Gris Tiflet — values Morocco's geology and often shortens lead times. It suits projects that want a « made in Morocco » signature.",
              "Imported marble (Volakas, Crema Marfil, Arabiscato, Panda White, Noir Portoro, Gris Armani…) brings international veining and more graphic or luminous moods. UNIVMAR offers both families in a catalogue of 80+ references, with one contact.",
            ],
            bullets: [
              "Local marble — Moroccan identity, good lead times, strong value",
              "Taza marble — local star for floors, halls and façades by finish",
              "Imported marble — rare veining, hospitality and luxury projects",
              "Granite and natural stone — kitchen and outdoor alternatives",
            ],
          },
          {
            heading: "Finishes: polished, honed, bush-hammered, sandblasted",
            paragraphs: [
              "On the marble Morocco market, finish changes everything. Polished elevates interiors but slips when wet outdoors. Honed stays elegant with less glare. Bush-hammered and sandblasted add grip for terraces and pool surrounds. Split-face structures façades and boundary walls.",
              "Before ordering, confirm use + exposure + traffic. A bathroom is not a pool deck. Our Temara workshop produces these finishes to your dimensions.",
            ],
          },
          {
            heading: "How to choose a marble supplier in Morocco",
            paragraphs: [
              "A strong marble supplier in Morocco combines stock or quarry access, fabrication workshop, real samples and transparent quotes. Be wary of m² prices with no thickness, finish or lot detail.",
              "At UNIVMAR you visit the workshop, see slabs, validate shade and receive a detailed quote (material, quantity, finish, delivery). We deliver to Rabat, Casablanca, Marrakech, Taza and nationwide. Contact: +212 660-419991 — contact@universmarbre.com.",
            ],
            bullets: [
              "Ask for a physical sample, not only a photo",
              "Specify area, use, city and site schedule",
              "Compare finish and thickness, not only m² price",
              "Prefer a fabricator with a workshop (quality control)",
            ],
          },
          {
            heading: "Marble Morocco FAQ",
            paragraphs: [
              "Which marble for a villa floor? Beige Taza or light imported marble in polished/honed, depending on style. Which marble for the kitchen? Granite is often safer; marble remains possible with careful care. How much does marble cost in Morocco? It depends on material, finish, thickness and volume — only a project quote makes sense.",
              "Go further: see our Taza marble, Taza stone and local Moroccan marble pages, or request a free quote within 24 business hours.",
            ],
          },
        ],
      },
      ar: {
        title: "رخام المغرب: دليل شامل للاختيار في 2026",
        description:
          "رخام المغرب — الأنواع والرخام المحلي ورخام تازة والمستورد والتشطيبات والأسعار والمورد. دليل خبير UNIVMAR تمارة للفيلات والفنادق والمواقع.",
        excerpt:
          "البحث عن « رخام المغرب » يقود غالباً إلى كتالوجات عامة. يساعدكم هذا الدليل على اختيار الرخام والتشطيب والمورد المناسب — من منظور محوّل في تمارة.",
        sections: [
          {
            heading: "لماذا يبقى رخام المغرب أساسياً",
            paragraphs: [
              "يجهّز الرخام في المغرب الفيلات والفنادق الفاخرة وقاعات الشركات والحمامات وأسطح العمل. يجمع الطلب بين الفخامة والمتانة والهوية المعدنية. سواء كنتم مهندسين أو مطورين أو أفراداً، يقدّم سوق رخام المغرب عائلتين كبيرتين: الرخام المحلي المغربي (تازة، خنيفرة، أزيلال، تيفلت، أكادير…) والرخام المستورد (إيطاليا، إسبانيا، اليونان، البرازيل…).",
              "UNIVMAR، تأسست عام 2004، تحوّل وتوصل هذا الرخام من تمارة (عين عتيق). دورنا ليس بيع لوح فقط: بل مطابقة المادة والتشطيب والاستخدام والميزانية لتدوم النتيجة في مناخ المغرب.",
            ],
          },
          {
            heading: "رخام محلي مقابل رخام مستورد",
            paragraphs: [
              "الرخام المحلي — بما فيه رخام تازة (بيجي تازة، رمادي تازة) وفولوبوليس وأسود خنيفرة ورمادي تيفلت — يثمّن الجيولوجيا المغربية وغالباً يقلّل آجال التوريد. يناسب المشاريع التي تريد توقيع « صنع في المغرب ».",
              "الرخام المستورد (فولاكاس، كريما مارفل، أرابيسكاتو، باندا وايت، أسود بورتورو، رمادي أرماني…) يجلب عروقاً دولية وأجواء أكثر رسماً أو إشراقاً. تقدم UNIVMAR العائلتين في كتالوج يضم أكثر من 80 مرجعاً، بمحاور واحد.",
            ],
            bullets: [
              "رخام محلي — هوية مغربية، آجال جيدة، قيمة ممتازة",
              "رخام تازة — نجم المحلي للأرضيات والقاعات والواجهات حسب التشطيب",
              "رخام مستورد — عروق نادرة، مشاريع فندقية وفاخرة",
              "غرانيت وحجر طبيعي — بدائل للمطبخ والخارج",
            ],
          },
          {
            heading: "التشطيبات: مصقول، ملسّن، مبوشارد، رملي",
            paragraphs: [
              "في سوق رخام المغرب، يغيّر التشطيب كل شيء. المصقول يرفع الداخل لكنه ينزلق في الخارج المبلل. الملسن يبقى أنيقاً بانعكاس أقل. المبوشارد والرملي يمنحان تماسكاً للتراسات وحواف المسبح. المتشقق يبني الواجهات والأسوار.",
              "قبل الطلب، أكدوا الاستخدام والتعرض والمرور. الحمام ليس سطح مسبح. تنجز ورشتنا بتمارة هذه التشطيبات حسب مقاساتكم.",
            ],
          },
          {
            heading: "كيف تختارون مورد رخام في المغرب",
            paragraphs: [
              "يجمع المورد الجيد مخزوناً أو وصولاً للمحجر وورشة تحويل وعينات حقيقية وعرض سعر شفاف. احذروا أسعار المتر المربع بلا سماكة ولا تشطيب ولا دفعة.",
              "في UNIVMAR تزورون الورشة وترون الألواح وتثبتون اللون وتتلقون عرضاً مفصلاً (مادة، كمية، تشطيب، توصيل). نوصل الرباط والدار البيضاء ومراكش وتازة وباقي البلاد. الاتصال: +212 660-419991 — contact@universmarbre.com.",
            ],
            bullets: [
              "اطلبوا عينة فعلية وليس صورة فقط",
              "حددوا المساحة والاستخدام والمدينة وجدول الموقع",
              "قارنوا التشطيب والسماكة وليس السعر فقط",
              "فضّلوا محوّلاً بورشة (مراقبة الجودة)",
            ],
          },
          {
            heading: "أسئلة شائعة حول رخام المغرب",
            paragraphs: [
              "أي رخام لأرضية فيلا؟ بيجي تازة أو رخام فاتح مستورد مصقول/ملسن حسب الأسلوب. أي رخام للمطبخ؟ الغرانيت غالباً أأمن؛ الرخام ممكن مع صيانة دقيقة. كم يكلف الرخام في المغرب؟ يعتمد على المادة والتشطيب والسماكة والحجم — عرض السعر للمشروع فقط له معنى.",
              "للمزيد: راجعوا صفحات رخام تازة وحجر تازة والرخام المحلي، أو اطلبوا عرض سعر مجاني خلال 24 ساعة عمل.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "marbre-de-taza-guide",
    datePublished: "2026-05-20",
    dateModified: "2026-08-10",
    readingMinutes: 12,
    content: {
      fr: {
        title: "Marbre de Taza : guide du marbre local marocain de référence",
        description:
          "Marbre de Taza — origine, Beige Taza, Gris Taza, finitions, usages sols et salles de bain, devis. Tout savoir sur le marbre de Taza avec UNIVMAR.",
        excerpt:
          "Le marbre de Taza est l'un des marbres locaux les plus recherchés au Maroc. Voici comment le choisir, le poser et l'entretenir — du hall de villa à la salle de bain.",
        sections: [
          {
            heading: "Origine du marbre de Taza",
            paragraphs: [
              "Le marbre de Taza provient des formations calcaires de la région de Taza, au nord-est du Maroc, notamment autour d'Oued Amlil. Extraite puis sciée et finie, cette pierre offre des teintes beige chaud à gris perle, parfois ponctuées de fossilisations discrètes. C'est un pilier du patrimoine minéral marocain, utilisé dans l'architecture contemporaine comme dans les rénovations de prestige.",
              "Sur les moteurs de recherche, « marbre de Taza » désigne souvent les dalles polies ou adoucies destinées à l'intérieur, tandis que « pierre de Taza » renvoie plutôt aux finitions façade et extérieur. Chez UNIVMAR, nous traitons les deux : même origine, finitions adaptées à chaque usage.",
            ],
          },
          {
            heading: "Beige Taza et Gris Taza",
            paragraphs: [
              "Le Beige Taza est le plus demandé pour les intérieurs lumineux : sols de salon, halls, escaliers, salles de bain. Il dialogue avec le bois clair, le laiton et les enduits minéraux. Le Gris Taza structure les espaces modernes, les bureaux et les hall d'hôtels qui veulent un rendu plus graphique.",
              "La variation naturelle d'un lot à l'autre fait partie du charme du marbre de Taza. Nous sélectionnons les plaques pour garantir une harmonie visuelle sur votre surface, et vous invitons à valider un échantillon à l'atelier de Temara.",
            ],
            bullets: [
              "Beige Taza poli — sols et halls chaleureux",
              "Gris Taza — contemporain, contrastes forts",
              "Adouci — élégance mate, moins de reflets",
              "Bouchardé / éclaté — bascule vers usage extérieur (pierre de Taza)",
            ],
          },
          {
            heading: "Où utiliser le marbre de Taza ?",
            paragraphs: [
              "En intérieur : sols, murs d'accent, escaliers, salles de bain, plinthes, plans vasques. En semi-extérieur abrité : entrées, loggias. Pour les terrasses exposées et les piscines, orientez-vous vers une finition antidérapante (bouchardée, sablée, vieillie) — c'est le domaine de la pierre de Taza.",
              "Les promoteurs et architectes marocains apprécient le marbre de Taza pour les programmes résidentiels haut standing à Rabat, Casablanca et Marrakech : rendu premium, approvisionnement local, image « marbre Maroc » authentique.",
            ],
          },
          {
            heading: "Entretien et précautions",
            paragraphs: [
              "Comme tout calcaire, le marbre de Taza craint les acides (citron, vinaigre, certains détartrants). Nettoyez au savon neutre et à l'eau tiède. Un hydrofuge adapté réduit les taches d'eau et d'huile, surtout en salle de bain.",
              "UNIVMAR fournit des conseils d'entretien avec chaque livraison. Pour une rénovation de sol existant (ré-polissage), contactez un poseur ou un professionnel de la cristallisation.",
            ],
          },
          {
            heading: "Devis marbre de Taza avec UNIVMAR",
            paragraphs: [
              "Le prix du marbre de Taza au m² dépend de la finition, de l'épaisseur (2 ou 3 cm en général), du volume et de la découpe. Il n'existe pas de tarif unique fiable en ligne. Envoyez-nous surfaces, plans ou photos et ville de chantier : devis gratuit sous 24 h ouvrées.",
              "Atelier : Ouled Slama, Ain Atiq, Temara. Téléphone / WhatsApp : +212 660-419991. E-mail : contact@universmarbre.com. Nous livrons partout au Maroc.",
            ],
          },
        ],
      },
      en: {
        title: "Taza marble: guide to Morocco's flagship local marble",
        description:
          "Taza marble — origin, Beige Taza, Grey Taza, finishes, floors and bathrooms, quotes. Everything about Taza marble with UNIVMAR.",
        excerpt:
          "Taza marble is one of the most sought-after local marbles in Morocco. Here is how to choose, install and care for it — from villa hall to bathroom.",
        sections: [
          {
            heading: "Origin of Taza marble",
            paragraphs: [
              "Taza marble comes from limestone formations in the Taza region of north-eastern Morocco, especially around Oued Amlil. Once quarried, sawn and finished, the stone offers warm beige to pearl-grey tones, sometimes with subtle fossils. It is a pillar of Morocco's mineral heritage, used in contemporary architecture and prestige renovations.",
              "In search terms, « Taza marble » often means polished or honed slabs for interiors, while « Taza stone » points to façade and outdoor finishes. At UNIVMAR we handle both: same origin, finishes matched to each use.",
            ],
          },
          {
            heading: "Beige Taza and Grey Taza",
            paragraphs: [
              "Beige Taza is the most requested for bright interiors: living-room floors, halls, stairs, bathrooms. It pairs with light wood, brass and mineral plasters. Grey Taza structures modern spaces, offices and hotel lobbies that want a more graphic look.",
              "Natural variation from lot to lot is part of Taza marble's character. We select slabs for visual harmony on your area and invite you to validate a sample at the Temara workshop.",
            ],
            bullets: [
              "Polished Beige Taza — warm floors and halls",
              "Grey Taza — contemporary, strong contrast",
              "Honed — matte elegance, less glare",
              "Bush-hammered / split — outdoor use (Taza stone)",
            ],
          },
          {
            heading: "Where to use Taza marble",
            paragraphs: [
              "Indoors: floors, accent walls, stairs, bathrooms, skirting, vanity tops. Semi-outdoors: entrances, loggias. For exposed terraces and pools, choose a slip-resistant finish (bush-hammered, sandblasted, aged) — that is Taza stone territory.",
              "Moroccan developers and architects value Taza marble for high-end residential schemes in Rabat, Casablanca and Marrakech: premium look, local supply, authentic « marble Morocco » image.",
            ],
          },
          {
            heading: "Care and precautions",
            paragraphs: [
              "Like any limestone, Taza marble dislikes acids (lemon, vinegar, some descalers). Clean with neutral soap and lukewarm water. Suitable hydrophobic treatment reduces water and oil stains, especially in bathrooms.",
              "UNIVMAR provides care advice with every delivery. For restoring an existing floor (re-polishing), contact a tiler or crystallisation professional.",
            ],
          },
          {
            heading: "Taza marble quote with UNIVMAR",
            paragraphs: [
              "Taza marble price per m² depends on finish, thickness (usually 2 or 3 cm), volume and cutting. There is no single reliable online tariff. Send us areas, plans or photos and site city: free quote within 24 business hours.",
              "Workshop: Ouled Slama, Ain Atiq, Temara. Phone / WhatsApp: +212 660-419991. Email: contact@universmarbre.com. We deliver nationwide in Morocco.",
            ],
          },
        ],
      },
      ar: {
        title: "رخام تازة: دليل الرخام المحلي المغربي المرجعي",
        description:
          "رخام تازة — المنشأ وبيجي تازة ورمادي تازة والتشطيبات والاستخدامات وعروض الأسعار. كل ما يلزم معرفته مع UNIVMAR.",
        excerpt:
          "رخام تازة من أكثر الرخام المحلي طلباً في المغرب. إليكم كيفية اختياره وتركيبه وصيانته — من ردهة الفيلا إلى الحمام.",
        sections: [
          {
            heading: "منشأ رخام تازة",
            paragraphs: [
              "يأتي رخام تازة من التكوينات الجيرية لمنطقة تازة شمال شرق المغرب، خاصة حول وادي أمليل. بعد الاستخراج والقص والتشطيب، يقدم الحجر درجات بيجي دافئ إلى رمادي لؤلؤي، أحياناً مع مستحاثات خفيفة. إنه ركيزة من التراث المعدني المغربي، يُستخدم في العمارة المعاصرة وتجديدات الفخامة.",
              "في البحث، غالباً يعني « رخام تازة » الألواح المصقولة أو الملسنة للداخل، بينما « حجر تازة » يشير إلى تشطيبات الواجهة والخارج. في UNIVMAR نعالج الاثنين: نفس المنشأ، تشطيبات لكل استخدام.",
            ],
          },
          {
            heading: "بيجي تازة ورمادي تازة",
            paragraphs: [
              "بيجي تازة الأكثر طلباً للداخل المشرق: أرضيات صالون وقاعات ودرجات وحمامات. ينسجم مع الخشب الفاتح والنحاس والطلاء المعدني. رمادي تازة يبني المساحات الحديثة والمكاتب وردهات الفنادق ذات المظهر الأكثر رسماً.",
              "التباين الطبيعي بين الدفعات جزء من سحر رخام تازة. نختار الألواح لتناغم بصري على مساحتكم وندعوكم لتثبيت عينة في ورشة تمارة.",
            ],
            bullets: [
              "بيجي تازة مصقول — أرضيات وقاعات دافئة",
              "رمادي تازة — معاصر وتباين قوي",
              "ملسّن — أناقة مطفية وانعكاس أقل",
              "مبوشارد / متشقق — استخدام خارجي (حجر تازة)",
            ],
          },
          {
            heading: "أين يُستخدم رخام تازة؟",
            paragraphs: [
              "في الداخل: أرضيات وجدران بارزة ودرجات وحمامات وقواعد وأسطح مغاسل. في شبه الخارج: مداخل ولوجيا. للتراسات المعرضة والمسابح اختاروا تشطيباً مانعاً للانزلاق — ذلك مجال حجر تازة.",
              "يقدّر المطورون والمهندسون المغاربة رخام تازة للبرامج السكنية الراقية في الرباط والدار البيضاء ومراكش: مظهر فاخر وتوريد محلي وصورة « رخام المغرب » الأصيلة.",
            ],
          },
          {
            heading: "الصيانة والاحتياطات",
            paragraphs: [
              "مثل أي حجر جيري، يكره رخام تازة الأحماض (ليمون، خل، بعض مزيلات الجير). نظفوا بصابون محايد وماء فاتر. معالجة مقاومة للماء تقلل بقع الماء والزيت خاصة في الحمام.",
              "تقدم UNIVMAR نصائح صيانة مع كل تسليم. لترميم أرضية قائمة (إعادة تلميع)، اتصلوا بمركّب أو محترف تبلور.",
            ],
          },
          {
            heading: "عرض سعر رخام تازة مع UNIVMAR",
            paragraphs: [
              "سعر متر رخام تازة يعتمد على التشطيب والسماكة (غالباً 2 أو 3 سم) والحجم والقص. لا يوجد تعريفة موحدة موثوقة على الإنترنت. أرسلوا المساحات والمخططات أو الصور ومدينة الموقع: عرض مجاني خلال 24 ساعة عمل.",
              "الورشة: أولاد سلامة، عين عتيق، تمارة. الهاتف / واتساب: +212 660-419991. البريد: contact@universmarbre.com. نوصل في كل المغرب.",
            ],
          },
        ],
      },
    },
    relatedLinks: {
      fr: [
        { label: "Marbre de Taza : matière, finitions et devis", href: "/marbre-de-taza" },
        { label: "Pierre de Taza : usage extérieur et devis", href: "/pierre-de-taza" },
        { label: "Comparer marbre et pierre de Taza", href: "/blog/marbre-de-taza-vs-pierre-de-taza" },
      ],
      ar: [
        { label: "رخام تازة: الأنواع والتشطيبات وعرض السعر", href: "/marbre-de-taza" },
        { label: "حجر تازة: الاستخدامات الخارجية وعرض السعر", href: "/pierre-de-taza" },
        { label: "مقارنة رخام تازة وحجر تازة", href: "/blog/marbre-de-taza-vs-pierre-de-taza" },
      ],
      en: [
        { label: "Taza marble: finishes and quotation", href: "/marbre-de-taza" },
        { label: "Taza stone: outdoor use and quotation", href: "/pierre-de-taza" },
      ],
    },
  },
  {
    slug: "ou-acheter-pierre-de-taza-maroc",
    datePublished: "2026-06-05",
    readingMinutes: 11,
    content: {
      fr: {
        title: "Où acheter de la pierre de Taza au Maroc ?",
        description:
          "Où acheter pierre de Taza au Maroc : carrières, transformateurs, finitions, pièges à éviter et pourquoi passer par UNIVMAR Temara pour un devis fiable.",
        excerpt:
          "Beige Taza, Gris Taza, façade ou terrasse : la pierre de Taza se trouve chez des carrières et transformateurs. Voici comment acheter au bon endroit, au bon prix qualité.",
        sections: [
          {
            heading: "Pierre de Taza : ce qu'il faut savoir avant d'acheter",
            paragraphs: [
              "La pierre de Taza est un calcaire marocain très demandé pour les façades, terrasses, piscines et murs. Avant d'acheter, fixez l'usage (extérieur exposé ou intérieur), la finition (éclatée, bouchardée, sablée, vieillie, polie) et la surface approximative. Sans ces trois éléments, aucun devis pierre de Taza n'est comparable.",
              "Le prix affiché « au m² » sur les réseaux sociaux ignore souvent l'épaisseur, les chutes, le calepinage et la livraison. Un transformateur sérieux chiffre le projet, pas un slogan.",
            ],
          },
          {
            heading: "Carrière, revendeur ou atelier de transformation ?",
            paragraphs: [
              "Acheter directement en carrière peut sembler économique, mais sans atelier vous devez gérer le sciage, la finition et le contrôle des lots. Les revendeurs multiplient parfois les intermédiaires. L'atelier de transformation — comme UNIVMAR à Temara — centralise sélection, finition, découpe sur mesure et livraison.",
              "Pour un chantier à Rabat, Casablanca ou Marrakech, la proximité d'un atelier facilite les retours de découpe, les retouches et la validation visuelle des plaques avant pose.",
            ],
            bullets: [
              "Carrière — matière brute, logistique à organiser",
              "Revendeur — stock limité, finitions variables",
              "Atelier transformateur — finition contrôlée + sur mesure",
              "UNIVMAR — Beige Taza, Gris Taza, éclatés, devis 24 h",
            ],
          },
          {
            heading: "Comment vérifier la qualité de la pierre de Taza",
            paragraphs: [
              "Exigez un échantillon réel de la même finition que la commande. Vérifiez l'homogénéité du ton, l'absence de fissures critiques et la régularité d'épaisseur. Pour une façade, regardez le relief de l'éclaté ou du bouchardé sous lumière naturelle.",
              "Visitez l'atelier si possible : voir les lots en physique évite les mauvaises surprises par rapport à une photo filtrée. UNIVMAR accueille architectes et particuliers à Ain Atiq, Temara.",
            ],
          },
          {
            heading: "Livraison pierre de Taza au Maroc",
            paragraphs: [
              "Nous livrons la pierre de Taza à Temara, Rabat, Salé, Casablanca, Marrakech, Taza et dans les autres régions selon volume et accès chantier. Le devis intègre ou détaille la logistique pour éviter les coûts cachés le jour J.",
              "Anticipez le stockage sur site : support plat, protection contre les chocs et la boue, ordre de pose cohérent avec le calepinage.",
            ],
          },
          {
            heading: "Passer commande chez UNIVMAR",
            paragraphs: [
              "Envoyez plans, surfaces, finition souhaitée (ou photos d'inspiration) et adresse du chantier. Nous proposons Beige Taza, Gris Taza, éclatés et finitions associées, avec alternatives si le budget l'exige. Téléphone / WhatsApp : +212 660-419991 — e-mail : contact@universmarbre.com.",
              "Vous cherchez aussi du marbre de Taza pour l'intérieur ou du marbre importé ? Un seul interlocuteur pour tout le projet pierre et marbre Maroc.",
            ],
          },
        ],
      },
      en: {
        title: "Where to buy Taza stone in Morocco?",
        description:
          "Where to buy Taza stone in Morocco: quarries, fabricators, finishes, pitfalls to avoid and why use UNIVMAR Temara for a reliable quote.",
        excerpt:
          "Beige Taza, Grey Taza, façade or terrace: Taza stone is sold by quarries and fabricators. Here is how to buy in the right place at the right quality-price.",
        sections: [
          {
            heading: "Taza stone: what to know before buying",
            paragraphs: [
              "Taza stone is Moroccan limestone in high demand for façades, terraces, pools and walls. Before buying, fix the use (exposed exterior or interior), finish (split, bush-hammered, sandblasted, aged, polished) and approximate area. Without these three, no Taza stone quote is comparable.",
              "Social-media « per m² » prices often ignore thickness, waste, layout and delivery. A serious fabricator prices the project, not a slogan.",
            ],
          },
          {
            heading: "Quarry, reseller or fabrication workshop?",
            paragraphs: [
              "Buying at the quarry can seem cheap, but without a workshop you must handle sawing, finishing and lot control. Resellers sometimes add middlemen. A fabrication workshop — like UNIVMAR in Temara — centralises selection, finishing, bespoke cutting and delivery.",
              "For a site in Rabat, Casablanca or Marrakech, a nearby workshop makes cut returns, touch-ups and visual slab validation easier before installation.",
            ],
            bullets: [
              "Quarry — raw material, logistics to organise",
              "Reseller — limited stock, variable finishes",
              "Fabrication workshop — controlled finish + custom work",
              "UNIVMAR — Beige Taza, Grey Taza, split-face, 24 h quotes",
            ],
          },
          {
            heading: "How to check Taza stone quality",
            paragraphs: [
              "Require a real sample in the same finish as the order. Check tone consistency, absence of critical cracks and thickness regularity. For a façade, view split or bush-hammered relief in natural light.",
              "Visit the workshop if you can: seeing lots in person avoids surprises versus filtered photos. UNIVMAR welcomes architects and homeowners in Ain Atiq, Temara.",
            ],
          },
          {
            heading: "Taza stone delivery in Morocco",
            paragraphs: [
              "We deliver Taza stone to Temara, Rabat, Salé, Casablanca, Marrakech, Taza and other regions by volume and site access. The quote includes or details logistics to avoid hidden costs on the day.",
              "Plan on-site storage: flat support, protection from impacts and mud, installation order aligned with the layout plan.",
            ],
          },
          {
            heading: "Order with UNIVMAR",
            paragraphs: [
              "Send plans, areas, desired finish (or inspiration photos) and site address. We offer Beige Taza, Grey Taza, split-face and related finishes, with alternatives if budget requires. Phone / WhatsApp: +212 660-419991 — email: contact@universmarbre.com.",
              "Also need Taza marble for interiors or imported marble? One contact for the full stone and marble Morocco project.",
            ],
          },
        ],
      },
      ar: {
        title: "أين تشتري حجر تازة في المغرب؟",
        description:
          "أين تشتري حجر تازة في المغرب: المحاجر والمحوّلون والتشطيبات والمزالق ولماذا UNIVMAR تمارة لعرض سعر موثوق.",
        excerpt:
          "بيجي تازة ورمادي تازة وواجهة أو تراس: يُباع حجر تازة لدى المحاجر والمحوّلين. إليكم كيف تشترون من المكان الصحيح بالجودة والسعر المناسبين.",
        sections: [
          {
            heading: "حجر تازة: ما يجب معرفته قبل الشراء",
            paragraphs: [
              "حجر تازة حجر جيري مغربي مطلوب بشدة للواجهات والتراسات والمسابح والجدران. قبل الشراء، حددوا الاستخدام (خارج معرّض أو داخل) والتشطيب (متشقق، مبوشارد، رملي، معتّق، مصقول) والمساحة التقريبية. بدون هذه الثلاثة لا يُقارن أي عرض سعر لحجر تازة.",
              "أسعار « المتر المربع » على الشبكات غالباً تتجاهل السماكة والفضلات والتخطيط والتوصيل. المحوّل الجاد يسعّر المشروع لا شعاراً.",
            ],
          },
          {
            heading: "محجر أم بائع أم ورشة تحويل؟",
            paragraphs: [
              "الشراء من المحجر قد يبدو اقتصادياً، لكن بلا ورشة يجب تدبير القص والتشطيب ومراقبة الدفعات. الباعة يضيفون أحياناً وسطاء. ورشة التحويل — مثل UNIVMAR بتمارة — تمركز الاختيار والتشطيب والقص المخصص والتوصيل.",
              "لموقع في الرباط أو الدار البيضاء أو مراكش، قرب الورشة يسهّل إرجاع القص واللمسات وتثبيت الألواح بصرياً قبل التركيب.",
            ],
            bullets: [
              "محجر — مادة خام ولوجستيك للتنظيم",
              "بائع — مخزون محدود وتشطيبات متغيرة",
              "ورشة تحويل — تشطيب مضبوط + تفصيل",
              "UNIVMAR — بيجي تازة ورمادي تازة ومتشقق وعرض 24 ساعة",
            ],
          },
          {
            heading: "كيف تتحققون من جودة حجر تازة",
            paragraphs: [
              "اطلبوا عينة حقيقية بنفس تشطيب الطلب. تحققوا من تجانس اللون وغياب الشقوق الحرجة وانتظام السماكة. للواجهة، انظروا بروز المتشقق أو المبوشارد تحت ضوء طبيعي.",
              "زوروا الورشة إن أمكن: رؤية الدفعات حضورياً تتجنب مفاجآت الصور المعدّلة. تستقبل UNIVMAR المهندسين والأفراد في عين عتيق، تمارة.",
            ],
          },
          {
            heading: "توصيل حجر تازة في المغرب",
            paragraphs: [
              "نوصل حجر تازة إلى تمارة والرباط وسلا والدار البيضاء ومراكش وتازة ومناطق أخرى حسب الحجم ووصول الموقع. يشمل العرض أو يفصّل اللوجستيك لتجنب تكاليف خفية يوم التسليم.",
              "خططوا للتخزين في الموقع: دعم مستوٍ وحماية من الصدمات والطين وترتيب تركيب متوافق مع المخطط.",
            ],
          },
          {
            heading: "الطلب من UNIVMAR",
            paragraphs: [
              "أرسلوا المخططات والمساحات والتشطيب المطلوب (أو صور إلهام) وعنوان الموقع. نقدم بيجي تازة ورمادي تازة ومتشقق والتشطيبات المرتبطة، مع بدائل إن لزم. الهاتف / واتساب: +212 660-419991 — البريد: contact@universmarbre.com.",
              "تحتاجون أيضاً رخام تازة للداخل أو رخاماً مستورداً؟ محاور واحد لكل مشروع الحجر والرخام في المغرب.",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "marbre-de-taza-vs-pierre-de-taza",
    datePublished: "2026-06-18",
    dateModified: "2026-08-10",
    readingMinutes: 10,
    content: {
      fr: {
        title: "Marbre de Taza ou pierre de Taza : quelles différences ?",
        description:
          "Marbre de Taza vs pierre de Taza : même origine, usages et finitions différents. Guide clair pour choisir au Maroc avec UNIVMAR.",
        excerpt:
          "Même région, deux expressions courantes. Voici comment distinguer marbre de Taza et pierre de Taza pour ne pas se tromper de finition ni de devis.",
        sections: [
          {
            heading: "Même origine géologique",
            paragraphs: [
              "Marbre de Taza et pierre de Taza désignent des calcaires extraits dans la région de Taza. La confusion est normale : commerçants, architectes et particuliers utilisent parfois les deux termes pour la même plaque. La différence utile se joue surtout sur la finition et l'usage, pas sur une « autre roche » mystérieuse.",
              "UNIVMAR clarifie dès le premier échange : intérieur poli / adouci → on parle volontiers de marbre de Taza ; extérieur texturé → pierre de Taza façade ou terrasse.",
            ],
          },
          {
            heading: "Tableau de décision rapide",
            paragraphs: [
              "Utilisez ce repère pour orienter votre choix avant devis. Si votre projet combine hall intérieur et terrasse, vous aurez souvent les deux finitions du même univers Taza — continuité de teinte, comportements différents.",
            ],
            bullets: [
              "Sol salon / hall / salle de bain → marbre de Taza poli ou adouci",
              "Façade / clôture → pierre de Taza éclatée ou brute",
              "Terrasse / piscine → pierre de Taza bouchardée, sablée ou vieillie",
              "Escalier intérieur → marbre de Taza ; marche extérieure → pierre texturée",
              "Budget grandes surfaces extérieures → souvent pierre de Taza compétitive",
            ],
          },
          {
            heading: "Beige Taza et Gris Taza dans les deux cas",
            paragraphs: [
              "Que l'on dise marbre ou pierre, les coloris phares restent Beige Taza et Gris Taza. Le beige réchauffe les villas et les façades claires ; le gris affirme un langage contemporain. La finition change la lecture de la lumière : le poli reflète, le bouchardé absorbe et accroche le pied.",
              "Demandez toujours un échantillon de la finition finale. Un Beige Taza poli n'a pas le même rendu qu'un éclaté beige sur mur de clôture.",
            ],
          },
          {
            heading: "Impact sur le devis et la pose",
            paragraphs: [
              "Le devis marbre de Taza et le devis pierre de Taza ne se comparent pas au même m² « nu ». Temps machine (poli vs bouchardé), épaisseur, format et système de pose (colle, mortier, façade ventilée) modifient le coût total. Indiquez usage + finition + surface pour un chiffrage honnête.",
              "La pose suit des règles différentes : joints, pente, drainage en extérieur ; protection pendant chantier en intérieur. UNIVMAR conseille le matériau ; le poseur qualifié assure la mise en œuvre.",
            ],
          },
          {
            heading: "UNIVMAR pour les deux",
            paragraphs: [
              "Vous n'avez pas à choisir entre deux fournisseurs. UNIVMAR fournit marbre de Taza, pierre de Taza, marbre importé et granit depuis Temara, avec livraison nationale. Consultez aussi nos pages Marbre de Taza, Pierre de Taza et Marbre Maroc, ou le guide d'achat marbre Maroc 2026 sur le blog.",
              "Devis gratuit : +212 660-419991 — contact@universmarbre.com. Réponse sous 24 heures ouvrées.",
            ],
          },
        ],
      },
      en: {
        title: "Taza marble or Taza stone: what is the difference?",
        description:
          "Taza marble vs Taza stone: same origin, different uses and finishes. Clear guide to choose in Morocco with UNIVMAR.",
        excerpt:
          "Same region, two common phrases. Here is how to tell Taza marble from Taza stone so you pick the right finish and quote.",
        sections: [
          {
            heading: "Same geological origin",
            paragraphs: [
              "Taza marble and Taza stone both refer to limestone quarried in the Taza region. Confusion is normal: traders, architects and homeowners sometimes use both terms for the same slab. The useful difference is finish and use, not a mysterious « other rock ».",
              "UNIVMAR clarifies from the first call: polished / honed interior → we gladly say Taza marble; textured exterior → Taza stone for façade or terrace.",
            ],
          },
          {
            heading: "Quick decision guide",
            paragraphs: [
              "Use this checklist before requesting a quote. If your project combines an interior hall and a terrace, you will often need both finishes from the same Taza family — colour continuity, different behaviour.",
            ],
            bullets: [
              "Living-room / hall / bathroom floor → polished or honed Taza marble",
              "Façade / boundary wall → split or raw Taza stone",
              "Terrace / pool → bush-hammered, sandblasted or aged Taza stone",
              "Indoor stair → Taza marble; outdoor step → textured stone",
              "Large outdoor areas budget → Taza stone often competitive",
            ],
          },
          {
            heading: "Beige Taza and Grey Taza in both cases",
            paragraphs: [
              "Whether you say marble or stone, the flagship colours remain Beige Taza and Grey Taza. Beige warms villas and light façades; grey asserts a contemporary language. Finish changes how light reads: polish reflects; bush-hammer absorbs and grips the foot.",
              "Always request a sample of the final finish. Polished Beige Taza does not look like beige split-face on a boundary wall.",
            ],
          },
          {
            heading: "Impact on quote and installation",
            paragraphs: [
              "A Taza marble quote and a Taza stone quote are not the same bare m². Machine time (polish vs bush-hammer), thickness, format and fixing system (adhesive, mortar, ventilated façade) change total cost. State use + finish + area for an honest price.",
              "Installation follows different rules: joints, slope and drainage outdoors; site protection indoors. UNIVMAR advises on material; a qualified installer handles the work.",
            ],
          },
          {
            heading: "UNIVMAR for both",
            paragraphs: [
              "You do not need two suppliers. UNIVMAR supplies Taza marble, Taza stone, imported marble and granite from Temara, with nationwide delivery. Also see our Taza marble, Taza stone and Marble Morocco pages, or the 2026 marble Morocco buying guide on the blog.",
              "Free quote: +212 660-419991 — contact@universmarbre.com. Reply within 24 business hours.",
            ],
          },
        ],
      },
      ar: {
        title: "رخام تازة أم حجر تازة: ما الفرق؟",
        description:
          "رخام تازة مقابل حجر تازة: نفس المنشأ واستخدامات وتشطيبات مختلفة. دليل واضح للاختيار في المغرب مع UNIVMAR.",
        excerpt:
          "نفس المنطقة وتعبيران شائعان. إليكم كيف تميّزون رخام تازة عن حجر تازة حتى لا تخطئوا التشطيب ولا عرض السعر.",
        sections: [
          {
            heading: "نفس المنشأ الجيولوجي",
            paragraphs: [
              "رخام تازة وحجر تازة يشيران إلى أحجار جيرية مستخرجة في منطقة تازة. الخلط طبيعي: التجار والمهندسون والأفراد يستخدمون أحياناً التعبيرين لنفس اللوح. الفرق المفيد هو التشطيب والاستخدام وليس « صخراً آخر » غامضاً.",
              "توضح UNIVMAR من أول اتصال: داخل مصقول / ملسّن → نقول رخام تازة؛ خارج بملمس → حجر تازة للواجهة أو التراس.",
            ],
          },
          {
            heading: "دليل قرار سريع",
            paragraphs: [
              "استخدموا هذا المرجع قبل عرض السعر. إذا جمع مشروعكم ردهة داخلية وتراساً، ستحتاجون غالباً التشطيبين من عائلة تازة نفسها — استمرارية لون وسلوك مختلف.",
            ],
            bullets: [
              "أرضية صالون / ردهة / حمام → رخام تازة مصقول أو ملسّن",
              "واجهة / سور → حجر تازة متشقق أو خام",
              "تراس / مسبح → حجر تازة مبوشارد أو رملي أو معتّق",
              "درج داخلي → رخام تازة؛ درجة خارجية → حجر بملمس",
              "ميزانية مساحات خارجية كبيرة → حجر تازة غالباً تنافسي",
            ],
          },
          {
            heading: "بيجي تازة ورمادي تازة في الحالتين",
            paragraphs: [
              "سواء قلتم رخام أو حجر، تبقى الألوان الرائدة بيجي تازة ورمادي تازة. البيجي يدفئ الفيلات والواجهات الفاتحة؛ الرمادي يؤكد لغة معاصرة. التشطيب يغيّر قراءة الضوء: المصقول يعكس؛ المبوشارد يمتص ويمسك القدم.",
              "اطلبوا دائماً عينة التشطيب النهائي. بيجي تازة مصقول لا يشبه المتشقق البيجي على سور.",
            ],
          },
          {
            heading: "الأثر على العرض والتركيب",
            paragraphs: [
              "عرض رخام تازة وعرض حجر تازة ليسا نفس المتر « العاري ». وقت الآلة (تلميع مقابل مبوشارد) والسماكة والشكل ونظام التركيب (لصق، مونة، واجهة مهواة) تغيّر التكلفة الكلية. اذكروا الاستخدام + التشطيب + المساحة لتسعير صادق.",
              "التركيب يتبع قواعد مختلفة: فواصل وميل وصرف في الخارج؛ حماية أثناء الأشغال في الداخل. تنصح UNIVMAR بالمادة؛ المركّب المؤهل ينفذ.",
            ],
          },
          {
            heading: "UNIVMAR للاثنين",
            paragraphs: [
              "لستم بحاجة لموردين. توفر UNIVMAR رخام تازة وحجر تازة ورخاماً مستورداً وغرانيتاً من تمارة مع توصيل وطني. راجعوا أيضاً صفحات رخام تازة وحجر تازة ورخام المغرب، أو دليل شراء رخام المغرب 2026 في المدونة.",
              "عرض مجاني: +212 660-419991 — contact@universmarbre.com. رد خلال 24 ساعة عمل.",
            ],
          },
        ],
      },
    },
    relatedLinks: {
      fr: [
        { label: "Marbre de Taza : matière, finitions et devis", href: "/marbre-de-taza" },
        { label: "Pierre de Taza : usage extérieur et devis", href: "/pierre-de-taza" },
      ],
      ar: [
        { label: "رخام تازة: الأنواع والتشطيبات وعرض السعر", href: "/marbre-de-taza" },
        { label: "حجر تازة: الاستخدامات الخارجية وعرض السعر", href: "/pierre-de-taza" },
      ],
      en: [
        { label: "Taza marble: finishes and quotation", href: "/marbre-de-taza" },
        { label: "Taza stone: outdoor use and quotation", href: "/pierre-de-taza" },
      ],
    },
  },
  {
    slug: "prix-marbre-crema-marfil-volubilis",
    datePublished: "2026-07-01",
    readingMinutes: 11,
    content: {
      fr: {
        title: "Prix Crema Marfil et Volubilis au Maroc : comment comparer",
        description:
          "Prix marbre Crema Marfil Maroc et prix marbre Volubilis Maroc : ce qui influence le m², différences local vs importé, et comment obtenir un devis UNIVMAR.",
        excerpt:
          "Crema Marfil et Volubilis sont deux recherches prix fréquentes. Voici comment comprendre leur positionnement et éviter les devis incomparables.",
        sections: [
          {
            heading: "Pourquoi ces deux marbres reviennent dans les devis",
            paragraphs: [
              "Les requêtes « marbre crema marfil prix maroc » et « marbre volubilis prix maroc » traduisent une intention d’achat claire : comparer un marbre importé beige très répandu (Crema Marfil) avec un marbre local marocain à fort caractère (Volubilis). Les deux peuvent habiller un hall, un sol de villa ou une salle de bain — mais ils n’ont ni la même origine, ni le même comportement de prix.",
              "UNIVMAR stocke et transforme ces familles (selon disponibilité des lots) à Temara. L’objectif de cet article n’est pas d’afficher un prix figé trompeur, mais de vous donner une grille de lecture pour lire un devis m².",
            ],
          },
          {
            heading: "Prix marbre Volubilis Maroc",
            paragraphs: [
              "Le Volubilis est un marbre local apprécié pour son identité marocaine et ses veinages. Dans le catalogue UNIVMAR, les références locales premium type Volubilis se situent souvent dans le haut des fourchettes marbre local — à titre indicatif, autour de l’ordre de 400 MAD/m² matière selon lot et finition (hors pose, hors découpes complexes, variable 2026).",
              "Le prix marbre Volubilis Maroc monte ou descend avec la qualité du lot (homogénéité, pureté, format des plaques), la finition (poli vs adouci) et l’épaisseur. Sur une grande surface, l’homogénéité du calepinage compte autant que le prix unitaire.",
            ],
            bullets: [
              "Origine : marbre local marocain",
              "Usages : sols, halls, murs, escaliers",
              "Positionnement : local premium vs Taza standard",
              "Devis : surface + finition + ville de livraison",
            ],
          },
          {
            heading: "Prix marbre Crema Marfil Maroc",
            paragraphs: [
              "Le Crema Marfil (et les cremas proches : Crema Royal, Crema Sofita, Crema Galala selon lots) est un marbre beige importé très demandé pour les intérieurs lumineux. Son prix marbre Crema Marfil Maroc dépend du cours d’importation, de la sélection (veinage, fond plus ou moins uniforme) et du format de plaque disponible.",
              "Contrairement au Volubilis, il n’y a pas de « tarif carrière locale » stable : le devis suit le stock. UNIVMAR chiffre sur la base des plaques réellement disponibles — vous validez l’échantillon avant commande. En règle générale, l’import se positionne au-dessus du marbre local standard, mais un lot Crema bien sélectionné peut rester compétitif face à d’autres imports rares.",
            ],
          },
          {
            heading: "Crema Marfil ou Volubilis : comment choisir",
            paragraphs: [
              "Choisissez Volubilis si vous voulez une signature marocaine et un ancrage local. Choisissez Crema Marfil si vous visez un beige international, souvent plus uniforme, pour un style méditerranéen ou hôtelier classique. Les deux se posent en intérieur poli ou adouci ; pour l’extérieur exposé, orientez-vous plutôt vers pierre de Taza texturée.",
              "Budget global : regardez matière + découpe + pose + entretien. Un m² moins cher mal adapté à l’usage coûte plus cher en reprises. Pour les fourchettes générales marbre et granit m², voir la page Prix marbre Maroc.",
            ],
          },
          {
            heading: "Obtenir votre devis chez UNIVMAR",
            paragraphs: [
              "Indiquez la référence souhaitée (Crema Marfil, Volubilis ou alternative), les m², l’usage et la ville. Nous proposons éventuellement un équivalent local ou importé si le budget ou le stock l’exigent. Tél. / WhatsApp : +212 660-419991 — contact@universmarbre.com.",
              "Liens utiles : catalogue Crema Marfil, produit Volubilis, plan de travail marbre cuisine, et page prix marbre m² Maroc.",
            ],
          },
        ],
      },
      en: {
        title: "Crema Marfil and Volubilis prices in Morocco: how to compare",
        description:
          "Crema Marfil marble price Morocco and Volubilis marble price Morocco: what drives m² cost, local vs imported, and how to get a UNIVMAR quote.",
        excerpt:
          "Crema Marfil and Volubilis are two frequent price searches. Here is how to understand positioning and avoid incomparable quotes.",
        sections: [
          {
            heading: "Why these two marbles show up in quotes",
            paragraphs: [
              "Searches for Crema Marfil and Volubilis prices in Morocco show clear buying intent: compare a widely used imported beige marble with a characterful local Moroccan marble. Both can clad a hall, villa floor or bathroom — but origin and price behaviour differ.",
              "UNIVMAR fabricates these families (subject to lot availability) in Temara. This article does not freeze a misleading price; it gives you a grid to read an m² quote.",
            ],
          },
          {
            heading: "Volubilis marble price in Morocco",
            paragraphs: [
              "Volubilis is a local marble valued for Moroccan identity and veining. In the UNIVMAR catalogue, premium local references such as Volubilis often sit at the top of local marble ranges — indicatively around 400 MAD/m² material by lot and finish (excluding installation and complex cuts, variable in 2026).",
              "Price moves with lot quality (consistency, purity, slab size), finish (polished vs honed) and thickness. On large areas, layout consistency matters as much as unit price.",
            ],
            bullets: [
              "Origin: local Moroccan marble",
              "Uses: floors, halls, walls, stairs",
              "Positioning: premium local vs standard Taza",
              "Quote: area + finish + delivery city",
            ],
          },
          {
            heading: "Crema Marfil marble price in Morocco",
            paragraphs: [
              "Crema Marfil (and related cremas depending on lots) is a highly requested imported beige marble for bright interiors. Its Morocco price depends on import costs, selection (veining, background uniformity) and available slab format.",
              "Unlike Volubilis, there is no stable local-quarry tariff: quotes follow stock. UNIVMAR prices from real available slabs — you validate a sample before order. Imports usually sit above standard local marble, but a well-selected Crema lot can stay competitive versus rarer imports.",
            ],
          },
          {
            heading: "Crema Marfil or Volubilis: how to choose",
            paragraphs: [
              "Choose Volubilis for a Moroccan signature and local anchoring. Choose Crema Marfil for an international beige, often more uniform, for Mediterranean or classic hotel style. Both suit polished or honed interiors; for exposed exteriors, prefer textured Taza stone.",
              "Total budget: material + cutting + installation + care. A cheaper m² poorly matched to use costs more in rework. For general marble and granite m² ranges, see the Marble prices Morocco page.",
            ],
          },
          {
            heading: "Get your quote from UNIVMAR",
            paragraphs: [
              "State the desired reference (Crema Marfil, Volubilis or alternative), m², use and city. We may suggest a local or imported equivalent if budget or stock requires it. Phone / WhatsApp: +212 660-419991 — contact@universmarbre.com.",
              "Useful links: Crema Marfil catalogue, Volubilis product, marble kitchen worktops, and marble m² price Morocco page.",
            ],
          },
        ],
      },
      ar: {
        title: "سعر كريما مارفل وفولوبوليس في المغرب: كيف تقارنون",
        description:
          "سعر رخام كريما مارفل وسعر رخام فولوبوليس في المغرب: ما يؤثر على المتر، محلي مقابل مستورد، وكيفية الحصول على عرض UNIVMAR.",
        excerpt:
          "كريما مارفل وفولوبوليس من أكثر عمليات البحث عن السعر. إليكم كيف تفهمون التموضع وتتجنبون عروضاً غير قابلة للمقارنة.",
        sections: [
          {
            heading: "لماذا يظهر هذان الرخامان في عروض الأسعار",
            paragraphs: [
              "البحث عن سعر كريما مارفل وفولوبوليس في المغرب يعكس نية شراء واضحة: مقارنة رخام بيجي مستورد شائع مع رخام محلي مغربي بطابع قوي. كلاهما يصلح لردهة أو أرضية فيلا أو حمام — لكن المنشأ وسلوك السعر يختلفان.",
              "تحوّل UNIVMAR هذه العائلات (حسب توفر الدفعات) في تمارة. الهدف ليس سعراً ثابتاً مضللاً، بل شبكة قراءة لعرض المتر المربع.",
            ],
          },
          {
            heading: "سعر رخام فولوبوليس في المغرب",
            paragraphs: [
              "فولوبوليس رخام محلي يُقدَّر للهوية المغربية والعروق. في كتالوج UNIVMAR، المراجع المحلية الفاخرة مثل فولوبوليس غالباً في أعلى نطاق الرخام المحلي — إرشادياً حوالي 400 درهم/م² مادة حسب الدفعة والتشطيب (دون تركيب ولا قص معقد، متغير 2026).",
              "يتحرك السعر مع جودة الدفعة والتشطيب والسماكة. على المساحات الكبيرة، تجانس التخطيط يهم بقدر السعر الوحدوي.",
            ],
            bullets: [
              "المنشأ: رخام محلي مغربي",
              "الاستخدام: أرضيات وقاعات وجدران ودرجات",
              "التموضع: محلي فاخر مقابل تازة قياسي",
              "العرض: المساحة + التشطيب + مدينة التسليم",
            ],
          },
          {
            heading: "سعر رخام كريما مارفل في المغرب",
            paragraphs: [
              "كريما مارفل (والكريما القريبة حسب الدفعات) رخام بيجي مستورد مطلوب للداخل المشرق. يعتمد سعره في المغرب على الاستيراد واختيار العروق وشكل الألواح المتاحة.",
              "بخلاف فولوبوليس، لا يوجد تعريفة محجر محلي ثابتة: يتبع العرض المخزون. تسعّر UNIVMAR من الألواح الفعلية — تثبتون العينة قبل الطلب. المستورد عادة فوق الرخام المحلي القياسي، لكن دفعة كريما جيدة قد تبقى تنافسية أمام مستوردات أندر.",
            ],
          },
          {
            heading: "كريما مارفل أم فولوبوليس: كيف تختارون",
            paragraphs: [
              "اختاروا فولوبوليس لتوقيع مغربي وارتباط محلي. اختاروا كريما مارفل لبيجي دولي أكثر تجانساً غالباً، لطراز متوسطي أو فندقي كلاسيكي. كلاهما للداخل المصقول أو الملسن؛ للخارج المعرض فضّلوا حجر تازة بملمس.",
              "الميزانية الكلية: مادة + قص + تركيب + صيانة. متر أرخص غير مناسب للاستخدام يكلف أكثر في الإصلاح. للنطاقات العامة انظروا صفحة سعر الرخام في المغرب.",
            ],
          },
          {
            heading: "احصلوا على عرضكم من UNIVMAR",
            paragraphs: [
              "حددوا المرجع المطلوب (كريما مارفل أو فولوبوليس أو بديل) والمتر والاستخدام والمدينة. قد نقترح معادلاً محلياً أو مستورداً إن لزم. الهاتف / واتساب: +212 660-419991 — contact@universmarbre.com.",
            ],
          },
        ],
      },
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function allBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
