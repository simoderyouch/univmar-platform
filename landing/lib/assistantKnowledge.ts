import knowledge from "@/data/assistant-knowledge.json";

type AssistantKnowledge = typeof knowledge;

const MAX_CONTEXT_CHARS = 42000;

function compactKnowledge(source: AssistantKnowledge) {
  return {
    company: source.company,
    guidance: source.guidance,
    categories: source.categories,
    projectCategories: source.projectCategories,
    products: source.products.map((product) => ({
      name: product.name,
      category: product.category,
      inStock: product.inStock,
    })),
    projects: source.projects.map((project) => ({
      title: project.title,
      category: project.category,
    })),
  };
}

export function getAssistantKnowledgeContext() {
  const context = JSON.stringify(compactKnowledge(knowledge), null, 2);
  return context.length > MAX_CONTEXT_CHARS
    ? `${context.slice(0, MAX_CONTEXT_CHARS)}\n[Context truncated to fit the assistant prompt.]`
    : context;
}

export function getAssistantGreeting(lang: string) {
  if (lang === "ar") return "مرحبا، كيف يمكنني مساعدتك في اختيار الحجر الطبيعي؟";
  if (lang === "en") return "Hello, how can I help you choose natural stone?";
  return "Bonjour, comment puis-je vous aider a choisir votre pierre naturelle ?";
}
