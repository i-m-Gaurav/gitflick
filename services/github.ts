import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  language: string;
  topics: string[];
  default_branch: string;
  open_issues_count: number;
  watchers_count: number;
  license: {
    name: string;
    spdx_id: string;
  } | null;
  size: number;
  visibility: string;
  has_wiki: boolean;
  has_pages: boolean;
  archived: boolean;
}

// Function to fetch random repositories
export const fetchRandomRepositories = async (): Promise<Repository[]> => {
  try {
    // Get repositories with random since ID
    const { data } = await octokit.repos.listPublic({
      since: Math.floor(Math.random() * 1000000),
      per_page: 10,
    });

    // Fetch full repository data for each repository
    const fullRepos = await Promise.all(
      data.map(async (repo) => {
        try {
          const { data: fullRepo } = await octokit.repos.get({
            owner: repo.owner.login,
            repo: repo.name,
          });
          return fullRepo;
        } catch (error) {
          console.error(`Error fetching full repo data for ${repo.full_name}:`, error);
          return repo;
        }
      })
    );

    // Map the repositories to our interface
    const repositories: Repository[] = fullRepos.map((repo): Repository => ({
      id: repo.id,
      name: repo.name || "",
      description: repo.description || "",
      stargazers_count: typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0,
      forks_count: typeof repo.forks_count === 'number' ? repo.forks_count : 0,
      html_url: repo.html_url || "",
      homepage: repo.homepage || null,
      owner: {
        login: repo.owner?.login || "unknown",
        avatar_url: repo.owner?.avatar_url || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      },
      language: repo.language || "",
      topics: repo.topics || [],
      default_branch: repo.default_branch || "main",
      open_issues_count: repo.open_issues_count || 0,
      watchers_count: repo.watchers_count || 0,
      license: repo.license ? {
        name: repo.license.name || "Unknown License",
        spdx_id: repo.license.spdx_id || "UNKNOWN"
      } : null,
      size: repo.size || 0,
      visibility: repo.visibility || "public",
      has_wiki: repo.has_wiki || false,
      has_pages: repo.has_pages || false,
      archived: repo.archived || false
    }));

    return repositories;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
};