import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetPartidasDto,
  GetPartidasFiltrosDto,
  GetPartidasRealizadasDto,
  GetPartidasRealizadasFiltrosDto,
} from './dto';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PartidaService {
  private readonly path = `${environment.apiUrl}/campeonato/partidas`;
  private readonly pathPartidasPendentes =
    `${environment.apiUrl}/campeonato/partidas-pendentes`;
  private readonly pathPartidasRealizadas =
    `${environment.apiUrl}/campeonato/partidas-realizadas`;

  private readonly http = inject(HttpClient);

  getPartidas(filters?: GetPartidasFiltrosDto): Observable<GetPartidasDto[]> {
    return this.http.get<GetPartidasDto[]>(this.path, {
      params: this.mapFiltrosToParams(filters),
    });
  }

  getPartidasPendentes(
    filters?: GetPartidasFiltrosDto,
  ): Observable<GetPartidasDto[]> {
    return this.http.get<GetPartidasDto[]>(this.pathPartidasPendentes, {
      params: this.mapFiltrosToParams(filters),
    });
  }

  getPartidasRealizadas(
    filters?: GetPartidasRealizadasFiltrosDto,
  ): Observable<GetPartidasRealizadasDto[]> {
    return this.http.get<GetPartidasRealizadasDto[]>(this.pathPartidasRealizadas, {
      params: this.mapFiltrosToParams(filters),
    });
  }

  private mapFiltrosToParams(
    filters?: GetPartidasFiltrosDto,
  ): HttpParams | undefined {
    if (filters?.grupoId === undefined) {
      return undefined;
    }

    return new HttpParams({
      fromObject: {
        grupoId: String(filters.grupoId),
      },
    });
  }
}
