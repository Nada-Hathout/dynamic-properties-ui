import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Property {
   id?:number,
  Name: string;
  Type: number;
  IsRequired: boolean;
   DropdownOptions?: string[] | null;
}
@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  apiUrl = 'https://localhost:44302/api/CustomProperty';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/GetAllProperties`);
  }

  add(property: Property) {
    return this.http.post(`${this.apiUrl}/create-Property`, property);
  }

  update(property: Property) {
    return this.http.put(`${this.apiUrl}/update-property`, property);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/Delete/${id}`);
  }

}
