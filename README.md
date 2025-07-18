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
    ]
  }
  ```
