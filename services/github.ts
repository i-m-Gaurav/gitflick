export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  language: string;
  visibility: string;
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to fetch random repositories
export const fetchRandomRepositories = async (): Promise<Repository[]> => {
  try {
    // Add a small delay between requests to avoid rate limits
    await delay(1000);

    // Use the public API endpoint directly
    const response = await fetch(`https://api.github.com/repositories?per_page=5&since=${Math.floor(Math.random() * 100000)}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    // Check if we hit rate limit
    const remaining = response.headers.get('X-RateLimit-Remaining');
    if (remaining === '0') {
      const resetTime = Number(response.headers.get('X-RateLimit-Reset')) * 1000;
      const waitTime = Math.ceil((resetTime - Date.now()) / 60000); // Convert to minutes
      throw new Error(`Rate limit exceeded. Please wait ${waitTime} minutes before trying again.`);
    }

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const data = await response.json();

    // Map only the freely available data
    const repositories: Repository[] = data.map((repo: any): Repository => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "",
      html_url: repo.html_url,
      owner: {
        login: repo.owner?.login || "unknown",
        avatar_url: repo.owner?.avatar_url || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      },
      language: repo.language || "",
      visibility: "public"
    }));

    return repositories;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    if (error instanceof Error) {
      throw error;
    }
    return [];
  }
};