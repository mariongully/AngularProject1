import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginUrl = 'https://localhost:52088/openlab/olss/v1.0/login';

  constructor(private http: HttpClient) { }

  // Accept optional username/password; keep existing defaults when not provided
  login(username: string = 'admin', password: string = 'admin', domain : string = 'AGILENT'): Observable<any> {
    const body = {
      username,
      domain: domain,
      password,
      userApplication: 'olcds',
      clientDevice: 'PC02'
    };
    return this.http.post(this.loginUrl, body, { responseType: 'text' });
  }
}
