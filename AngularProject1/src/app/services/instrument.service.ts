import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InstrumentService {
  private instrumentsUrl = 'https://localhost:52088/openlab/olss/v3.0/instruments';
  private projectUrl = 'https://localhost:52088/openlab/olss/v4.0/projects';
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

  // Existing per-instrument status by globalId (kept as fallback)
  getInstrumentStatus(globalId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.initializeUrl}/${globalId}/status`;
    return this.http.get(url, { headers });
  }

  // batch status endpoint accepting an array of numeric instrument ids
  getInstrumentsStatusByIds(ids: number[], token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.instrumentsUrl}/status`;
    // The API expects a JSON array body like: [123, 456]
    return this.http.post(url, ids, { headers });
  }

  // submit run 
  submitRun(globalId: string, token: string, payload: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.initializeUrl}/${globalId}/runs:submit`;
    return this.http.post(url, payload, { headers });
  }

  //  get run queue for a given instrument globalId
  getRunQueue(globalId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.initializeUrl}/${globalId}/runs`;
    return this.http.get(url, { headers });
  }

  getProject(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.projectUrl, { headers });
  }

  getInstrumentConfigurationById(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.instrumentsUrl}/${id}/driveritems?name=configuration`;
    return this.http.get(url, { headers });
  }



}
