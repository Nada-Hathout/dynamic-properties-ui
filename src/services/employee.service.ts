import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:44302/api/Employee';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllEmployees`, { headers: this.getAuthHeaders() });
  }

  add(employee: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Add-Employee`, employee, { headers: this.getAuthHeaders() });
  }

  updateEmployee(employee: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-Employee`, employee, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`, { headers: this.getAuthHeaders() });
  }
  getAllProperties(): Observable<any> {
  return this.http.get<any>(`https://localhost:44302/api/CustomProperty/GetAllProperties`, { headers: this.getAuthHeaders() });
}
}
