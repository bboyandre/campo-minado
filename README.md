# Campo Minado

Jogo de Campo Minado para o navegador, feito com React 19, TypeScript e Vite.

## Como jogar

- Tabuleiro de 8×8 com 10 minas.
- **Clique esquerdo** revela uma célula. O número mostra quantas minas existem nas 8 células vizinhas. Células sem minas vizinhas revelam a região ao redor automaticamente.
- **Clique direito** coloca ou remove uma bandeira (🚩). Células com bandeira não podem ser reveladas.
- Você vence ao revelar todas as células sem mina. Se revelar uma mina (💣), perde.
- O botão de reinício gera um novo tabuleiro.

## Requisitos

- Node.js 24 (versão fixada em `.nvmrc`). Com o nvm, rode `nvm use`.

## Instalação e execução

```bash
npm install
npm run dev
```

O Vite mostra no terminal o endereço do servidor local.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm test` | Roda os testes com Jest (em série) |
| `npm run test:parallel` | Roda os testes em paralelo |
| `npm run coverage` | Testes com relatório de cobertura em `coverage-jest/` |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Checagem de tipos (o build do Vite não checa tipos) |

A cobertura mínima exigida em `src/components/minefield/` é de 80%.

## Estrutura

```
src/
├── App.tsx
├── main.tsx
├── components/
│   ├── header/       # cabeçalho
│   ├── footer/       # rodapé
│   ├── minefield/    # tabuleiro e regras do jogo
│   │   └── game.ts   # lógica pura (criação do tabuleiro, contagem, revelação)
│   └── modal/        # modal de vitória/derrota
└── test/             # mocks usados pelo Jest
```

## Testes

Os testes ficam ao lado do código (`*.test.ts` e `*.test.tsx`) e usam Jest 29 com `babel-jest` e `jsdom`. As funções de `game.ts` recebem o gerador aleatório como parâmetro, o que permite testá-las com valores determinísticos.

## Deploy

O projeto é estático. Rode `npm run build` e publique a pasta `dist/` em qualquer host estático, usando Node 24 no ambiente de build.
