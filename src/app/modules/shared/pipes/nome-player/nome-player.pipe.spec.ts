import { NomePlayerPipe } from './nome-player.pipe';

describe(NomePlayerPipe.name, () => {
  let pipe: NomePlayerPipe;

  beforeEach(() => {
    pipe = new NomePlayerPipe();
  });

  it('deve instanciar o pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve retornar string vazia quando receber valor FALSY', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('deve retornar somente primeiro e ultimo nome quando houver mais de uma palavra', () => {
    const valor = pipe.transform('  Ronaldo   Nazario   de  Lima  ');

    expect(valor).toBe('Ronaldo Lima');
  });

  it('deve manter nome unico quando houver apenas uma palavra', () => {
    const valor = pipe.transform('Pelé');

    expect(valor).toBe('Pelé');
  });
});
