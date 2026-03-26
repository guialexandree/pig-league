# Jogadores Tier + XP + Progresso Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expor `tier` no endpoint de jogadores, calcular `xp` por partida com regras de desempenho, retornar progresso para proximo tier e renderizar cards com fundo dinamico (`silver/gold/hero`) e barra de progresso na listagem Angular.

**Architecture:** O backend (NestJS) passa a calcular XP por jogador com base nas partidas realizadas e deriva o tier por faixas fixas (Silver/Gold/Hero), retornando tambem campos de progresso para o frontend nao duplicar regra de negocio. O frontend atualiza DTOs/enums/mocks e passa a renderizar visual do card (imagem de fundo + barra) orientado pelo `tier` e pelos campos de progresso retornados pela API.

**Tech Stack:** NestJS 11 + Jest, Angular 21 standalone + signals, RxJS, SCSS, @faker-js/faker.

---

### Task 1: Definir contrato de Tier/XP (backend + frontend)

**Files:**
- Create: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/jogador-tier.enum.ts`
- Modify: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.dto.ts`
- Create: `/opt/projetos/copa-inside/pig-league/src/app/data/jogador/dto/jogador-tier.enum.ts`
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/data/jogador/dto/get-jogadores.dto.ts`
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/data/jogador/dto/index.ts`

**Step 1: Write the failing test**

```ts
expect(response.jogadores[0]).toEqual(
  expect.objectContaining({
    xp: expect.any(Number),
    tier: expect.any(Number),
    xpAtualNoTier: expect.any(Number),
    xpNecessarioProximoTier: expect.any(Number),
    progressoProximoTierPercentual: expect.any(Number),
  }),
);
```

**Step 2: Run test to verify it fails**

Run: `cd /opt/projetos/copa-inside/pig-league-api && npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
Expected: FAIL por propriedades ausentes no DTO/resposta.

**Step 3: Write minimal implementation**

```ts
export enum JogadorTierEnum {
  Silver = 1,
  Gold = 2,
  Hero = 3,
}

export interface GetJogadorDto {
  id: number;
  nome: string;
  gols: number;
  partidas: number;
  vitorias: number;
  percentualVitoria: number;
  xp: number;
  tier: JogadorTierEnum;
  xpAtualNoTier: number;
  xpNecessarioProximoTier: number;
  progressoProximoTierPercentual: number;
}
```

**Step 4: Run test to verify it compiles**

Run: `cd /opt/projetos/copa-inside/pig-league-api && npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
Expected: ainda FAIL (regra nao implementada), mas compilando com contrato novo.

**Step 5: Commit**

```bash
git add \
  /opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.dto.ts \
  /opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/jogador-tier.enum.ts \
  /opt/projetos/copa-inside/pig-league/src/app/data/jogador/dto

git commit -m "feat(jogadores-contract): add tier and xp progress fields"
```

### Task 2: Cobrir regras de XP por partida no use case (RED)

**Files:**
- Modify: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`

**Step 1: Write the failing test**

```ts
it('deve calcular XP por partida com minimo 5, bonus por saldo >= 3 e penalidade por gols sofridos', async () => {
  // montar partidas com: vitoria, empate e derrota
  // validar soma de XP esperada por jogador
});
```

Casos minimos no teste:
- Vitoria: `+30`
- Empate: `+10`
- Derrota: `+5`
- Gol feito: `+2` por gol
- Gol sofrido: `-1` por gol
- Vitoria com saldo >= 3: `+10`
- Clamp final por partida: `Math.max(5, xpPartida)`

**Step 2: Run test to verify it fails**

Run: `cd /opt/projetos/copa-inside/pig-league-api && npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
Expected: FAIL com XP calculado divergente/ausente.

**Step 3: Add explicit expected numbers in spec**

```ts
expect(jogadorPrimeiro.xp).toBe(61); // exemplo: 48 + 13
expect(jogadorSegundo.xp).toBe(17);  // exemplo: 12 + 5 (minimo aplicado)
```

**Step 4: Run test to keep RED deterministic**

Run: `cd /opt/projetos/copa-inside/pig-league-api && npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
Expected: FAIL consistente antes da implementacao.

**Step 5: Commit**

```bash
git add /opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts
git commit -m "test(jogadores): cover xp formula and min xp per match"
```

### Task 3: Implementar calculo de XP, tier e progresso no backend

**Files:**
- Modify: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.ts`
- Modify: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.dto.ts`
- Modify: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`

**Step 1: Implement helper de XP por partida**

