import { routes } from './app.routes';

describe('app.routes', () => {
  it('deve carregar classificacao via lazy loading', () => {
    const classificacaoRoute = routes
      .flatMap((route) => route.children ?? [])
      .find((route) => route.path === 'classificacao');

    expect(classificacaoRoute).toBeDefined();
    expect(classificacaoRoute?.loadChildren).toBeDefined();
    expect(classificacaoRoute?.component).toBeUndefined();
  });

  it('deve carregar regras via lazy loading', () => {
    const regrasRoute = routes
      .flatMap((route) => route.children ?? [])
      .find((route) => route.path === 'regras');

    expect(regrasRoute).toBeDefined();
    expect(regrasRoute?.loadChildren).toBeDefined();
    expect(regrasRoute?.component).toBeUndefined();
  });
});
