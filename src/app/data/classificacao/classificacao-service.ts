import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadClassificacaoFiltersDto } from './dto/get-classificacao-filtros.dto';
import { GetClassificacaoDto } from './dto/get-classificacao.dto';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClassificacaoService {
  private readonly path = `${environment.apiUrl}/campeonato/classificacao`;
  private readonly http = inject(HttpClient);

  getClassificacao(filters?: LoadClassificacaoFiltersDto): Observable<GetClassificacaoDto[]> {
    const params = this.toParams(filters);
    return this.http.get<GetClassificacaoDto[]>(this.path, { params });
  }

  getClassificacaoGeral(filters?: LoadClassificacaoFiltersDto): Observable<GetClassificacaoDto[]> {
    const params = this.toParams(filters);
    return this.http.get<GetClassificacaoDto[]>(`${this.path}/geral`, { params });
  }

  private toParams(filters?: LoadClassificacaoFiltersDto): HttpParams | undefined {
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
