import { Pipe, PipeTransform } from '@angular/core';
import { format, isValid, parseISO } from 'date-fns';

@Pipe({
  name: 'dateTimeAt',
  standalone: true,
})
export class DateTimeAtPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) { return ''; }

    const date = this.parseDate(value);
    if (!date) { return ''; }

    const formattedDate = format(date, 'dd/MM/yyyy');
    const hour = format(date, 'HH:mm');

    return `${formattedDate} às ${hour}h`;
  }

  private parseDate(value: string | Date): Date | null {
    const parsedDate = value instanceof Date ? value : parseISO(value);
    return isValid(parsedDate) ? parsedDate : null;
  }
}
