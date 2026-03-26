import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { faker } from '@faker-js/faker';
import { DateTimeAtPipe } from './date-time-at.pipe';

describe(DateTimeAtPipe.name, () => {
  let pipe: DateTimeAtPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        DateTimeAtPipe,
        { provide: DatePipe, useValue: jasmine.createSpyObj(['transform']) }
      ]
    }).compileComponents();

    pipe = TestBed.inject(DateTimeAtPipe);
  });

  it('deve instanciar o pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('deve retornar uma string vazia, quando for passado um valor FALSY', () => {
    const falsyValue = faker.helpers.arrayElement([null, undefined, ''])!;

    expect(pipe.transform(falsyValue)).toEqual('');
  });

  it('deve retornar a data formatada, usando o DatePipe', () => {
    const datePipeSpy = TestBed.inject(DatePipe) as jasmine.SpyObj<DatePipe>;

    const dataFake = faker.string.alphanumeric(8);
    const horaFake = faker.string.alphanumeric(4);
    const strDate = faker.date.past().toString();

    datePipeSpy.transform.withArgs(strDate, 'shortDate').and.returnValue(dataFake);
    datePipeSpy.transform.withArgs(strDate, 'HH:mm').and.returnValue(horaFake);

    const valorFormatado = pipe.transform(strDate);

    expect(datePipeSpy.transform)
      .withContext('Formatar a data com o DatePipe')
      .toHaveBeenCalledWith(strDate, 'shortDate');

    expect(datePipeSpy.transform)
      .withContext('Formatar a hora com o DatePipe')
      .toHaveBeenCalledWith(strDate, 'HH:mm');

    expect(valorFormatado)
      .withContext('Retornar o valor com a formatação correta')
      .toEqual(`${dataFake} às ${horaFake}h`);
  });
});
