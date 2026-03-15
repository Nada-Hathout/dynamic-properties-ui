import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'https://localhost:44302/api/Auth';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, data).pipe(
      tap(res => {
        // نفترض السيرفر بيرجع { token: "xxx" }
        if (res && res.token) {
          localStorage.setItem('token', res.token); // نخزن التوكن
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/register`, data);
  }

  logout() {
    localStorage.removeItem('token'); // لمسح التوكن عند logout
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}