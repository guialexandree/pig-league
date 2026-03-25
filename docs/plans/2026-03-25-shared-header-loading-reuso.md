# Header e Loading Compartilhados (Listagens) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extrair o header de jogadores para um componente generico em `modules/shared/components`, extrair o loading de tela da classificacao para shared, reutilizar ambos em `/jogadores`, `/classificacao` e `/partidas`, e trocar o logo do navbar para `src/assets/img/controle.png`.

**Architecture:** Criar dois componentes standalone compartilhados (`listagem-header` e `screen-loader`) com `@Input()` para titulo/subtitulo, exibicao de logo, mensagem de loading e prefixo de `data-testid`. As telas de listagem passam a consumir os componentes shared e removem marcacoes/estilos duplicados locais. A logica de fallback de logo fica encapsulada nos componentes shared para manter comportamento consistente.

**Tech Stack:** Angular 21 standalone components, SCSS, TestBed/Vitest (`ng test` builder), Bootstrap utilitarios existentes.

---

## Premissas de execucao

- O diretorio `pig-league/src/app/modules/shared/components` ainda nao existe e sera criado.
- O reuso de loading em "demais telas" sera aplicado em `/classificacao`, `/partidas` e `/jogadores` (todas listagens afetadas neste pedido).
- O header generico mantera estilo visual escuro atual e permitira variar texto e presenca de logo via `@Input()`.

### Task 1: Criar estrutura shared e testes iniciais do header generico

**Files:**
- Create: `pig-league/src/app/modules/shared/components/listagem-header/listagem-header.component.ts`
- Create: `pig-league/src/app/modules/shared/components/listagem-header/listagem-header.component.html`
- Create: `pig-league/src/app/modules/shared/components/listagem-header/listagem-header.component.scss`
- Create: `pig-league/src/app/modules/shared/components/listagem-header/listagem-header.component.spec.ts`

**Step 1: Escrever teste que falha para API do componente**

Cobrir no spec:
- renderiza `eyebrow` e `title` via input
- exibe logo quando `showLogo=true`
- nao exibe logo quando `showLogo=false`
- aplica fallback de `logoSources` em evento `error`

**Step 2: Rodar teste para confirmar falha**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/shared/components/listagem-header/listagem-header.component.spec.ts`
Expected: FAIL (componente ainda nao implementado).

**Step 3: Implementar componente minimo com inputs**

No `ts`, implementar ao menos:

```ts
readonly defaultLogoSources = ['/assets/img/logo.png', 'assets/img/logo.png', '/browser/assets/img/logo.png'];

@Input() eyebrow = '';
@Input() title = '';
@Input() showLogo = true;
@Input() logoAlt = 'Pig League';
@Input() logoSources: string[] = this.defaultLogoSources;
@Input() testIdPrefix = 'listagem-hero';
```

No `html`, usar seletores estaveis com `data-testid` derivados de `testIdPrefix`.

**Step 4: Rodar teste para validar passagem**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/shared/components/listagem-header/listagem-header.component.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
cd pig-league
git add src/app/modules/shared/components/listagem-header
git commit -m "feat(shared): add generic listagem header component"
```

### Task 2: Migrar headers de jogadores, classificacao e partidas para o shared

**Files:**
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.ts`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.html`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.scss`
- Modify: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.ts`
- Modify: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.html`
- Modify: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.scss`
- Modify: `pig-league/src/app/modules/partidas/listagem/partidas-listagem.component.ts`
- Modify: `pig-league/src/app/modules/partidas/listagem/partidas-listagem.component.html`
- Modify: `pig-league/src/app/modules/partidas/listagem/partidas-listagem.component.scss`
- Delete: `pig-league/src/app/modules/jogadores/listagem/header/jogadores-listagem-header.component.ts`
- Delete: `pig-league/src/app/modules/jogadores/listagem/header/jogadores-listagem-header.component.html`
- Delete: `pig-league/src/app/modules/jogadores/listagem/header/jogadores-listagem-header.component.scss`

**Step 1: Escrever/ajustar testes para uso do componente compartilhado**

