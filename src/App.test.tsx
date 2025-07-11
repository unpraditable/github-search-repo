import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GithubSearchApp from "./App";

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("renders input and search button", () => {
  render(<GithubSearchApp />);
  expect(
    screen.getByPlaceholderText(/search github username/i)
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
});

test("fetches users and repositories when search is submitted", async () => {
  (fetch as jest.Mock).mockImplementation((url) => {
    if (url.includes("search/users")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            items: [{ login: "octocat" }],
          }),
      });
    }
    if (url.includes("/users/octocat/repos")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: 1,
              name: "Hello-World",
              html_url: "https://github.com/octocat/Hello-World",
              description: "My first repository on GitHub!",
              stargazers_count: 42,
            },
          ]),
      });
    }
    return Promise.reject("unknown endpoint");
  });

  render(<GithubSearchApp />);

  fireEvent.change(screen.getByPlaceholderText(/search github username/i), {
    target: { value: "octocat" },
  });
  fireEvent.click(screen.getByRole("button", { name: /search/i }));

  await screen.findByText("octocat");
  fireEvent.click(screen.getByText("octocat"));
  await screen.findByText("Hello-World");

  expect(screen.getByText("Hello-World")).toBeInTheDocument();
  expect(
    screen.getByText("My first repository on GitHub!")
  ).toBeInTheDocument();
  expect(screen.getByText("42")).toBeInTheDocument();
});

test("does not search if input is too short", async () => {
  render(<GithubSearchApp />);
  fireEvent.change(screen.getByPlaceholderText(/search github username/i), {
    target: { value: "a" },
  });
  fireEvent.click(screen.getByRole("button", { name: /search/i }));
  expect(fetch).not.toHaveBeenCalled();
});
