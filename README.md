# RadioLine v.2.0

Execute below npm command for devdependencies

```npm
npm install --save-dev eslint prettier eslint-config-prettier  eslint-plugin-prettier husky lint-staged eslint-plugin-sonarjs eslint-plugin-react @babel/eslint-parser @babel/preset-env @babel/preset-react
```

- Add below commands to package.json
  ```json
  "lint": "eslint . --ext .jsx",
  "lint:fix": "eslint . --ext .jsx --fix", //fix potential fixable issues
  "cleanFormat": "npx prettier --write ." //fix prettier code
  ```

## Husky (Pre-commit hooks)

Use below commands to implement

- npm install --save-dev husky lint-staged
- mkdir .husky
- touch pre-commit
  ```bash
  mkdir -p .husky
  touch .husky/pre-commit
  ```
- copy content from pre-commit file and paste into the file

  ```bash
    #!/usr/bin/env sh

    echo "▶ Running pre-commit hook..."

    npx lint-staged
  ```

- run below commands

  ```bash
  npm pkg set scripts.prepare="husky install"
  npm run prepare
  ```

- To make this file executable, run this
  ```bash
  chmod +x .husky/pre-commit
  ```
- add to package.json, below snippet

  ```json
     "lint-staged": {
    "*.js": [
      "npx prettier --write",
      "npx eslint --fix"
    ],
    "*.jsx": [
      "npx prettier --write",
      "npx eslint --fix"
    ],
    "*.json": [
      "npx prettier --write"
    ],
    "*.css": [
      "npx prettier --write"
    ],
    "*.md":[
      "npx prettier --write"
    ]
  }
  ```

- hls.js package is required for implementing live streaming urls, like m3u8 files.

### Deploying to Github Pages

- install gh-pages
  ```bash
  npm install --save gh-pages
  ```
- add below in package.json
  ```json
   "homepage": "https://<your-username>.github.io/<your-repo-name>"
  ```
- in package.json, add below script commands
  ```json
    "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
    }
  ```
- now execute npm run predeploy to generate build files and then npm run deploy, which will publish website

- also for vite, in vite.config.js add base, as below

  ```js
  // vite.config.js
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    base: '/<Repo_NAME>/', // 👈 This must match your repo name
    plugins: [react()],
  });
  ```

- remove '/' from path in jsx if assets are already in public folder
