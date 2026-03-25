# Jogadores Cards + Metricas Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Entregar a rota `/jogadores` com cards visuais fora do padrao e dados reais por jogador com `gols`, `partidas`, `vitorias` e `percentualVitoria` vindos do backend.

**Architecture:** O backend continua lendo os jogadores da planilha, mas passa a compor as metricas consultando tambem as partidas e agregando por nome do jogador. O frontend passa a ter um modulo `jogadores` lazy-loaded com listagem em cards hero-driven (mesma linguagem do header atual, com composicao mais ousada) consumindo diretamente o `JogadorService` tipado pelos DTOs atualizados.

**Tech Stack:** NestJS 11, Angular 21 (standalone + signals), RxJS, Bootstrap utilitarios + SCSS custom.

---

### Task 1: Revisar contrato de dados (backend + frontend)

**Files:**
- Modify: `pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.dto.ts`
- Modify: `pig-league/src/app/data/jogador/dto/get-jogadores.dto.ts`
- Modify: `pig-league/src/app/data/jogador/mocks/get-jogadores.mock.ts`
- Modify: `pig-league/src/app/data/jogador/jogador-service.spec.ts`

**Step 1: Write the failing test**

```ts
expect(payload.jogadores[0]).toEqual(
  expect.objectContaining({
    gols: expect.any(Number),
    partidas: expect.any(Number),
    vitorias: expect.any(Number),
    percentualVitoria: expect.any(Number),
  }),
);
```

**Step 2: Run test to verify it fails**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/data/jogador/jogador-service.spec.ts`
Expected: FAIL por propriedades ausentes no DTO/mock.

**Step 3: Write minimal implementation**

```ts
export interface GetJogadorDto {
  id: number;
  nome: string;
  gols: number;
  partidas: number;
  vitorias: number;
  percentualVitoria: number;
}
```

**Step 4: Run test to verify it passes**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/data/jogador/jogador-service.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add pig-league/src/app/data/jogador
git commit -m "feat(jogador-dto): add aggregated player metrics"
```

### Task 2: Criar testes de agregacao no backend (red)

**Files:**
- Modify: `pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`

**Step 1: Write the failing test**

```ts
it('deve calcular gols, partidas, vitorias e percentualVitoria por jogador com base nas partidas realizadas', async () => {
  // mock jogadores + mock partidas e valida agregados
});
```

**Step 2: Run test to verify it fails**

Run: `cd pig-league-api && npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
Expected: FAIL porque o use case ainda nao agrega metricas.

**Step 3: Write minimal implementation contract expectation**

```ts
expect(response.jogadores).toEqual([
  expect.objectContaining({ gols: 0, partidas: 0, vitorias: 0, percentualVitoria: 0 }),
]);
```

**Step 4: Run test to verify it still fails for missing implementation**

Run: `cd pig-league-api && npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
Expected: FAIL

**Step 5: Commit**

```bash
git add pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts
git commit -m "test(jogadores): add red tests for aggregated stats"
```

### Task 3: Implementar agregacao de metricas no backend

**Files:**
- Modify: `pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.ts`
- Modify: `pig-league-api/src/api/campeonato/jogadores/jogadores.module.ts`
- Modify: `pig-league-api/src/api/campeonato/jogadores/jogadores.service.spec.ts`
- Modify: `pig-league-api/src/api/campeonato/jogadores/jogadores.controller.spec.ts`

**Step 1: Wire dependency de partidas**

```ts
imports: [PartidasModule]
```

**Step 2: Implementar regra de calculo**

```ts
// somente partidas com status REALIZADA contam em partidas/vitorias/percentual
// gols = soma dos gols do jogador nas partidas realizadas
// percentualVitoria = (vitorias / partidas) * 100, com fallback 0 quando partidas=0
```

**Step 3: Garantir payload final completo por jogador**

```ts
{ id, nome, gols, partidas, vitorias, percentualVitoria }
```

**Step 4: Run tests to verify pass**

Run:
- `cd pig-league-api && npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
- `cd pig-league-api && npm run test -- src/api/campeonato/jogadores/jogadores.service.spec.ts`
- `cd pig-league-api && npm run test -- src/api/campeonato/jogadores/jogadores.controller.spec.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add pig-league-api/src/api/campeonato/jogadores
git commit -m "feat(jogadores-api): aggregate stats from partidas"
```

### Task 4: Estruturar modulo da rota `/jogadores` no frontend

**Files:**
- Create: `pig-league/src/app/modules/jogadores/jogadores.component.ts`
- Create: `pig-league/src/app/modules/jogadores/jogadores.routes.ts`
- Create: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.ts`
- Create: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.html`
- Create: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.scss`
- Modify: `pig-league/src/app/app.routes.ts`

**Step 1: Write the failing test**

```ts
// valida que /jogadores carrega componente da feature (nao SectionTemplate)
```

**Step 2: Run test to verify it fails**

Run: `cd pig-league && npm run test -- --watch=false`
Expected: FAIL por rota/componente inexistentes.

**Step 3: Write minimal implementation**

```ts
{
  path: 'jogadores',
  loadChildren: () => import('./modules/jogadores/jogadores.routes').then((m) => m.jogadoresRoutes),
}
```

**Step 4: Run test to verify it passes**

Run: `cd pig-league && npm run test -- --watch=false`
Expected: PASS

**Step 5: Commit**

```bash
git add pig-league/src/app/app.routes.ts pig-league/src/app/modules/jogadores
git commit -m "feat(jogadores-ui): add lazy-loaded jogadores feature"
```

### Task 5: Construir UI fora da caixa (cards de jogadores)

**Files:**
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.ts`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.html`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.scss`

**Step 1: Definir direcao visual escolhida**

```txt
Concept: Tactical Trading Cards
- Hero com diagonais douradas + grid noise (heranca do header de partidas)
- Cards em composicao assimetrica (1 destaque + 2 secundarios no desktop)
- Badge circular de percentual de vitoria (conic-gradient)
- Chips de metricas: gols / partidas / vitorias
```

**Step 2: Implementar estados de dados (loading, erro, vazio, sucesso)**

```ts
readonly carregando = signal(false);
readonly erro = signal<string | null>(null);
readonly jogadores = computed(() => this.resposta()?.jogadores ?? []);
```

**Step 3: Renderizar cards usando apenas dados da API**

```html
<h3>{{ jogador.nome }}</h3>
<ul>
  <li>Gols: {{ jogador.gols }}</li>
  <li>Partidas: {{ jogador.partidas }}</li>
  <li>Vitorias: {{ jogador.vitorias }}</li>
</ul>
```

**Step 4: Run test to verify pass**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/**/*.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add pig-league/src/app/modules/jogadores
git commit -m "feat(jogadores-ui): build tactical cards with player stats"
```

### Task 6: Validacao final cruzada

**Files:**
- Modify: `pig-league/src/app/data/jogador/dto/index.ts` (se necessario)
- Modify: `pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.dto.ts` (ajustes finais)

**Step 1: Rodar suite backend de jogadores**

Run: `cd pig-league-api && npm run test -- src/api/campeonato/jogadores`
Expected: PASS

**Step 2: Rodar suite frontend de jogadores**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/data/jogador/**/*.spec.ts --include src/app/modules/jogadores/**/*.spec.ts`
Expected: PASS

**Step 3: Smoke manual da feature**

Run: `cd pig-league && npm run start`
Expected: `/jogadores` carrega cards, metricas corretas e responsividade mobile/desktop.

**Step 4: Commit final de consolidacao**

```bash
git add pig-league pig-league-api
git commit -m "feat(jogadores): deliver cards page and aggregated metrics"
```