```ts
private calcularXpPartida(resultado: 'VITORIA' | 'EMPATE' | 'DERROTA', golsFeitos: number, golsSofridos: number): number {
  const xpResultado = resultado === 'VITORIA' ? 30 : resultado === 'EMPATE' ? 10 : 5;
  const saldo = golsFeitos - golsSofridos;
  const bonusSaldo = resultado === 'VITORIA' && saldo >= 3 ? 10 : 0;
  const xpBruto = xpResultado + golsFeitos * 2 - golsSofridos + bonusSaldo;

  return Math.max(5, xpBruto);
}
```

**Step 2: Implement helper de tier**

```ts
private resolverTier(xp: number): JogadorTierEnum {
  if (xp >= 2000) return JogadorTierEnum.Hero;
  if (xp >= 1000) return JogadorTierEnum.Gold;
  return JogadorTierEnum.Silver;
}
```

**Step 3: Implement helper de progresso por tier**

```ts
private calcularProgressoTier(xp: number, tier: JogadorTierEnum) {
  if (tier === JogadorTierEnum.Hero) {
    return { xpAtualNoTier: xp - 2000, xpNecessarioProximoTier: 0, progressoProximoTierPercentual: 100 };
  }

  const minimo = tier === JogadorTierEnum.Silver ? 0 : 1000;
  const maximoExclusivo = tier === JogadorTierEnum.Silver ? 1000 : 2000;
  const xpAtualNoTier = Math.max(0, xp - minimo);
  const xpNecessarioProximoTier = maximoExclusivo - minimo;
  const progressoProximoTierPercentual = Number(
    ((xpAtualNoTier / xpNecessarioProximoTier) * 100).toFixed(2),
  );

  return { xpAtualNoTier, xpNecessarioProximoTier, progressoProximoTierPercentual };
}
```

**Step 4: Run tests to verify pass**

Run:
- `cd /opt/projetos/copa-inside/pig-league-api && npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
- `cd /opt/projetos/copa-inside/pig-league-api && npm run test -- src/api/campeonato/jogadores/jogadores.service.spec.ts`
- `cd /opt/projetos/copa-inside/pig-league-api && npm run test -- src/api/campeonato/jogadores/jogadores.controller.spec.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add /opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores
git commit -m "feat(jogadores-api): calculate xp tier and next-tier progress"
```

### Task 4: Atualizar mocks e testes do data layer no frontend

**Files:**
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/data/jogador/mocks/get-jogadores.mock.ts`
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/data/jogador/mocks/index.ts`
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/data/jogador/jogador-service.spec.ts`

**Step 1: Write the failing test**

```ts
expect(actual?.jogadores[0]).toEqual(
  expect.objectContaining({
    tier: JogadorTierEnum.Silver,
    xp: expect.any(Number),
    progressoProximoTierPercentual: expect.any(Number),
  }),
);
```

