# 📘 GitHubSearchApp Test Documentation

This document explains how to clone, install, run, and test the `GithubSearchApp` React component.

---

## 📥 Cloning the Repository

```bash
git clone https://github.com/unpraditable/github-search-app.git
cd github-search-app
```

---

## ⚙️ Installing Dependencies

Use your preferred package manager:

### NPM:

```bash
npm install
```

### Yarn:

```bash
yarn install
```

---

## ▶️ Running the App

### NPM:

```bash
npm start
```

### Yarn:

```bash
yarn start
```

Visit [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## 🚀 Running the Tests

Using NPM:

```bash
npm test
```

Or run a specific test file:

```bash
npx jest App.test.tsx
```

Using Yarn:

```bash
yarn test
```

---

## ✅ What is Covered in Unit Tests

### 1. **Basic UI Rendering**

- Ensures the search input and button are visible on screen.

### 2. **Search Functionality**

- Mocks GitHub API fetch calls.
- Simulates user typing and clicking the Search button.
- Verifies:
  - The correct username is rendered.
  - Repositories are listed with name, description, and star count.

### 3. **Validation**

- Prevents search API call if input is shorter than 2 characters.

---

## 🔎 Example Output Snapshot

After typing `octocat` and clicking search:

```
> Hello-World
My first repository on GitHub!
★ 42 stars
```

---

## 🧪 Test File Highlights

### Mock Fetch:

```ts
(global.fetch as jest.Mock).mockImplementation((url) => { ... });
```

### Interaction:

```ts
fireEvent.change(input, { target: { value: "octocat" } });
fireEvent.click(button);
```

### Assertions:

```ts
expect(screen.getByText("Hello-World")).toBeInTheDocument();
expect(screen.getByText("42")).toBeInTheDocument();
```

---

## 🛠️ Tips

- Always reset fetch mocks between tests with `jest.clearAllMocks()`.
- Use `await waitFor(...)` when testing async fetch results.
- Use `screen.debug()` for manual troubleshooting output.

---

For help customizing tests, mocking API errors, or adding coverage for loading/error states, reach out!
