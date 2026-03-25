import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetPartidasFiltrosDto } from './dto/get-partidas-filtros.dto';
import { GetPartidasDto } from './dto/get-partidas.dto';
import { environment } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PartidaService {
  private readonly path = `${environment.apiUrl}/campeonato/partidas`;

  private readonly http = inject(HttpClient);

  getPartidas(filters?: GetPartidasFiltrosDto): Observable<GetPartidasDto[]> {
    const params =
      filters?.grupoId === undefined
        ? undefined
        : new HttpParams({
            fromObject: {
              grupoId: String(filters.grupoId),
            },
          });

    return this.http.get<GetPartidasDto[]>(this.path, { params });
  }
}
