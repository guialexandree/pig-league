# Rebalance Tier XP Campeonato Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebalancear a pontuacao de XP/tier para uma temporada real de ate 9 jogos por jogador (6 fase de grupos + 3 playoffs), garantindo tiers alcancaveis e coerentes com performance.

**Architecture:** O backend passara a usar constantes explicitas de balanceamento (resultado, gols, bonus e faixas de tier) calibradas para o limite de jogos do campeonato. O frontend passara a renderizar as regras/faixas com os novos valores, mantendo consistencia visual e de contrato entre API e UI.

**Tech Stack:** NestJS 11 + Jest, Angular 21 standalone + signals, SCSS, Faker.

---

### Task 1: Definir baseline de balanceamento por temporada

**Files:**
- Create: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/jogador-xp-balance.constants.ts`
- Modify: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/jogador-tier.enum.ts`

**Step 1: Write the failing test**

```ts
expect(calcularTier(109)).toBe(JogadorTierEnum.Silver);
expect(calcularTier(110)).toBe(JogadorTierEnum.Gold);
expect(calcularTier(170)).toBe(JogadorTierEnum.Hero);
```

**Step 2: Run test to verify it fails**

Run: `cd /opt/projetos/copa-inside/pig-league-api && NODE_OPTIONS=--experimental-vm-modules npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
Expected: FAIL por limites antigos e/ou constantes inexistentes.

**Step 3: Write minimal implementation**

```ts
export const JogadorXpBalance = {
  resultado: { vitoria: 18, empate: 10, derrota: 6 },
  bonusSaldoVitoria: 6,
  golsFeitosMultiplicador: 2,
  golsSofridosPenalidade: 1,
  xpMinimoPartida: 6,
  tiers: {
    silverMin: 0,
    goldMin: 110,
    heroMin: 170,
  },
} as const;
```

**Step 4: Run test to verify it compiles**

Run: `cd /opt/projetos/copa-inside/pig-league-api && NODE_OPTIONS=--experimental-vm-modules npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
Expected: ainda FAIL (regra ainda nao aplicada no use-case), compilando com baseline novo.

**Step 5: Commit**

```bash
git add /opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/jogador-xp-balance.constants.ts /opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/jogador-tier.enum.ts
git commit -m "feat(jogadores-api): add season-aware xp balance constants"
```

### Task 2: Cobrir cenarios RED de performance (6+3 jogos)

**Files:**
- Modify: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`

**Step 1: Write the failing test**

Adicionar 3 cenarios deterministas:
1. `silver`: campanha fraca (ex.: 1V 1E 7D) => abaixo de 110.
2. `gold`: campanha competitiva (ex.: 4V 2E 3D) => entre 110 e 169.
3. `hero`: campanha elite (ex.: 7V 1E 1D com gols altos) => >= 170.

**Step 2: Run test to verify it fails**

Run: `cd /opt/projetos/copa-inside/pig-league-api && NODE_OPTIONS=--experimental-vm-modules npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
Expected: FAIL por calculo de XP/tier ainda antigo.

**Step 3: Add boundary checks**

```ts
expect(silverPlayer.tier).toBe(JogadorTierEnum.Silver);
expect(goldPlayer.tier).toBe(JogadorTierEnum.Gold);
expect(heroPlayer.tier).toBe(JogadorTierEnum.Hero);
```

**Step 4: Run test and keep RED**

Run: `cd /opt/projetos/copa-inside/pig-league-api && NODE_OPTIONS=--experimental-vm-modules npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
Expected: FAIL consistente ate implementar regra.

**Step 5: Commit**

```bash
git add /opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts
git commit -m "test(jogadores-api): add season performance tier scenarios"
```

### Task 3: Implementar regra nova de XP/tier/progresso no use-case

**Files:**
- Modify: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.ts`
- Modify: `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`

**Step 1: Ajustar calculo de XP por partida**

```ts
xpPartida = xpResultado
  + golsFeitos * JogadorXpBalance.golsFeitosMultiplicador
  - golsSofridos * JogadorXpBalance.golsSofridosPenalidade
  + bonusSaldo;

return Math.max(JogadorXpBalance.xpMinimoPartida, xpPartida);
```

**Step 2: Ajustar tiers por limites novos**

```ts
if (xp >= JogadorXpBalance.tiers.heroMin) return JogadorTierEnum.Hero;
if (xp >= JogadorXpBalance.tiers.goldMin) return JogadorTierEnum.Gold;
return JogadorTierEnum.Silver;
```

**Step 3: Ajustar progresso para novo intervalo**

```ts
// Silver: 0-109 => width 110
// Gold: 110-169 => width 60
// Hero: 170+ => 100%
```

**Step 4: Run tests to verify pass**

