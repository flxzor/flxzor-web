export interface HygraphProject {
  id: string;
  title: string;
  description: string;
  tech: string;
  coverImage?: {
    url: string;
  };
  demoUrl?: string;
  githubUrl?: string;
  isPin?: boolean;
}

export async function getProjects(): Promise<HygraphProject[]> {
  const endpoint = process.env.HYGRAPH_ENDPOINT;

  if (!endpoint) {
    console.warn("HYGRAPH_ENDPOINT is not defined in environment variables. Returning empty projects.");
    return [];
  }

  const query = `
    query GetProjects {
      projects {
        id
        title
        description
        tech
        coverImage {
          url
        }
        demoUrl
        githubUrl
        isPin
      }
    }
  `;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      // Optional: next: { revalidate: 60 } for ISR
      cache: "no-store", // We use no-store for dynamic fetching, or user can change it
    });

    const json = await res.json();
    
    if (json.errors) {
      console.error("GraphQL errors:", json.errors);
      throw new Error("Failed to fetch projects from Hygraph");
    }

    const pinnedProjects = json.data.projects.filter((p: HygraphProject) => p.isPin).slice(0, 3);
    return pinnedProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}
