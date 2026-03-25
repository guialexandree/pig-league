# Template Inicial de Layout + Navbar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Iniciar o frontend com dois templates em `src/app/layout`, um navbar com menu de campeonato (Partidas, Classificacao, Jogadores, Estatisticas) e roteamento base funcional.

**Architecture:** A aplicacao usara um template de shell (`main-template`) contendo navbar e `router-outlet`, e um template de secao vazio (`section-template`) reutilizado como placeholder para as quatro rotas iniciais. O navbar sera construido com classes Bootstrap 5 para layout e responsividade, deixando SCSS apenas para ajustes pontuais de identidade visual.

**Tech Stack:** Angular 21 standalone, Angular Router, Bootstrap 5

---

### Task 1: Criar os dois templates base em `layout`

**Files:**
- Create: `src/app/layout/main-template/main-template.ts`
- Create: `src/app/layout/main-template/main-template.html`
- Create: `src/app/layout/main-template/main-template.scss`
- Create: `src/app/layout/main-template/main-template.spec.ts`
- Create: `src/app/layout/section-template/section-template.ts`
- Create: `src/app/layout/section-template/section-template.html`
- Create: `src/app/layout/section-template/section-template.scss`
- Create: `src/app/layout/section-template/section-template.spec.ts`

**Step 1: Write the failing test**

```ts
it('deve criar o MainTemplateComponent', () => {
  expect(component).toBeTruthy();
});
```

```ts
it('deve criar o SectionTemplateComponent', () => {
  expect(component).toBeTruthy();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- --watch=false --runInBand src/app/layout/main-template/main-template.spec.ts src/app/layout/section-template/section-template.spec.ts`
Expected: FAIL (componentes inexistentes).

**Step 3: Write minimal implementation**

```ts
@Component({
  selector: 'app-main-template',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main-template.html',
  styleUrl: './main-template.scss',
})
export class MainTemplateComponent {}
```

```html
<section class="layout-main"></section>
```

```ts
@Component({
  selector: 'app-section-template',
  standalone: true,
  templateUrl: './section-template.html',
  styleUrl: './section-template.scss',
})
export class SectionTemplateComponent {}
```

```html
<section class="layout-section container py-4"></section>
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- --watch=false --runInBand src/app/layout/main-template/main-template.spec.ts src/app/layout/section-template/section-template.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/layout/main-template src/app/layout/section-template
git commit -m "feat(layout): add initial main and section templates"
```

### Task 2: Criar navbar com Bootstrap e menu do campeonato

**Files:**
- Create: `src/app/layout/navbar/navbar.ts`
- Create: `src/app/layout/navbar/navbar.html`
- Create: `src/app/layout/navbar/navbar.scss`
- Create: `src/app/layout/navbar/navbar.spec.ts`

**Step 1: Write the failing test**

```ts
it('deve renderizar os 4 itens de menu obrigatorios', () => {
  const items = fixture.nativeElement.querySelectorAll('[data-testid="menu-item"]');
  expect(items.length).toBe(4);
  expect(items[0].textContent).toContain('Partidas');
  expect(items[1].textContent).toContain('Classificacao');
  expect(items[2].textContent).toContain('Jogadores');
  expect(items[3].textContent).toContain('Estatisticas');
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- --watch=false --runInBand src/app/layout/navbar/navbar.spec.ts`
Expected: FAIL (componente inexistente).

**Step 3: Write minimal implementation**

```ts
readonly menu = [
  { label: 'Partidas', route: '/partidas' },
  { label: 'Classificacao', route: '/classificacao' },
  { label: 'Jogadores', route: '/jogadores' },
  { label: 'Estatisticas', route: '/estatisticas' },
];
```

```html
<nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
  <div class="container">
    <a class="navbar-brand fw-semibold" routerLink="/partidas">Pig League</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav ms-auto gap-lg-2">
        @for (item of menu; track item.route) {
          <li class="nav-item">
            <a class="nav-link" routerLinkActive="active" [routerLink]="item.route" data-testid="menu-item">
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
    </div>
  </div>
</nav>
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- --watch=false --runInBand src/app/layout/navbar/navbar.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/layout/navbar
git commit -m "feat(layout): add bootstrap navbar with campeonato menu"
```

