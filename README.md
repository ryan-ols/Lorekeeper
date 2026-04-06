# LoreKeeper

A personal media tracker mobile app built with React Native, Expo, and TypeScript.
Track everything you're watching, reading, or playing — all in one place.

## Features

- Track series, movies, anime, manga, books, light novels, and games
- Progress tracking with percentage calculator (episodes, chapters, or volumes)
- Status filters: Watching, Reading, Playing, Completed, Paused, Dropped, Planned
- Sort by name, progress, rating, or recently added
- Search by title or author
- Ratings and personal notes
- Full dark mode UI
- Data stored locally on device — no account or internet required

## Tech Stack

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- TypeScript
- SQLite via `expo-sqlite`
- React Navigation

## Getting Started

### Prerequisites

- Node.js (LTS)
- Expo CLI — `npm install -g expo-cli`
- EAS CLI — `npm install -g eas-cli`
- Expo Go app on your phone (for development)

### Installation

```bash
git clone https://github.com/yourusername/lorekeeper.git
cd lorekeeper
npm install
```

### Running

```bash
npx expo start
```

Scan the QR code with Expo Go on your Android device.

### Building the APK

```bash
eas login
eas build --platform android --profile preview
```

Download the `.apk` from the link provided and install it on your Android device.
Enable "Install from unknown sources" on your device if prompted.

## Branches

| Branch | Language |
|--------|----------|
| `master` | English |
| `pt-br` | Portuguese (BR) |

## Project Structure

```
src/
├── components/
│   ├── CatalogCard.tsx
│   ├── FilterTabs.tsx
│   ├── ProgressBar.tsx
│   └── SortModal.tsx
├── screens/
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── FormScreen.tsx
├── db/
│   └── database.ts
├── types/
│   └── index.ts
└── theme/
    └── colors.ts
```

## Notes

After cloning, create your own project on [expo.dev](https://expo.dev) and update
the `projectId` in `app.json` with your own before building.

## License

MIT
