# Campeonato Data Modules Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Estruturar o frontend para consumir os endpoints de classificacao, jogadores e partidas do campeonato, com DTOs, mocks e services testados.

**Architecture:** A camada `src/app/data` vai concentrar contratos (DTO), mocks e services HTTP por dominio (`classificacao`, `jogador`, `partida`). Cada dominio tera testes unitarios de consumo de endpoint e serializacao de filtros. A feature `src/app/partida` sera criada como modulo/facade de consumo da camada `data/partida`.

**Tech Stack:** Angular 21 (standalone), HttpClient, RxJS, Vitest/TestBed

---

### Task 1: Preparar infraestrutura HTTP e organizacao de `data`

**Files:**
- Modify: `src/app/app.config.ts`
- Create: `src/app/data/http/api-base-url.token.ts`
- Create: `src/app/data/http/index.ts`
- Test: `src/app/app.spec.ts`

**Step 1: Write the failing test**

```ts
it('deve registrar HttpClient no appConfig', () => {
  const providers = appConfig.providers ?? [];
  expect(providers.length).toBeGreaterThan(0);
  // falha ate incluir provideHttpClient
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- --watch=false --runInBand src/app/app.spec.ts`
Expected: FAIL indicando ausencia de provider HTTP esperado.

**Step 3: Write minimal implementation**

```ts
providers: [
  provideBrowserGlobalErrorListeners(),
  provideHttpClient(),
  provideRouter(routes),
]
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- --watch=false --runInBand src/app/app.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/app.config.ts src/app/app.spec.ts src/app/data/http
git commit -m "feat(data): add base http providers and token"
```

### Task 2: Finalizar `data/classificacao` para consumo de `/campeonato/classificacao`

**Files:**
- Modify: `src/app/data/classificacao/classificacao.ts`
- Modify: `src/app/data/classificacao/classificacao.spec.ts`
- Create: `src/app/data/classificacao/dto/get-classificacao.dto.ts`
- Create: `src/app/data/classificacao/dto/get-classificacao-filtros.dto.ts`
- Modify: `src/app/data/classificacao/dto/index.ts`
- Create: `src/app/data/classificacao/mocks/get-classificacao.dto.ts`
- Modify: `src/app/data/classificacao/mocks/index.ts`

**Step 1: Write the failing test**

```ts
it('deve chamar GET /campeonato/classificacao com grupoId quando informado', () => {
  // espera URL e query param corretos
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- --watch=false --runInBand src/app/data/classificacao/classificacao.spec.ts`
Expected: FAIL por service sem metodo `getClassificacao`.

**Step 3: Write minimal implementation**

```ts
getClassificacao(filters?: LoadClassificacaoFiltersDto) {
  return this.http.get<GetClassificacaoDto>(`${this.baseUrl}/campeonato/classificacao`, {
    params: filters?.grupoId ? { grupoId: String(filters.grupoId) } : {},
  });
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- --watch=false --runInBand src/app/data/classificacao/classificacao.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/data/classificacao
git commit -m "feat(data/classificacao): add typed dto, mocks and api client"
```

### Task 3: Criar modulo `data/jogador` para consumo de `/campeonato/jogadores`

**Files:**
- Create: `src/app/data/jogador/jogador.ts`
- Create: `src/app/data/jogador/jogador.spec.ts`
- Create: `src/app/data/jogador/dto/get-jogadores.dto.ts`
- Create: `src/app/data/jogador/dto/index.ts`
- Create: `src/app/data/jogador/mocks/get-jogadores.dto.ts`
- Create: `src/app/data/jogador/mocks/index.ts`

**Step 1: Write the failing test**

```ts
it('deve chamar GET /campeonato/jogadores', () => {
  // espera metodo GET com payload GetJogadoresDto
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- --watch=false --runInBand src/app/data/jogador/jogador.spec.ts`
Expected: FAIL por arquivos/metodos inexistentes.

**Step 3: Write minimal implementation**

```ts
getJogadores() {
  return this.http.get<GetJogadoresDto>(`${this.baseUrl}/campeonato/jogadores`);
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- --watch=false --runInBand src/app/data/jogador/jogador.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/data/jogador
git commit -m "feat(data/jogador): add jogadores client, dto and mocks"
```

### Task 4: Criar modulo `data/partida` para consumo de `/campeonato/partidas`

**Files:**
- Create: `src/app/data/partida/partida.ts`
- Create: `src/app/data/partida/partida.spec.ts`
- Create: `src/app/data/partida/dto/get-partidas.dto.ts`
- Create: `src/app/data/partida/dto/get-partidas-filtros.dto.ts`
- Create: `src/app/data/partida/dto/partida-status.enum.ts`
- Create: `src/app/data/partida/dto/index.ts`
- Create: `src/app/data/partida/mocks/get-partidas.dto.ts`
- Create: `src/app/data/partida/mocks/index.ts`

**Step 1: Write the failing test**

```ts
it('deve chamar GET /campeonato/partidas com grupoId opcional', () => {
  // valida URL e query param
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- --watch=false --runInBand src/app/data/partida/partida.spec.ts`
Expected: FAIL por service inexistente.

**Step 3: Write minimal implementation**

```ts
getPartidas(filters?: GetPartidasFiltrosDto) {
  return this.http.get<GetPartidasDto>(`${this.baseUrl}/campeonato/partidas`, {
    params: filters?.grupoId ? { grupoId: String(filters.grupoId) } : {},
  });
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- --watch=false --runInBand src/app/data/partida/partida.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/data/partida
git commit -m "feat(data/partida): add partidas client, dto and mocks"
```

### Task 5: Criar modulo de feature `src/app/partida`

**Files:**
- Create: `src/app/partida/partida.facade.ts`
- Create: `src/app/partida/partida.facade.spec.ts`
- Create: `src/app/partida/index.ts`
- Modify: `src/app/app.routes.ts`

**Step 1: Write the failing test**

```ts
it('deve expor metodo para carregar partidas delegando ao data/partida', () => {
  // facade chama service de data
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- --watch=false --runInBand src/app/partida/partida.facade.spec.ts`
Expected: FAIL por facade inexistente.

**Step 3: Write minimal implementation**

```ts
loadPartidas(filters?: GetPartidasFiltrosDto) {
  return this.partidaData.getPartidas(filters);
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- --watch=false --runInBand src/app/partida/partida.facade.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/partida src/app/app.routes.ts
git commit -m "feat(partida): add feature facade backed by data module"
```

### Task 6: Atualizar guia do frontend e validar suite minima

**Files:**
- Modify: `AGENTS.md`
- Modify: `src/app/data/classificacao/mocks/get-classificacao.dto.ts` (se ajustar padrao)

**Step 1: Write the failing test**

```ts
it('deve exportar generateGetClassificacaoDto no barrel de mocks', () => {
  expect(typeof generateGetClassificacaoDto).toBe('function');
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- --watch=false --runInBand src/app/data/classificacao/classificacao.spec.ts`
Expected: FAIL se export/barrel estiver inconsistente.

**Step 3: Write minimal implementation**

```ts
export * from './get-classificacao.dto';
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- --watch=false`
Expected: PASS

**Step 5: Commit**

```bash
git add AGENTS.md src/app/data/classificacao/mocks
git commit -m "docs(frontend): define data-layer conventions and mock factories"
```