Run:
- `cd /opt/projetos/copa-inside/pig-league-api && NODE_OPTIONS=--experimental-vm-modules npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
- `cd /opt/projetos/copa-inside/pig-league-api && NODE_OPTIONS=--experimental-vm-modules npm run test -- src/api/campeonato/jogadores/jogadores.service.spec.ts src/api/campeonato/jogadores/jogadores.controller.spec.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add /opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores
git commit -m "feat(jogadores-api): rebalance xp tiers for 9-match season"
```

### Task 4: Atualizar texto/regras de UI com valores alcancaveis

**Files:**
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/tier-info/tier-info.component.ts`
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/tier-info/tier-info.component.html`
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/tier-info/tier-info.component.scss`

**Step 1: Write the failing test**

```ts
expect(root.textContent).toContain('0 - 109 XP');
expect(root.textContent).toContain('110 - 169 XP');
expect(root.textContent).toContain('170+ XP');
expect(root.textContent).toContain('Vitória +18 XP');
```

**Step 2: Run test to verify it fails**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/tier-info/tier-info.component.spec.ts`
Expected: FAIL por faixas/regras antigas no componente.

**Step 3: Write minimal implementation**

Atualizar labels para refletir exatamente os valores do backend:
- Resultado: `Vitoria +18`, `Empate +10`, `Derrota +6`
- Gols: `+2` feito, `-1` sofrido
- Bonus saldo: `+6`
- XP minimo: `6`
- Tiers: `0-109`, `110-169`, `170+`

**Step 4: Run test to verify it passes**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/tier-info/tier-info.component.spec.ts`
Expected: PASS (ou bloqueio por falhas legadas externas, mantendo evidencia do bloqueio).

**Step 5: Commit**

```bash
git add /opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/tier-info
git commit -m "feat(jogadores-ui): update tier-info with reachable season xp ranges"
```

### Task 5: Sincronizar metadata de tier no data layer frontend

**Files:**
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/data/jogador/dto/jogador-tier.enum.ts`
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.ts`
- Modify: `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`

**Step 1: Write the failing test**

```ts
expect(component.getTierLabel(JogadorTierEnum.Gold)).toBe('Gold');
// opcional: validar helper de faixa por tier se adicionado
```

**Step 2: Run test to verify it fails**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: FAIL se helper/metadado novo ainda nao existir.

**Step 3: Write minimal implementation**

Adicionar metadados de faixa e cor por tier no DTO enum para evitar strings espalhadas na UI.

**Step 4: Run test to verify pass**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: PASS (ou bloqueio por falhas legadas fora do escopo).

**Step 5: Commit**

```bash
git add /opt/projetos/copa-inside/pig-league/src/app/data/jogador/dto/jogador-tier.enum.ts /opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.ts /opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts
git commit -m "refactor(jogadores-ui): centralize tier metadata for range consistency"
```

### Task 6: Validacao cruzada final

**Files:**
- Modify (se necessario): `/opt/projetos/copa-inside/pig-league-api/src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts`
- Modify (se necessario): `/opt/projetos/copa-inside/pig-league/src/app/modules/jogadores/listagem/tier-info/tier-info.component.spec.ts`

**Step 1: Rodar validacao backend focada**

Run: `cd /opt/projetos/copa-inside/pig-league-api && NODE_OPTIONS=--experimental-vm-modules npm run test -- src/api/campeonato/jogadores/use-cases/get-jogadores/get-jogadores.use-case.spec.ts src/api/campeonato/jogadores/jogadores.service.spec.ts src/api/campeonato/jogadores/jogadores.controller.spec.ts`
Expected: PASS.

**Step 2: Rodar build backend**

Run: `cd /opt/projetos/copa-inside/pig-league-api && npm run build`
Expected: PASS.

**Step 3: Rodar build frontend**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run build`
Expected: PASS.

**Step 4: Smoke visual**

Run: `cd /opt/projetos/copa-inside/pig-league && npm run start`
Checklist:
- Reguas de tier exibem `0-109`, `110-169`, `170+`.
- Regras de pontuacao batem com backend (`+18`, `+10`, `+6`, `+2`, `-1`, bonus `+6`, minimo `6`).
- Cards continuam mostrando medalha por tier e fundo correto.

**Step 5: Commit final**

```bash
git add /opt/projetos/copa-inside/pig-league /opt/projetos/copa-inside/pig-league-api
git commit -m "feat(jogadores): rebalance season xp and reachable tiers"
```

---

## Criterios de aceite de produto

- Com maximo de 9 partidas, pelo menos `Gold` precisa ser alcancavel para jogadores de boa campanha.
- `Hero` deve ser alcancavel para campanhas de elite (alta taxa de vitoria + boa performance ofensiva/defensiva).
- A UI deve exibir exatamente os mesmos valores que o backend usa nas regras e faixas.
- Nao pode haver string de regra/threshold divergente entre frontend e backend apos merge.
