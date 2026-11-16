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
│   ├── minefield/    # tabuleiro, regras e testes
│   │   └── minefield.test.tsx
│   └── modal/        # modal de vitória/derrota
└── test/             # mocks usados pelo Jest
```

## Testes

Os testes ficam ao lado do código (`*.test.ts` e `*.test.tsx`) e usam Jest 29 com `babel-jest` e `jsdom`.  Nos testes do tabuleiro, `Math.random` é mockado para posicionar as minas em lugares conhecidos.
