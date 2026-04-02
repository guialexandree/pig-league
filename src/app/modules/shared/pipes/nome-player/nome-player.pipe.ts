import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nomePlayer',
  standalone: true,
})
export class NomePlayerPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const nameChunks = value
      .trim()
      .split(/\s+/)
      .filter((chunk) => chunk.length > 0);

    if (nameChunks.length <= 1) {
      return nameChunks[0] ?? '';
    }

    return `${nameChunks[0]} ${nameChunks[nameChunks.length - 1]}`;
  }
}