**Step 2: Run test to verify it fails**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/data/jogador/jogador-service.spec.ts`
Expected: FAIL por mock/fixture sem novos campos.

**Step 3: Write minimal implementation**

```ts
export function generateGetJogadorDto(overrides: Partial<GetJogadorDto> = {}): GetJogadorDto {
  return {
    id: faker.number.int({ min: 1, max: 200 }),
    nome: faker.person.fullName(),
    gols: faker.number.int({ min: 0, max: 60 }),
    partidas: faker.number.int({ min: 0, max: 40 }),
    vitorias: faker.number.int({ min: 0, max: 40 }),
    percentualVitoria: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
    xp: faker.number.int({ min: 0, max: 3500 }),
    tier: faker.helpers.arrayElement([JogadorTierEnum.Silver, JogadorTierEnum.Gold, JogadorTierEnum.Hero]),
    xpAtualNoTier: faker.number.int({ min: 0, max: 999 }),
    xpNecessarioProximoTier: 1000,
    progressoProximoTierPercentual: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
    ...overrides,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/data/jogador/jogador-service.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add /opt/projetos/copa-inside/pig-league/src/app/data/jogador
git commit -m "test(jogador-data): update dto mocks and service spec for tier xp"
```

### Task 5: Criar testes de UI para fundo por tier e barra de progresso (RED)

**Files:**
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`

**Step 1: Write the failing test**

```ts
it('deve aplicar fundo do card conforme tier', () => {
  const cardSilver = root.querySelector('[data-testid="player-card-1"]') as HTMLElement;
  expect(cardSilver.getAttribute('data-tier')).toBe(String(JogadorTierEnum.Silver));
});

it('deve exibir barra de progresso com percentual do backend', () => {
  const progress = root.querySelector('[data-testid="player-tier-progress-fill-1"]') as HTMLElement;
  expect(progress.style.width).toBe('35%');
});
```

**Step 2: Run test to verify it fails**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: FAIL (atributos/elementos ainda nao existem).

**Step 3: Preparar payload deterministico no spec**

```ts
jogadores: [
  { id: 1, nome: faker.person.fullName(), tier: JogadorTierEnum.Silver, xp: 350, xpAtualNoTier: 350, xpNecessarioProximoTier: 1000, progressoProximoTierPercentual: 35, ... },
  { id: 2, nome: faker.person.fullName(), tier: JogadorTierEnum.Gold, xp: 1350, xpAtualNoTier: 350, xpNecessarioProximoTier: 1000, progressoProximoTierPercentual: 35, ... },
  { id: 3, nome: faker.person.fullName(), tier: JogadorTierEnum.Hero, xp: 2350, xpAtualNoTier: 350, xpNecessarioProximoTier: 0, progressoProximoTierPercentual: 100, ... },
]
```

**Step 4: Run test and keep RED**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: FAIL ate implementar template/scss.

**Step 5: Commit**

```bash
git add /opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts
git commit -m "test(jogadores-ui): add tier background and progress bar expectations"
```

### Task 6: Implementar card com fundo dinamico (silver/gold/hero) e barra de progresso

**Files:**
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.ts`
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.html`
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.scss`

**Step 1: Expor enum + helpers no component**

```ts
readonly jogadorTierEnum = JogadorTierEnum;

getTierProgressWidth(percentual: number): string {
  const safe = Math.min(Math.max(percentual, 0), 100);
  return `${safe}%`;
}
```

**Step 2: Ajustar template para tier + progresso**

```html
<article
  class="player-card player-card--portrait"
  [attr.data-tier]="jogador.tier"
  [attr.data-testid]="'player-card-' + jogador.id"
>
...
<div class="player-tier-progress" [attr.data-testid]="'player-tier-progress-' + jogador.id">
  <div
    class="player-tier-progress__fill"
    [attr.data-testid]="'player-tier-progress-fill-' + jogador.id"
    [style.width]="getTierProgressWidth(jogador.progressoProximoTierPercentual)"
  ></div>
</div>
```

**Step 3: Mapear fundo por tier no SCSS**

```scss
.player-card--portrait::before {
  background:
    linear-gradient(180deg, rgb(8 10 14 / 12%), rgb(8 10 14 / 46%)),
    center / contain no-repeat var(--player-card-tier-bg, url('/assets/img/hero.png'));
}

.player-card[data-tier='1'] { --player-card-tier-bg: url('/assets/img/silver.png'); }
.player-card[data-tier='2'] { --player-card-tier-bg: url('/assets/img/gold.png'); }
.player-card[data-tier='3'] { --player-card-tier-bg: url('/assets/img/hero.png'); }
```

**Step 4: Run UI tests**

Run:
- `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
- `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/data/jogador/**/*.spec.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add /opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem
git commit -m "feat(jogadores-ui): render tier background and xp progress bar"
```

### Task 7: Validacao integrada e smoke

**Files:**
- Modify (se necessario): `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
- Modify (se necessario): `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`

**Step 1: Rodar suite backend de jogadores**

Run: `cd /opt/projetos/copa-inside/pig-league-api && npm run test -- src/api/campeonato/jogadores`
Expected: PASS.

**Step 2: Rodar suite frontend de jogadores**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/data/jogador/**/*.spec.ts --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: PASS.

**Step 3: Smoke manual em runtime**

Run frontend: `cd /opt/projetos/copa-inside/pig-league && npm run start`
Checklist visual:
- Jogador Silver usa `/assets/img/silver.png`.
- Jogador Gold usa `/assets/img/gold.png`.
- Jogador Hero usa `/assets/img/hero.png`.
- Barra mostra `35%` para exemplo de `xp=1350`.

**Step 4: Validar payload real da API**

Run API: `cd /opt/projetos/copa-inside/pig-league-api && npm run start:dev`
Verificar `GET /campeonato/jogadores` retornando campos novos por jogador.

**Step 5: Commit final**

```bash
git add /opt/projetos/copa-inside/pig-league /opt/projetos/copa-inside/pig-league-api
git commit -m "feat(jogadores): add tier-based cards with xp progression"
```

---

## Formula de negocio (referencia rapida)

- `XP partida = max(5, XPResultado + (golsFeitos * 2) - golsSofridos + bonusSaldo)`
- `XPResultado`: vitoria `30`, empate `10`, derrota `5`
- `bonusSaldo`: `10` se vitoria com saldo `>= 3`
- Tier:
  - `Silver (1)`: `0-999`
  - `Gold (2)`: `1000-1999`
  - `Hero (3)`: `>= 2000`
- Progresso para proximo tier:
  - `xpAtualNoTier = xp - xpMinimoTier`
  - `xpNecessarioProximoTier = xpMaximoExclusivoTier - xpMinimoTier`
  - `progresso(%) = (xpAtualNoTier / xpNecessarioProximoTier) * 100`
  - Hero: progresso fixo `100%` (nao ha proximo tier)
