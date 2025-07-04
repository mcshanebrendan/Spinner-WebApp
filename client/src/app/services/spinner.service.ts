import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private apiUrl = 'http://localhost:5000/spin'; // Directly hitting Flask

  constructor(private http: HttpClient) {}

  spin(options: string[]): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(this.apiUrl, { options });
  }
}
