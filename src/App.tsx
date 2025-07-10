import React, { useState } from "react";

interface Repo {
  id: number;
  name: string;
  html_url: string;
}

interface UserWithRepos {
  login: string;
  repos: Repo[];
}

const GithubSearchApp: React.FC = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserWithRepos[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsersAndRepos = async () => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setUsers([]);
      return;
    }
    setUsers([]);
    setIsLoading(true);
    try {
      const userRes = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(
          trimmed
        )}&per_page=5`
      );
      const userData = await userRes.json();
      const logins = userData.items?.map((u: any) => u.login) || [];

      const usersWithRepos: UserWithRepos[] = await Promise.all(
        logins.map(async (login: string) => {
          const repoRes = await fetch(
            `https://api.github.com/users/${login}/repos?per_page=100`
          );
          const repos = await repoRes.json();

          return {
            login,
            repos: repos.map((r: any) => ({
              id: r.id,
              name: r.name,
              html_url: r.html_url,
            })),
          };
        })
      );

      setUsers(usersWithRepos);
    } catch (error) {
      console.error("GitHub API error:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchUsersAndRepos();
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-sans">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search GitHub username..."
          className="w-full p-2 border rounded mr-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={fetchUsersAndRepos}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {users.map((user) => (
        <div key={user.login} className="mb-6">
          <h2 className="text-lg font-semibold">{user.login}</h2>
          <ul className="list-disc ml-6">
            {user.repos.map((repo) => (
              <li key={repo.id}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {repo.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GithubSearchApp;
