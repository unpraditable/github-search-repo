import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import "./GithubSearchApp.css";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
}

interface UserWithRepos {
  login: string;
  repos: Repo[];
}

const GithubSearchApp: React.FC = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserWithRepos[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const fetchUsersAndRepos = async () => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setUsers([]);
      return;
    }

    setLoading(true);
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
              description: r.description,
              stargazers_count: r.stargazers_count,
            })),
          };
        })
      );

      setUsers(usersWithRepos);
      setExpandedUsers(new Set());
    } catch (error) {
      console.error("GitHub API error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchUsersAndRepos();
    }
  };

  const toggleUser = (login: string) => {
    const newSet = new Set(expandedUsers);
    if (newSet.has(login)) {
      newSet.delete(login);
    } else {
      newSet.add(login);
    }
    setExpandedUsers(newSet);
  };

  return (
    <div className="app-container">
      <h1 className="title">GitHub Repository Search</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search GitHub username..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={fetchUsersAndRepos} className="search-button">
          Search
        </button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      <div className="accordion">
        {users.map((user) => {
          const isOpen = expandedUsers.has(user.login);
          return (
            <div key={user.login} className="accordion-item">
              <button
                onClick={() => toggleUser(user.login)}
                className="accordion-toggle"
              >
                <span>{user.login}</span>
                <FontAwesomeIcon
                  icon={isOpen ? faChevronUp : faChevronDown}
                  className="icon"
                />
              </button>
              {isOpen && (
                <ul className="repo-list">
                  {user.repos.map((repo) => (
                    <li key={repo.id} className="repo-item">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-link"
                      >
                        <div className="inline-flex">
                          <i>{repo.name}</i>
                          <i>
                            <div className="repo-stars">
                              <FontAwesomeIcon
                                icon={faStar}
                                className="star-icon"
                              />{" "}
                              {repo.stargazers_count}
                            </div>
                          </i>
                        </div>
                        {repo.description && (
                          <p className="repo-description">{repo.description}</p>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GithubSearchApp;
