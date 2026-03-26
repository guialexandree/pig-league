# Jogadores Portrait Gamer Cards Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesenhar a listagem de jogadores para cards em orientacao retrato, com visual gamer sofisticado, fundo inspirado no header atual e area de foto preparada para imagens futuras sem cobertura total por indicadores.

**Architecture:** Manter o componente standalone atual e reorganizar cada card em camadas: backdrop tematico, palco de retrato (placeholder agora, imagem real depois) e painel de metricas ancorado na base ocupando so uma faixa inferior. A estrutura nova preserva os estados de loading/erro/vazio e inclui animacoes de entrada, brilho diagonal e hover com fallback para `prefers-reduced-motion`.

**Tech Stack:** Angular 21 (standalone component + control flow), SCSS, utilitarios Bootstrap existentes, testes unitarios com `ng test` (Vitest builder).

---

## Direcao visual e abordagem recomendada

### Opcao recomendada: Tactical Poster Portrait
- Card vertical (aprox. 3:4) com area principal de retrato limpa.
- Fundo com diagonais e glow inspirado no header, mas em camadas mais sutis.
- Indicadores em faixa inferior translucida (nao cobrindo toda a area de imagem).
- Micro-animacoes focadas: reveal em stagger, sweep de brilho e hover com leve parallax.

### Opcao alternativa: Split Medal Board
- Card dividido em topo visual + base estatistica com maior contraste.
- Menos imersivo que a opcao recomendada, mas mais simples de manter.

A implementacao abaixo assume a opcao recomendada.

### Task 1: Garantir contrato de layout retrato no HTML e testes

**Files:**
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.html`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
- Test: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`

**Step 1: Escrever teste que falha para a nova estrutura retrato**

Adicionar assertions para verificar, por card:
- container retrato (`data-testid="player-portrait-shell-<id>"`)
- area de media (`data-testid="player-media-<id>"`)
- painel inferior de metricas (`data-testid="player-stats-band-<id>"`)

**Step 2: Rodar teste para confirmar falha**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: FAIL com seletores novos inexistentes.

**Step 3: Implementar estrutura minima no template**

No `html`, reorganizar cada card em:
- `figure` retrato com pseudo background e slot de imagem futura
- selo/rank e nome no topo sem bloquear a area central
- `footer` de metricas em banda inferior (gols, partidas, vitorias, percentual)

**Step 4: Rodar teste para validar passagem**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: PASS no novo teste estrutural.

**Step 5: Commit**

```bash
cd pig-league
git add src/app/modules/jogadores/listagem/jogadores-listagem.component.html \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts
git commit -m "feat(jogadores): define portrait card structure"
```

### Task 2: Implementar visual gamer sofisticado com fundo inspirado no header

**Files:**
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.scss`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.html`
- Test: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`

**Step 1: Escrever teste que falha para classes-chave de estilo**

Adicionar assertions para classes obrigatorias:
- `player-card--portrait`
- `player-media-stage`
- `player-stats-band`

**Step 2: Rodar teste para confirmar falha**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: FAIL por classes nao aplicadas.

**Step 3: Aplicar SCSS do novo tema**

Criar sistema visual com variaveis locais:
- gradientes diagonais + grade sutil + brilho em movimento lento
- card retrato com borda de energia, sombras e profundidade
- area de retrato ocupando maior parte do card
- banda inferior translucida limitada a ~30-36% da altura

**Step 4: Ajustar HTML para ligar classes novas**

Aplicar classes de estilo no markup para refletir a arquitetura de camadas.

**Step 5: Rodar testes novamente**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: PASS com classes estruturais presentes.

**Step 6: Commit**

```bash
cd pig-league
git add src/app/modules/jogadores/listagem/jogadores-listagem.component.html \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.scss \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts
git commit -m "feat(jogadores): add tactical portrait visual system"
```

### Task 3: Preparar placeholder de imagem e evitar sobreposicao total dos indicadores

**Files:**
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.ts`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.html`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.scss`
- Test: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`

**Step 1: Escrever teste que falha para fallback visual de retrato**

Adicionar teste para validar placeholder quando nao ha imagem:
- iniciais do jogador visiveis no palco de retrato
- `aria-label` descritivo para acessibilidade

**Step 2: Rodar teste para confirmar falha**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: FAIL (helper e markup ainda inexistentes).

**Step 3: Implementar helper minimo no TS**

Adicionar metodo utilitario para iniciais seguras (1-2 letras) e sanitizacao.

**Step 4: Integrar placeholder no HTML e SCSS**

- palco central com avatar placeholder estilizado
- manter painel de metricas somente na base
- garantir que pseudo-elementos de overlay nao ultrapassem a banda inferior

**Step 5: Rodar teste para validar passagem**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: PASS com fallback funcional.

**Step 6: Commit**

```bash
cd pig-league
git add src/app/modules/jogadores/listagem/jogadores-listagem.component.ts \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.html \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.scss \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts
git commit -m "feat(jogadores): add portrait placeholder and non-overlapping stats band"
```

### Task 4: Animacoes, responsividade e hardening final

**Files:**
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.scss`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.html`
- Test: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`

**Step 1: Escrever teste que falha para hooks de animacao**

Validar classes/hook attributes para:
- stagger de entrada por indice
- elemento de brilho diagonal decorativo

**Step 2: Rodar teste para confirmar falha**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: FAIL por hooks ausentes.

**Step 3: Implementar animacoes e fallback de movimento reduzido**

No SCSS:
- keyframes de reveal e glow sweep
- delays progressivos com CSS custom properties por card
- bloco `@media (prefers-reduced-motion: reduce)` removendo animacoes nao essenciais

**Step 4: Ajustar breakpoints para retrato em desktop e mobile**

- desktop: cards 3:4 em grid com densidade equilibrada
- tablet/mobile: 1 coluna ou 2 colunas conforme largura, mantendo proporcao retrato

**Step 5: Rodar suite da spec do componente**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: PASS.

**Step 6: Rodar build para smoke final**

Run: `cd pig-league && npm run build`
Expected: Build concluido sem erros.

**Step 7: Commit**

```bash
cd pig-league
git add src/app/modules/jogadores/listagem/jogadores-listagem.component.html \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.scss \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts
git commit -m "feat(jogadores): add portrait animations and responsive polish"
```

### Task 5: Revisao visual guiada (manual) antes de merge

**Files:**
- Validate: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.html`
- Validate: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.scss`

**Step 1: Rodar app local para inspecao visual**

Run: `cd pig-league && npm start`
Expected: pagina de jogadores carregando com cards retrato.

**Step 2: Checklist visual obrigatorio**

Validar:
- fundo do card coeso com o header
- area principal do retrato livre para foto futura
- indicadores limitados a banda inferior
- animacoes suaves e nao intrusivas
- leitura boa em desktop e mobile

**Step 3: Commit de ajustes finais (se houver)**

```bash
cd pig-league
git add src/app/modules/jogadores/listagem/jogadores-listagem.component.html \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.scss \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.ts \
        src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts
git commit -m "chore(jogadores): final visual tune for portrait cards"
```
