import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  executeGet<T>(endpoint: string, params: any = {}) {
    return this.http.get<T>(`${API_URL}${endpoint}`, params);
  }

  executeAuthGet<T>(endpoint: string, params: any, token: string) {
    return this.http.get<T>(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
  }

  executePost<T>(endpoint: string, body: any) {
    return this.http.post<T>(`${API_URL}${endpoint}`, body);
  }

  executeAuthPost<T>(endpoint: string, body: any, token: string) {
    return this.http.post<T>(`${API_URL}${endpoint}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  executePath<T>(endpoint: string, body: any) {
    return this.http.patch<T>(`${API_URL}${endpoint}`, body);
  }

  executeAuthPatch<T>(endpoint: string, body: any, token: string) {
    return this.http.patch<T>(`${API_URL}${endpoint}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  executeAuthDelete<T>(endpoint: string, token: string) {
    return this.http.delete<T>(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
