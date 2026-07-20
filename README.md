# Road to Austin 2026

A live Formula 1 desktop companion powered by the Jolpica F1 API.

## Run as a website

```bash
npm install
npm run dev
```

## Run as a desktop app

```bash
npm install
npm run desktop
```

## Build an installer on this computer

```bash
npm run dist
```

Installers are written to `release/`.

## Build both macOS and Windows installers on GitHub

Push this project to GitHub, open **Actions**, choose **Build desktop installers**, and click **Run workflow**. Download the finished macOS and Windows artifacts from the workflow run.

The app fetches current 2026 season data when online and keeps a local cache so the last successfully loaded data remains available offline.
