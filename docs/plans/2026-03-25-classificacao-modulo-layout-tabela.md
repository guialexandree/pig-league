# Classificacao Modulo + Layout de Tabela Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Entregar a rota `/classificacao` como modulo lazy-loaded em `src/app/modules/classificacao`, consumindo `ClassificacaoService` com filtros `Geral`, `Grupo 1` e `Grupo 2`, com layout de tabela premium inspirado na referencia enviada.

**Architecture:** A rota raiz continua no `MainTemplateComponent`, mas deixa de usar `SectionTemplateComponent` para `classificacao` e passa a carregar `classificacaoRoutes`. A feature segue o padrao atual (`container` + `listagem` standalone), usa signals para estado e chama `ClassificacaoService.getClassificacao()` com `grupoId` opcional. A tela usa barra de filtros no topo e tabela escura com hierarquia visual forte para posicao, time e metricas (V-D, GP, GC, SG).

**Tech Stack:** Angular 21 standalone + Router lazy loading, RxJS (`finalize`), Bootstrap utilitarios, SCSS custom.

---

### Task 1: Estruturar rota lazy da feature Classificacao

**Files:**
- Create: `pig-league/src/app/modules/classificacao/classificacao.routes.ts`
- Create: `pig-league/src/app/modules/classificacao/classificacao.component.ts`
- Modify: `pig-league/src/app/app.routes.ts`

**Step 1: Write the failing test**

```ts
// src/app/app.routes.spec.ts
expect(classificacaoRoute?.loadChildren).toBeDefined();
expect(classificacaoRoute?.component).toBeUndefined();
```

**Step 2: Run test to verify it fails**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/app.routes.spec.ts`
Expected: FAIL porque `classificacao` ainda aponta para `SectionTemplateComponent`.

**Step 3: Write minimal implementation**

```ts
{
  path: 'classificacao',
  loadChildren: () =>
    import('./modules/classificacao/classificacao.routes').then(
      (m) => m.classificacaoRoutes,
    ),
}
```

```ts
export const classificacaoRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./classificacao.component').then((m) => m.ClassificacaoComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./listagem/classificacao-listagem.component').then(
            (m) => m.ClassificacaoListagemComponent,
          ),
      },
    ],
  },
];
```

**Step 4: Run test to verify it passes**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/app.routes.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add pig-league/src/app/app.routes.ts pig-league/src/app/modules/classificacao
git commit -m "feat(classificacao): add lazy-loaded classificacao module"
```

### Task 2: Criar componente de listagem com filtros e integracao de API

**Files:**
- Create: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.ts`
- Create: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`

**Step 1: Write the failing test**

```ts
it('deve carregar classificacao geral na inicializacao', () => {
  expect(serviceMock.getClassificacao).toHaveBeenCalledWith(undefined);
});

it('deve enviar grupoId=1 e grupoId=2 ao trocar filtros', () => {
  // clicar filter-group-1 e filter-group-2
  expect(serviceMock.getClassificacao).toHaveBeenCalledWith({ grupoId: 1 });
  expect(serviceMock.getClassificacao).toHaveBeenCalledWith({ grupoId: 2 });
});
```

**Step 2: Run test to verify it fails**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`
Expected: FAIL porque componente ainda nao existe.

**Step 3: Write minimal implementation**

```ts
type ClassificacaoFiltroUi = 'GERAL' | 1 | 2;

readonly filtros = [
  { label: 'Geral', value: 'GERAL', testId: 'filter-general' },
  { label: 'Grupo 1', value: 1, testId: 'filter-group-1' },
  { label: 'Grupo 2', value: 2, testId: 'filter-group-2' },
] as const;

private toApiFilters(filter: ClassificacaoFiltroUi): LoadClassificacaoFiltersDto | undefined {
  return filter === 'GERAL' ? undefined : { grupoId: filter };
}
```

**Step 4: Run test to verify it passes**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add pig-league/src/app/modules/classificacao/listagem
git commit -m "feat(classificacao-ui): integrate classificacao service with group filters"
```

### Task 3: Implementar layout visual da classificacao (referencia enviada)

**Files:**
- Create: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.html`
- Create: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.scss`

**Step 1: Definir direcao visual escolhida**

