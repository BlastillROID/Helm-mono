# Helm Monorepo CLI

## Overview
`helm-mono` is a CLI tool designed to manage Helm chart monorepos efficiently. It provides features such as listing, building, versioning, and publishing Helm charts to Harbor.

## Features
- **Initialize Monorepo Configuration** (`helm-mono init`)
- **List Available Charts** (`helm-mono list`)
- **Build Helm Charts** (`helm-mono build <chart>` or `helm-mono build-all`)
- **Build Only Affected Charts** (`helm-mono build-affected`)
- **Bump Chart Versions** (`helm-mono version <chart> patch|minor|major|<specific version>`)
- **Push Charts to Harbor** (`helm-mono push <chart>` or `helm-mono push-all`)

## Installation

### 1️⃣ Install Dependencies
Ensure you have **Node.js (>=14.0.0)** installed. Then, run:
```sh
npm install
```

### 2️⃣ Link the CLI Tool
To make `helm-mono` available globally:
```sh
npm link
```

Now, you can run `helm-mono` from anywhere in your terminal.

## Usage

### 🔹 Initialize Configuration
```sh
helm-mono init
```
This command will prompt you for:
- Chart directories
- Harbor repository URL & project name

It will generate `helm.monorepo.json` with your configuration.

### 🔹 List Available Charts
```sh
helm-mono list
```
Scans configured directories and lists Helm charts that contain a `Chart.yaml` file.

### 🔹 Build Charts
#### Build a specific chart:
```sh
helm-mono build <chart> [-o output-folder] [--build-deps]
```
#### Build all charts:
```sh
helm-mono build-all [-o output-folder] [--build-deps]
```
#### Build only affected charts:
```sh
helm-mono build-affected [-o output-folder] [-r HEAD~1] [--build-deps]
```
- `--build-deps` ensures dependencies are built first.

### 🔹 Version Bumping
```sh
helm-mono version <chart> patch|minor|major|<specific version>
```
Example:
```sh
helm-mono version my-chart minor  # Bumps version (1.0.0 → 1.1.0)
helm-mono version my-chart 2.3.5  # Sets version to 2.3.5
```

### 🔹 Push Charts to Harbor
#### Push a specific chart:
```sh
helm-mono push <chart> [-u username] [-p password]
```
#### Push all charts:
```sh
helm-mono push-all [-u username] [-p password]
```
The CLI uses the Harbor URL and project name from `helm.monorepo.json`.

## Running Tests
```sh
npm test
```
To test a specific command:
```sh
npx jest tests/init.test.js
```

To run tests with coverage:
```sh
npx jest --coverage
```

## Contributing
Feel free to submit issues and pull requests to improve this project!

## License
MIT License
