import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InstrumentService {
  private instrumentsUrl = 'https://localhost:52088/openlab/olss/v2.0/Instruments';
  private initializeUrl = 'https://localhost:52088/openlab/acquisition/v1/instruments';

  constructor(private http: HttpClient) { }

  getInstruments(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.instrumentsUrl, { headers });
  }

  initializeInstrument(globalId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.initializeUrl}/${globalId}:initialize`;
    return this.http.post(url, {}, { headers });
  }
}
