import { Component, input } from '@angular/core';

@Component({
  selector: 'app-partidas-totais',
  standalone: true,
  templateUrl: './partidas-totais.component.html',
  styleUrl: './partidas-totais.component.scss',
})
export class PartidasTotaisComponent {
  readonly totalPartidas = input<number>(0);
  readonly totalRealizadas = input<number>(0);
  readonly totalPendentes = input<number>(0);
}
