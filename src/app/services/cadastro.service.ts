import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private apiUrl = 'http://localhost:3001/api/cadastro';

  constructor(private http: HttpClient) {}

  // Salvar novo contato OU atualizar existente
  salvarCadastro(payload: Record<string, any>): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  listarCadastros(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  excluirCadastro(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}