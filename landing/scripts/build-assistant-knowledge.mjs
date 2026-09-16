import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

const products = readJson("data/products.json");
const categories = readJson("data/categories.json");
const projects = readJson("data/projects.json");
const projectCategories = readJson("data/projectCategories.json");

const publishedProducts = products
  .filter((product) => product.published && product.visibility !== "hidden")
  .map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category?.name ?? categories.find((cat) => cat.id === product.categoryId)?.name ?? "Non classe",
    inStock: Boolean(product.inStock),
    image: product.images,
    applications: Array.isArray(product.applicationImages) ? product.applicationImages.length : 0,
  }));

const publishedProjects = projects
  .filter((project) => project.published)
  .map((project) => ({
    id: project.id,
    title: project.title,
    category: project.category?.name ?? projectCategories.find((cat) => cat.id === project.categoryId)?.name ?? "Projet",
    image: project.image,
  }));

const productsByCategory = publishedProducts.reduce((acc, product) => {
  acc[product.category] ??= [];
  acc[product.category].push(product);
  return acc;
}, {});

const categorySummaries = categories.map((category) => {
  const items = productsByCategory[category.name] ?? [];
  return {
    id: category.id,
    name: category.name,
    local: Boolean(category.local),
    productCount: items.length,
    sampleProducts: items.slice(0, 18).map((product) => product.name),
  };
});

const projectSummaries = projectCategories.map((category) => {
  const items = publishedProjects.filter((project) => project.category === category.name);
  return {
    id: category.id,
    name: category.name,
    projectCount: items.length,
    sampleProjects: items.slice(0, 12).map((project) => project.title),
  };
});

const knowledge = {
  generatedAt: new Date().toISOString(),
  company: {
    name: "UNIVMAR",
    website: "https://universmarbre.com",
    foundedYear: 2004,
    specialty:
      "Pierre naturelle au Maroc: marbre local et importe, granit, onyx, quartz, pierre de Taza, façades, sols, escaliers, cuisines, salles de bain et projets sur mesure.",
    address: "Atelier 2, Ouled Slama, Ain Atiq, Temara, Maroc",
    phone: "+212 660-419991",
    email: "contact@universmarbre.com",
    instagram: "@univers.marbre",
    languages: ["fr", "en", "ar"],
  },
  guidance: [
    "Repondre d'abord avec les donnees UNIVMAR ci-dessous.",
    "Pour un devis, une disponibilite exacte, une finition specifique ou une pose, inviter le client a contacter UNIVMAR.",
    "Ne jamais donner de prix. Pour toute question de prix, demander les mesures et inviter le client a contacter UNIVMAR pour un devis.",
    "Proposer des produits et categories pertinentes a partir de la question du client.",
    "Garder les reponses courtes, commerciales et utiles.",
  ],
  categories: categorySummaries,
  products: publishedProducts,
  projects: publishedProjects,
  projectCategories: projectSummaries,
  quickAnswers: [
    {
      question: "Comment demander un devis ?",
      answer:
        "Envoyez le type de pierre, les mesures, la ville du chantier et si possible des photos. UNIVMAR peut repondre par telephone, WhatsApp ou email.",
    },
    {
      question: "Ou se trouve UNIVMAR ?",
      answer: "UNIVMAR se trouve a Atelier 2, Ouled Slama, Ain Atiq, Temara, Maroc.",
    },
    {
      question: "Quels produits sont disponibles ?",
      answer:
        "La base contient marbre local, pierre naturelle/Tahejart, granit, marbre, onyx et quartz, avec plusieurs references publiees.",
    },
  ],
};

writeFileSync(
  join(root, "data/assistant-knowledge.json"),
  `${JSON.stringify(knowledge, null, 2)}\n`,
);

console.log(
  `Assistant knowledge generated: ${publishedProducts.length} products, ${publishedProjects.length} projects, ${categorySummaries.length} categories.`,
);
