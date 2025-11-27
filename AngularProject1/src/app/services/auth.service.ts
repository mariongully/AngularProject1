import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginUrl = 'https://localhost:52088/openlab/olss/v1.0/login';

  constructor(private http: HttpClient) { }

  login(): Observable<any> {
    const body = {
      username: 'admin',
      domain: 'MYDOMAIN',
      password: 'admin',
      userApplication: 'olcds',
      clientDevice: 'PC02'
    };
    return this.http.post(this.loginUrl, body, { responseType: 'text' });
    
  }
}
``