```txt
Concept: Arena Ranking Board
- Base dark com gradientes sutis e bordas de contraste baixo
- Barra superior com segment control: Geral | Grupo 1 | Grupo 2
- Tabela em linhas densas com destaque de posicao por barra lateral
- Colunas principais: POSICAO, TIME, V-D, GP, GC, SG
- Estados de loading/erro/vazio no mesmo card para evitar layout shift
```

**Step 2: Estruturar markup com estados e test ids**

```html
<div class="classification-toolbar__filters" role="group" aria-label="Filtros de classificacao">
  <button data-testid="filter-general">Geral</button>
  <button data-testid="filter-group-1">Grupo 1</button>
  <button data-testid="filter-group-2">Grupo 2</button>
</div>
```

```html
@if (carregando()) { ... }
@else if (erro(); as mensagemErro) { ... }
@else if (classificacao().length === 0) { ... }
@else { ...linhas da tabela... }
```

**Step 3: Aplicar SCSS de alta fidelidade ao mock visual**

```scss
.classification-toolbar__filter.is-active {
  background: #ffb006;
  color: #111;
}

.classification-row {
  background: linear-gradient(145deg, rgb(31 34 39 / 74%), rgb(22 24 28 / 74%));
  border: 1px solid rgb(255 255 255 / 8%);
}
```

**Step 4: Run test to verify it passes**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add pig-league/src/app/modules/classificacao/listagem
git commit -m "feat(classificacao-ui): build ranking table layout with segmented filters"
```

### Task 4: Cobrir comportamento de renderizacao da tabela e retry de erro

**Files:**
- Modify: `pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`

**Step 1: Write the failing test**

```ts
it('deve renderizar colunas V-D, GP, GC e SG com valores da API', () => {
  expect(root.querySelector('[data-testid="record"]')?.textContent?.trim()).toBe('3 - 0');
  expect(root.querySelector('[data-testid="goals-for"]')?.textContent?.trim()).toBe('26');
  expect(root.querySelector('[data-testid="goals-against"]')?.textContent?.trim()).toBe('9');
  expect(root.querySelector('[data-testid="goal-diff"]')?.textContent?.trim()).toBe('17');
});

it('deve permitir tentar novamente quando ocorrer erro', () => {
  expect(root.querySelector('[data-testid="error-state"]')).not.toBeNull();
  // clicar retry-load-button e validar segunda chamada
});
```

**Step 2: Run test to verify it fails**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`
Expected: FAIL ate o template expor os seletores e valores esperados.

**Step 3: Write minimal implementation**

```ts
recordLabel(item: GetClassificacaoDto): string {
  return `${item.vitorias} - ${item.derrotas}`;
}
```

```html
<div data-testid="record">{{ recordLabel(item) }}</div>
<div data-testid="goals-for">{{ item.golsPositivo }}</div>
<div data-testid="goals-against">{{ item.golsContra }}</div>
<div data-testid="goal-diff">{{ item.saldoGols }}</div>
```

**Step 4: Run test to verify it passes**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add pig-league/src/app/modules/classificacao/listagem/classificacao-listagem.component.spec.ts
git commit -m "test(classificacao-ui): cover standings columns and retry state"
```

### Task 5: Validacao final e smoke da rota

**Files:**
- Modify: `pig-league/src/app/modules/classificacao/classificacao.routes.ts` (ajustes finais se necessario)
- Modify: `pig-league/src/app/app.routes.ts` (ajustes finais se necessario)

**Step 1: Run data layer tests**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/data/classificacao/classificacao-service.spec.ts`
Expected: PASS

**Step 2: Run feature tests**

Run: `cd pig-league && npm run test -- --watch=false --include src/app/modules/classificacao/**/*.spec.ts`
Expected: PASS

**Step 3: Smoke manual da interface**

Run: `cd pig-league && npm run start`
Expected: acessar `http://localhost:4200/classificacao` e validar:
- filtros no topo (`Geral`, `Grupo 1`, `Grupo 2`)
- troca de filtro atualiza listagem
- layout desktop similar ao mock (tabela dark com linhas destacadas)
- responsivo mobile sem quebra horizontal critica

**Step 4: Commit final de consolidacao**

```bash
git add pig-league/src/app/modules/classificacao pig-league/src/app/app.routes.ts
git commit -m "feat(classificacao): deliver standings module with grouped filters and ranking layout"
```
