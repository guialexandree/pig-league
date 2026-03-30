import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetPartidasDto,
  GetPartidasFiltrosDto,
  GetPartidasRealizadasDto,
  GetPartidasRealizadasFiltrosDto,
  GetPartidasTotaisDto,
} from './dto';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PartidaService {
  private readonly path = '/campeonato';

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

    return this.http.get<GetPartidasDto[]>(
      `${environment.apiUrl}${this.path}/partidas`,
      {
        params,
      },
    );
  }

  getPartidasPendentes(
    filters?: GetPartidasFiltrosDto,
  ): Observable<GetPartidasDto[]> {
    const params =
      filters?.grupoId === undefined
        ? undefined
        : new HttpParams({
            fromObject: {
              grupoId: String(filters.grupoId),
            },
          });

    return this.http.get<GetPartidasDto[]>(
      `${environment.apiUrl}${this.path}/partidas-pendentes`,
      {
        params,
      },
    );
  }

  getPartidasRealizadas(
    filters?: GetPartidasRealizadasFiltrosDto,
  ): Observable<GetPartidasRealizadasDto[]> {
    const params =
      filters?.grupoId === undefined
        ? undefined
        : new HttpParams({
            fromObject: {
              grupoId: String(filters.grupoId),
            },
          });

    return this.http.get<GetPartidasRealizadasDto[]>(
      `${environment.apiUrl}${this.path}/partidas-realizadas`,
      {
        params,
      },
    );
  }

  getPartidasTotais(): Observable<GetPartidasTotaisDto> {
    return this.http.get<GetPartidasTotaisDto>(
      `${environment.apiUrl}${this.path}/totais`,
    );
  }
}
