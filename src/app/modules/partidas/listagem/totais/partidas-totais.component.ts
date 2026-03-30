import { Component, inject, OnInit } from '@angular/core';
import { PartidasTotaisService } from './partidas-totais.service';

@Component({
  selector: 'app-partidas-totais',
  standalone: true,
  templateUrl: './partidas-totais.component.html',
  styleUrl: './partidas-totais.component.scss',
})
export class PartidasTotaisComponent implements OnInit {
  readonly dataService = inject(PartidasTotaisService);

  ngOnInit(): void {
    this.dataService.carregar();
  }
}
