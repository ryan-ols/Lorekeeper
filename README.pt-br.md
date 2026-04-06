# LoreKeeper

App mobile pessoal para organizar tudo que você está assistindo, lendo ou jogando.
Construído com React Native, Expo e TypeScript.

## Funcionalidades

- Cadastre séries, filmes, animes, mangás, livros, light novels e jogos
- Acompanhamento de progresso com cálculo de porcentagem (episódios, capítulos ou volumes)
- Filtros por status: Assistindo, Lendo, Jogando, Concluído, Pausado, Abandonado, Planejado
- Ordenação por nome, progresso, avaliação ou adicionado recentemente
- Busca por título ou autor
- Avaliações e notas pessoais
- Interface totalmente em dark mode
- Dados salvos localmente no dispositivo — sem conta ou internet necessários

## Tecnologias

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- TypeScript
- SQLite via `expo-sqlite`
- React Navigation

## Como usar

### Pré-requisitos

- Node.js (LTS)
- Expo CLI — `npm install -g expo-cli`
- EAS CLI — `npm install -g eas-cli`
- App Expo Go no celular (para desenvolvimento)

### Instalação

```bash
git clone https://github.com/yourusername/lorekeeper.git
cd lorekeeper
git checkout pt-br
npm install
```

### Rodando

```bash
npx expo start
```

Escaneie o QR code com o Expo Go no seu celular Android.

### Gerando o APK

```bash
eas login
eas build --platform android --profile preview
```

Baixe o `.apk` pelo link gerado e instale no seu celular Android.
Habilite "Instalar de fontes desconhecidas" nas configurações do dispositivo se necessário.

## Branches

| Branch | Idioma |
|--------|--------|
| `master` | Inglês |
| `pt-br` | Português (BR) |

## Estrutura do projeto

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

## Observações

Após clonar, crie seu próprio projeto em [expo.dev](https://expo.dev) e atualize
o `projectId` no `app.json` antes de gerar o build.

## Licença

MIT
