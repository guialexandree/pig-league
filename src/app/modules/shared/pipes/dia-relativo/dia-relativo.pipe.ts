import { Pipe, PipeTransform } from '@angular/core';
import { format, isToday, isValid, isYesterday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Pipe({
  name: 'diaRelativo',
  standalone: true,
})
export class DiaRelativoPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = this.parseDate(value);
    if (!date) {
      return '';
    }

    const dayLabel = this.resolveDayLabel(date);
    const hour = format(date, 'HH:mm');

    return hour === '00:00' ? dayLabel : `${dayLabel} às ${hour}`;
  }

  private parseDate(value: string | Date): Date | null {
    const parsed = value instanceof Date ? value : parseISO(value);

    return isValid(parsed) ? parsed : null;
  }

  private resolveDayLabel(date: Date): string {
    if (isToday(date)) {
      return 'hoje';
    }

    if (isYesterday(date)) {
      return 'ontem';
    }

    const weekDay = format(date, 'EEEE', { locale: ptBR }).split('-')[0];
    return weekDay.charAt(0).toUpperCase() + weekDay.slice(1);
  }
}
