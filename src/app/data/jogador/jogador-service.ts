import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetJogadoresDto } from './dto/get-jogadores.dto';
import { environment } from '@/environment/environment';

@Injectable({
  providedIn: 'root',
})
export class JogadorService {
  private readonly path = `${environment.apiUrl}/jogadores`;

  private readonly http = inject(HttpClient);

  getJogadores(): Observable<GetJogadoresDto> {
    return this.http.get<GetJogadoresDto>(this.path);
  }
}
