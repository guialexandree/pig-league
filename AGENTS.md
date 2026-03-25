# AGENTS.md (Frontend - pig-league)

## Scope

Estas instrucoes valem para todo o projeto Angular em `pig-league/`.

## Estrutura de Modulos

- `src/app/data/*` contem camada de acesso a API (DTOs, services e mocks).
- Cada dominio em `data` deve ter estrutura minima:
  - `dto/` com arquivos de contrato e `index.ts`
  - `mocks/` com factories `generate....mock.ts` e `index.ts`
  - `*.ts` para o service/facade de acesso aos endpoints
  - `*.spec.ts` para testes unitarios

## Contratos e Nomenclatura

- Espelhar contratos do backend em DTOs TypeScript do frontend.
- Nomear factories de mock com prefixo `generate` (ex.: `generateGetClassificacaoDto`).
- Preferir nomes explicitos por caso de uso (ex.: `get-classificacao.dto.ts`).

## Consumo de API

- Usar `HttpClient` com tipagem de retorno por DTO.
- Para endpoints com filtro opcional, representar query params com DTO especifico de filtros.
- Evitar strings de URL espalhadas; centralizar paths/base URL em ponto unico quando iniciar integracao real.

## Testes

- Todo service de `data/*` deve ter `*.spec.ts` cobrindo:
  - chamada ao endpoint correto
  - serializacao de filtros opcionais
  - tipagem do payload esperado
- Nunca use valores truncados, abreviados ou placeholders pobres em testes.
- Sempre gere dados de teste com `@faker-js/faker`.
- Quando precisar de resultado deterministico, fixe a seed com `faker.seed(...)`.

## Importacoes

- Priorizar imports relativos curtos dentro do mesmo dominio.
- Usar `index.ts` (barrels) para reduzir acoplamento com caminhos internos de `dto/` e `mocks/`.

## UI e Estilos

- Priorizar classes utilitarias e componentes do Bootstrap quando atender ao caso.
- Usar SCSS customizado apenas para identidade visual, excecoes de layout e ajustes nao cobertos pelo Bootstrap.