### Task 3: Integrar navbar ao template principal com `router-outlet`

**Files:**
- Modify: `src/app/layout/main-template/main-template.ts`
- Modify: `src/app/layout/main-template/main-template.html`
- Modify: `src/app/layout/main-template/main-template.spec.ts`

**Step 1: Write the failing test**

```ts
it('deve renderizar o navbar e um router-outlet no shell', () => {
  const navbar = fixture.nativeElement.querySelector('app-navbar');
  const outlet = fixture.nativeElement.querySelector('router-outlet');
  expect(navbar).toBeTruthy();
  expect(outlet).toBeTruthy();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- --watch=false --runInBand src/app/layout/main-template/main-template.spec.ts`
Expected: FAIL (navbar ainda nao integrado).

**Step 3: Write minimal implementation**

```ts
imports: [NavbarComponent, RouterOutlet]
```

```html
<app-navbar />
<main class="pb-4">
  <router-outlet />
</main>
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- --watch=false --runInBand src/app/layout/main-template/main-template.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/layout/main-template
git commit -m "feat(layout): compose main template with navbar and router outlet"
```

### Task 4: Configurar rotas iniciais para o menu

**Files:**
- Modify: `src/app/app.routes.ts`
- Create: `src/app/app.routes.spec.ts`

**Step 1: Write the failing test**

```ts
it('deve mapear as rotas do menu para o section-template', () => {
  const paths = routes.flatMap((r) => (r.children ?? []).map((c) => c.path));
  expect(paths).toEqual(['partidas', 'classificacao', 'jogadores', 'estatisticas']);
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- --watch=false --runInBand src/app/app.routes.spec.ts`
Expected: FAIL (rotas ainda vazias).

**Step 3: Write minimal implementation**

```ts
export const routes: Routes = [
  {
    path: '',
    component: MainTemplateComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'partidas' },
      { path: 'partidas', component: SectionTemplateComponent },
      { path: 'classificacao', component: SectionTemplateComponent },
      { path: 'jogadores', component: SectionTemplateComponent },
      { path: 'estatisticas', component: SectionTemplateComponent },
    ],
  },
];
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- --watch=false --runInBand src/app/app.routes.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/app.routes.ts src/app/app.routes.spec.ts
git commit -m "feat(router): add initial campeonato routes for menu sections"
```

### Task 5: Atualizar guia do frontend para priorizar Bootstrap

**Files:**
- Modify: `AGENTS.md`

**Step 1: Write the failing check**

Run: `rg -n "Bootstrap|SCSS" AGENTS.md`
Expected: sem regra explicita de preferencia por Bootstrap.

**Step 2: Implement documentation update**

Adicionar secao curta:

```md
## UI e Estilos

- Priorizar classes utilitarias e componentes do Bootstrap quando atender ao caso.
- Usar SCSS customizado apenas para identidade visual, excecoes de layout e ajustes nao cobertos pelo Bootstrap.
```

**Step 3: Run check to verify it passes**

Run: `rg -n "Priorizar classes utilitarias e componentes do Bootstrap" AGENTS.md`
Expected: 1 match.

**Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs(frontend): add bootstrap-first styling guideline"
```

### Task 6: Verificacao final da base inicial

**Files:**
- Verify: `src/app/layout/*`
- Verify: `src/app/app.routes.ts`
- Verify: `AGENTS.md`

**Step 1: Run focused tests**

Run: `npm run test -- --watch=false --runInBand src/app/layout/main-template/main-template.spec.ts src/app/layout/section-template/section-template.spec.ts src/app/layout/navbar/navbar.spec.ts src/app/app.routes.spec.ts`
Expected: PASS.

**Step 2: Run build**

Run: `npm run build`
Expected: build concluido sem erro.

**Step 3: Commit verification state**

```bash
git add .
git commit -m "chore: validate initial layout and navbar baseline"
```
