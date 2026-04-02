import { DiaRelativoPipe } from './dia-relativo.pipe';

describe(DiaRelativoPipe.name, () => {
  let pipe: DiaRelativoPipe;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 27, 15, 30, 0));
    pipe = new DiaRelativoPipe();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve instanciar o pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve retornar string vazia quando receber valor FALSY', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('deve exibir "hoje às HH:mm" quando a data for hoje e hora diferente de zero', () => {
    const valor = pipe.transform(new Date(2026, 2, 27, 18, 45, 0));

    expect(valor).toBe('hoje às 18:45');
  });

  it('deve exibir apenas "hoje" quando a data for hoje e hora zerada', () => {
    const valor = pipe.transform(new Date(2026, 2, 27, 0, 0, 0));

    expect(valor).toBe('hoje');
  });

  it('deve exibir "ontem às HH:mm" quando a data for ontem e hora diferente de zero', () => {
    const valor = pipe.transform(new Date(2026, 2, 26, 10, 5, 0));

    expect(valor).toBe('ontem às 10:05');
  });

  it('deve exibir apenas "ontem" quando a data for ontem e hora zerada', () => {
    const valor = pipe.transform(new Date(2026, 2, 26, 0, 0, 0));

    expect(valor).toBe('ontem');
  });

  it('deve exibir dia da semana capitalizado para datas mais antigas', () => {
    const valor = pipe.transform(new Date(2026, 2, 25, 21, 10, 0));

    expect(valor).toBe('Quarta às 21:10');
  });

  it('deve ocultar hora para dia da semana quando horario for 00:00', () => {
    const valor = pipe.transform(new Date(2026, 2, 25, 0, 0, 0));

    expect(valor).toBe('Quarta');
  });

  it('deve retornar string vazia quando receber data invalida', () => {
    const valor = pipe.transform('data-invalida');

    expect(valor).toBe('');
  });
});
