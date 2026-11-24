export type FeaturedProjectId = "caroussel" | "um6p" | "residences" | "ranch-marrakech";

export type FeaturedProject = {
  id: FeaturedProjectId;
  image: string;
};

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: "caroussel",
    image: "/big-project/WhatsApp Image 2026-06-18 at 12.44.50.jpeg",
  },
  {
    id: "um6p",
    image: "/big-project/WhatsApp Image 2026-06-18 at 12.44.17.jpeg",
  },
  {
    id: "residences",
    image: "/big-project/WhatsApp Image 2026-06-18 at 12.46.54.jpeg",
  },
  {
    id: "ranch-marrakech",
    image: "/big-project/the-ranch-marrakech.jpeg",
  },
];

export function getFeaturedProject(id: FeaturedProjectId): FeaturedProject | undefined {
  return FEATURED_PROJECTS.find((p) => p.id === id);
}