- Em `jogadores-listagem.component.spec.ts`, trocar assert de `app-jogadores-listagem-header` para `app-listagem-header`.
- Validar `data-testid` do logo com prefixo especifico por tela (ex.: `players-hero-logo`).

**Step 2: Rodar teste para confirmar falha antes da migracao**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: FAIL enquanto template/import nao forem atualizados.

**Step 3: Implementar migracao do header nas 3 telas**

- Importar `ListagemHeaderComponent` nos 3 componentes de listagem.
- Substituir blocos `<header ...>` locais por `<app-listagem-header ...>`.
- Definir inputs por tela:
  - Jogadores: `eyebrow="PLAYERS"`, `title="JOGADORES"`, `showLogo=true`, `testIdPrefix="players"`
  - Classificacao: `eyebrow="RANKING"`, `title="CLASSIFICACAO"`, `showLogo=false`, `testIdPrefix="classification"`
  - Partidas: `eyebrow="MATCHES"`, `title="JOGOS"`, `showLogo=false`, `testIdPrefix="matches"`
- Remover CSS duplicado `.players-hero`, `.classification-hero`, `.matches-hero` das telas.

**Step 4: Rodar testes das 3 listagens**

Run:
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/partidas/listagem/partidas-listagem.compoenent.spec.ts`
Expected: PASS para regressao de renderizacao.

**Step 5: Commit**

```bash
cd pig-league
git add src/app/modules/jogadores/listagem src/app/modules/classificacao/listagem src/app/modules/partidas/listagem
git rm src/app/modules/jogadores/listagem/header/jogadores-listagem-header.component.ts \
       src/app/modules/jogadores/listagem/header/jogadores-listagem-header.component.html \
       src/app/modules/jogadores/listagem/header/jogadores-listagem-header.component.scss
git commit -m "refactor(listagens): reuse shared generic header"
```

### Task 3: Extrair loader de tela da classificacao para shared

**Files:**
- Create: `pig-league/src/app/modules/shared/components/screen-loader/screen-loader.component.ts`
- Create: `pig-league/src/app/modules/shared/components/screen-loader/screen-loader.component.html`
- Create: `pig-league/src/app/modules/shared/components/screen-loader/screen-loader.component.scss`
- Create: `pig-league/src/app/modules/shared/components/screen-loader/screen-loader.component.spec.ts`

**Step 1: Escrever teste que falha para loader compartilhado**

Cobrir:
- renderizacao condicional via `visible`
- mensagem configuravel via `message`
- fallback de logo via `logoSources`
- atributos de acessibilidade (`aria-live`, `aria-busy`)

**Step 2: Rodar teste para confirmar falha**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/shared/components/screen-loader/screen-loader.component.spec.ts`
Expected: FAIL.

**Step 3: Implementar componente minimo com inputs**

No `ts`, implementar ao menos:

```ts
@Input() visible = false;
@Input() message = 'Carregando...';
@Input() logoAlt = 'Pig League';
@Input() logoSources: string[] = ['/assets/img/logo.png', 'assets/img/logo.png', '/browser/assets/img/logo.png'];
@Input() testIdPrefix = 'screen-loader';
```

No `html`, encapsular estrutura do loader que hoje existe em `classificacao-listagem.component.html`.

**Step 4: Rodar teste para validar passagem**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/shared/components/screen-loader/screen-loader.component.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
cd pig-league
git add src/app/modules/shared/components/screen-loader
git commit -m "feat(shared): add reusable screen loader component"
```

### Task 4: Aplicar screen-loader shared em classificacao, partidas e jogadores

**Files:**
- Modify: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.ts`
- Modify: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.html`
- Modify: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.scss`
- Modify: `pig-league/src/app/modules/partidas/listagem/partidas-listagem.component.ts`
- Modify: `pig-league/src/app/modules/partidas/listagem/partidas-listagem.component.html`
- Modify: `pig-league/src/app/modules/partidas/listagem/partidas-listagem.component.scss`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.ts`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.html`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.scss`
- Modify: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`
- Modify: `pig-league/src/app/modules/partidas/listagem/partidas-listagem.compoenent.spec.ts`
- Modify: `pig-league/src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`

