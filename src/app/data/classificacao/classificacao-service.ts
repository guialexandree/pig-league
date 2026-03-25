import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadClassificacaoFiltersDto } from './dto/get-classificacao-filtros.dto';
import { GetClassificacaoDto } from './dto/get-classificacao.dto';
import { environment } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ClassificacaoService {
  private readonly path = `${environment.apiUrl}/campeonato/classificacao`;
  private readonly http = inject(HttpClient);

  getClassificacao(filters?: LoadClassificacaoFiltersDto): Observable<GetClassificacaoDto[]> {
    const params =
      filters?.grupoId === undefined
        ? undefined
        : new HttpParams({
            fromObject: {
              grupoId: String(filters.grupoId),
            },
          });

    return this.http.get<GetClassificacaoDto[]>(this.path, { params });
  }
}
