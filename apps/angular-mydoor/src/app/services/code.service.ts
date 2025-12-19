import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type SubmitCodeResponse = { success: boolean };

@Injectable({ providedIn: 'root' })
export class CodeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  submitCode(code: string): Observable<SubmitCodeResponse> {
    return this.http.post<SubmitCodeResponse>(`${this.baseUrl}/code/submit`, { code });
  }
}