**Step 1: Ajustar testes para componente de loading compartilhado**

- Atualizar seletores para `data-testid` do shared loader (ex.: `classification-screen-loader`, `matches-screen-loader`, `players-screen-loader`).
- Preservar teste de fallback de logo da classificacao agora no componente shared.

**Step 2: Rodar testes para confirmar falha antes da troca**

Run:
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/partidas/listagem/partidas-listagem.compoenent.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: FAIL por seletor/markup antigo.

**Step 3: Integrar shared loader nas telas**

- Classificacao: substituir bloco `@if (carregandoTela())` pelo componente shared.
- Partidas: substituir loading textual do card por loader shared de tela durante `carregando()`.
- Jogadores: substituir loading textual por loader shared de tela durante `carregando()`.
- Remover logica duplicada de fallback de logo dos componentes de tela quando nao for mais necessaria.

**Step 4: Rodar testes novamente**

Run:
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/partidas/listagem/partidas-listagem.compoenent.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
cd pig-league
git add src/app/modules/classificacao/listagem \
        src/app/modules/partidas/listagem \
        src/app/modules/jogadores/listagem
git commit -m "refactor(listagens): reuse shared screen loader"
```

### Task 5: Trocar logo do navbar para controle.png

**Files:**
- Modify: `pig-league/src/app/layout/navbar/navbar.html`
- Modify: `pig-league/src/app/layout/navbar/navbar.spec.ts`

**Step 1: Ajustar teste do navbar para novo src de logo**

Adicionar/atualizar assert para `img.brand__crest[src="/assets/img/controle.png"]`.

**Step 2: Rodar teste para confirmar falha**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/layout/navbar/navbar.spec.ts`
Expected: FAIL antes da alteracao no HTML.

**Step 3: Atualizar template do navbar**

Trocar `src="icons/android-chrome-192x192.png"` por `src="/assets/img/controle.png"` e manter `alt` semantico.

**Step 4: Rodar teste para validar passagem**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/layout/navbar/navbar.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
cd pig-league
git add src/app/layout/navbar/navbar.html src/app/layout/navbar/navbar.spec.ts
git commit -m "feat(navbar): use controle image as brand logo"
```

### Task 6: Verificacao integrada e limpeza final

**Files:**
- Validate: `pig-league/src/app/modules/shared/components/listagem-header/*`
- Validate: `pig-league/src/app/modules/shared/components/screen-loader/*`
- Validate: `pig-league/src/app/modules/jogadores/listagem/*`
- Validate: `pig-league/src/app/modules/classificacao/listagem/*`
- Validate: `pig-league/src/app/modules/partidas/listagem/*`
- Validate: `pig-league/src/app/layout/navbar/*`

**Step 1: Rodar suite focada dos arquivos impactados**

Run:
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/shared/components/listagem-header/listagem-header.component.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/shared/components/screen-loader/screen-loader.component.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/jogadores/listagem/jogadores-listagem.component.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/modules/partidas/listagem/partidas-listagem.compoenent.spec.ts`
- `cd pig-league && npm run test -- --watch=false --include src/app/layout/navbar/navbar.spec.ts`
Expected: PASS em todos os specs alvo.

**Step 2: Rodar build de smoke**

Run: `cd pig-league && npm run build`
Expected: build concluido sem erros de template/style/typecheck.

**Step 3: Revisao manual rapida das 3 rotas e navbar**

Run: `cd pig-league && npm start`
Checklist:
- `/jogadores`, `/classificacao`, `/partidas` exibem header compartilhado com textos corretos.
- loading compartilhado aparece/desaparece sem flicker indevido.
- navbar exibe `controle.png` corretamente no desktop e mobile.

**Step 4: Commit final de integracao (se necessario)**

```bash
cd pig-league
git add src/app/modules/shared/components src/app/modules src/app/layout/navbar
git commit -m "refactor(ui): share listagem header and loader across pages"
```
