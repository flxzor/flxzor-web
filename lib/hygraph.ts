export interface HygraphProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  projectDate?: string;
  coverImage?: {
    url: string;
  };
  demoUrl?: string;
  githubUrl?: string;
  isPin?: boolean;
}

const PROJECTS_QUERY = `
  query GetProjects {
    projects {
      id
      title
      description
      tech
      projectDate
      coverImage {
        url
      }
      demoUrl
      githubUrl
      isPin
    }
  }
`;

async function fetchProjectsFromHygraph(): Promise<HygraphProject[]> {
  const endpoint = process.env.HYGRAPH_ENDPOINT;

  if (!endpoint) {
    console.warn("HYGRAPH_ENDPOINT is not defined in environment variables. Returning empty projects.");
    return [];
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: PROJECTS_QUERY }),
      next: { revalidate: 60 },
    });

    const json = await res.json();
    
    if (json.errors) {
      console.error("GraphQL errors:", json.errors);
      throw new Error("Failed to fetch projects from Hygraph");
    }

    return json.data.projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

/** Fetch only pinned projects (max 3) — used on the landing page */
export async function getProjects(): Promise<HygraphProject[]> {
  const all = await fetchProjectsFromHygraph();
  return all.filter((p) => p.isPin).slice(0, 3);
}

/** Fetch all projects — used on the /projects page */
export async function getAllProjects(): Promise<HygraphProject[]> {
  const all = await fetchProjectsFromHygraph();
  
  // Sort so pinned projects appear first
  return all.sort((a, b) => {
    if (a.isPin && !b.isPin) return -1;
    if (!a.isPin && b.isPin) return 1;
    return 0;
  });
}

