import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
  name: 'dateTimeAt',
})
export class DateTimeAtPipe implements PipeTransform {

  private datePipe = inject(DatePipe);

  transform(value: string) {
    if (!value) { return ''; }

    const date = this.datePipe.transform(value, 'shortDate');
    const hour = this.datePipe.transform(value, 'HH:mm');

    return `${date} às ${hour}h`;
  }
}
